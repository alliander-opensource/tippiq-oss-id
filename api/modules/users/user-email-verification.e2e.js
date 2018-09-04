import { ValidationError } from '../../common/errors';
import { superagent, expect } from '../../common/test-utils';

import {
  startEmailVerificationForUser,
  completeEmailVerificationWithToken,
} from './user-email-verification';

import { getEmailVerificationJwtForUserId, getJwtForUserId } from '../auth/auth';
import { UserRepository } from './repositories';

const mailcatcherBaseUrl = process.env.MAILCATCHER_URL || 'http://localhost:1080';
const mailcatcherMessages = `${mailcatcherBaseUrl}/messages`;

describe('UserEmailVerification', () => {
  before('clean mail queue', () => superagent.del(mailcatcherMessages));
  afterEach('clean mail queue', () => superagent.del(mailcatcherMessages));

  it('should send an email when email validation is started', () =>
    UserRepository
      .findByEmail('test@test.com')
      .then(startEmailVerificationForUser)
      .delay(100)
      .then(() =>
        superagent
          .get(mailcatcherMessages)
          .then(res => ({ ...res, body: JSON.parse(res.text) }))
          .then(res => Promise.all([
            expect(res.body).to.have.lengthOf(1),
            expect(res.body).to.have.deep.property('[0].subject', 'Bevestig je e-mailadres'),
          ]))
      )
  );

  it('should complete validation when a valid token is supplied', () =>
    UserRepository
      .findByEmail('test@test.com')
      .then(user => user.set('emailIsVerified', false).save())
      .then(user => getEmailVerificationJwtForUserId(user.get('id')))
      .then(token => completeEmailVerificationWithToken(token))
      .catch(ValidationError, e => expect(e.message).to.equal('Email is already verified'))
      .delay(100)
      .then(() => UserRepository.findByEmail('test@test.com'))
      .then(user => Promise.all([
        expect(user.get('emailIsVerified')).to.equal(true),
        superagent
          .get(mailcatcherMessages)
          .then(res => ({ ...res, body: JSON.parse(res.text) }))
          .then(res => Promise.all([
            expect(res.body).to.have.lengthOf(1),
            expect(res.body).to.have.deep.property('[0].subject', 'Je e-mailadres is nu bevestigd'),
          ])),
      ]))
  );

  it('should error when an email is already verified', () =>
    UserRepository
      .findByEmail('test@test.com')
      .then(user => user.set('emailIsVerified', true).save())
      .then(user => getEmailVerificationJwtForUserId(user.get('id')))
      .then(token =>
        expect(completeEmailVerificationWithToken(token))
          .to.eventually.be.rejected)
      .then(() => UserRepository.findByEmail('test@test.com'))
      .then(user => expect(user.get('emailIsVerified')).to.equal(true))
  );

  it('should not complete validation when an invalid token is supplied', () =>
    UserRepository
      .findByEmail('test@test.com')
      .then(user => user.set('emailIsVerified', false).save())
      .then(user => getJwtForUserId(user.get('id')))
      .then(token =>
        expect(completeEmailVerificationWithToken(token))
          .to.eventually.be.rejected)
      .then(() => UserRepository.findByEmail('test@test.com'))
      .then(user => expect(user.get('emailIsVerified')).to.equal(false))
  );

  // TODO Re-enable test when correct security model is implemented (tpx-864).
  // Note: see https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries/
  it('should not complete validation when an insecure token is supplied', () =>
    UserRepository
      .findByEmail('test@test.com')
      .then(user => user.set('emailIsVerified', false).save())
      .then(() => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE0NDc4NjY1NTZ9.8vrTM3khhZkc825rQ-_qd4bjbcVMp0i5JqkVptcROCQ') // eslint-disable-line max-len
      .then(token =>
        expect(completeEmailVerificationWithToken(token))
          .to.eventually.be.rejected)
      .then(() => UserRepository.findByEmail('test@test.com'))
      .then(user => expect(user.get('emailIsVerified')).to.equal(false))
  );
});
