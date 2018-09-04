
import jwt from 'jsonwebtoken';
import { getResetPasswordJwtForUserId } from '../../auth/auth';
import { app, expect, request } from '../../../common/test-utils';
import { UserRepository } from '../repositories';

const API_USERS_REGISTRATION_URL = '/users/simple-registration';
const API_USERS_CHANGE_PASSWORD_URL = '/users/password';
const initialPassword = 'test1234';
const newPassword = '5678sbcd';
const userJson = { email: 'password-changer-e2e@example.com' };

describe('Change password', () => {
  let token;

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(userJson)
      .expect(201)
      .expect((res) => {
        token = res.body.token;
      })
  );

  after(() =>
    UserRepository
      .findByEmail(userJson.email)
      .then(user => user.destroy())
  );

  it('should return a token after the password has been set', () =>
    request(app)
      .post(API_USERS_CHANGE_PASSWORD_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword: initialPassword,
      })
      .expect(res => expect(res.body).to.have.property('token'))
      .expect(res => expect(res.body).to.have.property('success', true))
      .expect(200)
  );

  it('should return a validation error when the new password is invalid', () =>
    request(app)
      .post(API_USERS_CHANGE_PASSWORD_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: initialPassword,
        newPassword: '12',
      })
      .expect(res => expect(res.body).to.have.property('message', 'Wachtwoord moet uit minimaal 8 karakters bestaan'))
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(400)
  );

  it('should return an error when the old password is incorrect', () =>
    request(app)
      .post(API_USERS_CHANGE_PASSWORD_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'NotTheRightPassword',
        newPassword,
      })
      .expect(res => expect(res.body).to.have.property('message', 'Invalid credentials'))
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(403)
  );

  it('should return unauthorized when no token has been set', () =>
    request(app)
      .post(API_USERS_CHANGE_PASSWORD_URL)
      .send({
        oldPassword: initialPassword,
        newPassword,
      })
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(403)
  );
});

describe('Change password when coming from the reset password flow', () => {
  let sessionToken;
  let resetPasswordToken;

  const registrationRequestBody = {
    email: 'password-resetter@example.com',
  };

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(registrationRequestBody)
      .expect(201)
      .expect((res) => {
        sessionToken = res.body.token;
        return getResetPasswordJwtForUserId(jwt.decode(sessionToken).sub)
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

  it('should return a token after the password has been set', () => {
    const requestBody = {
      resetPasswordToken,
      newPassword: 'test1234',
    };
    return request(app)
      .post(API_USERS_CHANGE_PASSWORD_URL)
      .send(requestBody)
      .expect(res => expect(res.body).to.have.property('token'))
      .expect(res => expect(res.body).to.have.property('success', true))
      .expect(200);
  });

  it('should return a validation error when the password is invalid', () => {
    const requestBody = {
      resetPasswordToken,
      newPassword: 'test',
    };
    return request(app)
      .post(API_USERS_CHANGE_PASSWORD_URL)
      .send(requestBody)
      .expect(400)
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(res => expect(res.body).to.have.property('message', 'Wachtwoord moet uit minimaal 8 karakters bestaan'));
  });

  it('should return unauthorized when reset password token has been set', () => {
    const requestBody = {
      newPassword: 'test1234',
    };
    return request(app)
      .post(API_USERS_CHANGE_PASSWORD_URL)
      .send(requestBody)
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false));
  });
});
