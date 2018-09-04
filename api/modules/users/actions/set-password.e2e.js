
import jwt from 'jsonwebtoken';

import { app, expect, request } from '../../../common/test-utils';
import { getResetPasswordJwtForUserId } from '../../auth/auth';
import { UserRepository } from '../repositories';

const API_USERS_REGISTRATION_URL = '/users/simple-registration';
const API_USERS_SET_PASSWORD_URL = '/users/set-password';

const registrationRequestBody = {
  email: 'set-password-e2e@example.com',
};


describe('Set password', () => {
  let sessionToken;
  let resetPasswordToken;

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(registrationRequestBody)
      .expect(201)
      .expect((res) => {
        sessionToken = res.body.token;
        getResetPasswordJwtForUserId(jwt.decode(sessionToken).sub)
          .then((token) => {
            resetPasswordToken = token;
          });
      })
  );

  after(() =>
    UserRepository
      .findByEmail(registrationRequestBody.email)
      .then(user => user.destroy())
  );

  it('should return a validation error when the password is invalid', () =>
    request(app)
      .post(API_USERS_SET_PASSWORD_URL)
      .send({
        password: 'test',
        resetPasswordToken,
      })
      .expect(400)
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(res => expect(res.body)
        .to.have.property('message', 'Wachtwoord moet uit minimaal 8 karakters bestaan'))
  );

  it('should return unauthorized when no token has been set', () =>
    request(app)
      .post(API_USERS_SET_PASSWORD_URL)
      .send({
        password: 'test1234',
      })
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(res => expect(res.body)
        .to.have.property('message', 'De verificatiecode is verlopen'))
  );

  it('should require a resetPasswordToken', () =>
    request(app)
      .post(API_USERS_SET_PASSWORD_URL)
      .set('Authorization', `Bearer ${sessionToken}`)
      .send({
        password: 'test1234',
      })
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(res => expect(res.body)
        .to.have.property('message', 'De verificatiecode is verlopen'))
  );

  it('should succeed with a resetPasswordToken in the body', () =>
    request(app)
      .post(API_USERS_SET_PASSWORD_URL)
      .send({
        password: 'test1234',
        resetPasswordToken,
      })
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
  );

  it('should only work once', () =>
    request(app)
      .post(API_USERS_SET_PASSWORD_URL)
      .send({
        password: 'test1234',
        resetPasswordToken,
      })
      .expect(400)
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(res => expect(res.body).to.have.property('message', 'Wachtwoord is al ingesteld'))
  );
});
