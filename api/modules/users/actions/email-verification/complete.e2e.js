/* eslint-disable max-nested-callbacks */
import {
  app,
  expect,
  request,
} from '../../../../common/test-utils';
import { getEmailVerificationJwtForUserId } from '../../../auth/auth';
import { completeEmailVerificationWithToken } from '../../user-email-verification';
import { UserRepository } from '../../repositories';

describe('GET /users/email-verification/complete', () => {
  let validToken;

  before(() =>
    UserRepository
      .findByEmail('test@test.com')
      .then(user => getEmailVerificationJwtForUserId(user.get('id')))
      .then((token) => {
        validToken = token;
      })
  );

  it('should succeed when a valid token is supplied', () =>
    request(app)
      .get('/users/email-verification/complete')
      .query({
        token: validToken,
      })
      .set('Accept', 'application/json')
      .expect(res => expect(res.body).to.have.property('message', 'E-mail verificatie voltooid.'))
      .expect(res => expect(res.body).to.have.property('emailVerifiedToken'))
      .expect(res => expect(res.body).to.have.property('success', true))
      .expect(200)
  );

  it('should return a validation error when an invalid token is supplied', () =>
    request(app)
      .get('/users/email-verification/complete')
      .query({
        token: 'invalidToken',
      })
      .set('Accept', 'application/json')
      .expect(res => expect(res.body).to.have.property('message',
        'Validatiefout: ongeldig token.'))
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(400)
  );

  it('should return a validation error when no token is supplied', () =>
    request(app)
      .get('/users/email-verification/complete')
      .set('Accept', 'application/json')
      .expect(res => expect(res.body).to.have.property('message',
        'Validatiefout: ongeldig token.'))
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(400)
  );

  it('should return an error when the email is already verified', () =>
    request(app)
      .get('/users/email-verification/complete')
      .query({
        token: validToken,
      })
      .set('Accept', 'application/json')
      .expect(res => expect(res.body).to.have.property('message',
        'Email is already verified.'))
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(400)
  );

  // See: https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries
  it('should not complete validation when an insecure token is supplied', () =>
    UserRepository
      .findById('48181aa2-560a-11e5-a1d5-c7050c4109ab')
      .then(user => user.set('emailIsVerified', false).save())
      .then(() =>
        completeEmailVerificationWithToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJlbWFpbCI6InRl' +
          'c3RAdGVzdC5jb20iLCJpYXQiOjE0NDc4NjY1NTZ9.8vrTM3khhZkc825rQ-_qd4bjbcVMp0i5JqkVptcROCQ')
          .then(() => new Error('Email verification succeeded with invalid token!'))
          .catch(() =>
            UserRepository
              .findById('48181aa2-560a-11e5-a1d5-c7050c4109ab')
              .then(user => expect(user.get('emailIsVerified')).to.equal(false))
          )
      )
  );
});
