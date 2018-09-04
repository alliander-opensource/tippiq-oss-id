import jwt from 'jsonwebtoken';
import BPromise from 'bluebird';
import { app, request, expect } from '../../../common/test-utils';
import { getResetPasswordJwtForUserId, getSetupPasswordJwtForUserId } from '../../auth/auth';
import config from '../../../config';
import fake3pServiceProvider from '../../../testdata/fake3p-service-provider';

const API_USERS_LOGIN_URL = '/users/login';
const requestBody = {
  email: 'login@test.com',
  password: '8OO!gyxFR9qqB&We',
};

const requestBody2 = {
  email: 'login2@test.com',
  password: '8OO!gyxFR9qqB&We',
};

const invalidRequestBody = {
  email: 'login@test.com',
  password: 'invalid',
};

describe('Login', () => {
  it('should fail with invalid credentials', () =>
    request(app)
      .post(API_USERS_LOGIN_URL)
      .send({
        email: 'test@example.com',
        password: 'test',
      })
      .expect(403)
  );

  describe('rate limiting', () => {
    it('first attempt should succeed', () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send(requestBody)
        .expect(200)
    );

    it(`should not fail ${config.rateLimitMaxAttempts} times with correct passsword`, () => {
      const requests = [];

      for (let i = 0; i < config.rateLimitMaxAttempts; i += 1) {
        requests.push(request(app)
          .post(API_USERS_LOGIN_URL)
          .send(requestBody)
          .expect(200));
      }
      return BPromise.all(requests);
    });

    it(`should not fail after ${config.rateLimitMaxAttempts} successful attempts within a short period of time`, () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send(requestBody)
        .expect(200)
    );

    it(`should fail ${config.rateLimitMaxAttempts} times with wrong passsword`, () => {
      const requests = [];

      for (let i = 0; i < config.rateLimitMaxAttempts; i += 1) {
        requests.push(request(app)
          .post(API_USERS_LOGIN_URL)
          .send(invalidRequestBody)
          .expect(403));
      }
      return BPromise.all(requests);
    });

    it(`should fail with correct credentials after ${config.rateLimitMaxAttempts} failed attempts`, () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send(requestBody)
        .expect(403)
    );
  });

  describe('audience', () => {
    it(`not set should default to ${config.jwtAudience}`, () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send(requestBody2)
        .expect(200)
        .expect(res => expect(jwt.decode(res.body.token).aud).to.equal(config.jwtAudience))
    );

    it('invalid should return 403', () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send({
          audience: 'unknown',
          ...requestBody2,
        })
        .expect(403)
    );

    it(`should set to clientId ${fake3pServiceProvider.id}`, () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send({
          audience: fake3pServiceProvider.id,
          ...requestBody2,
        })
        .expect(200)
        .expect(res => expect(jwt.decode(res.body.token).aud).to.equal(fake3pServiceProvider.id))
    );
  });

  describe('token login', () => {
    let resetPasswordToken = null;
    let setupPasswordToken = null;
    let setupPasswordTokenInvalid = null;

    before(() =>
      getResetPasswordJwtForUserId('37181aa2-120a-11e5-a1d5-e7050c4109b3')
        .then(token => (resetPasswordToken = token))
    );

    before(() =>
      getSetupPasswordJwtForUserId('37181aa2-120a-11e5-a1d5-e7050c4109b3')
        .then(token => (setupPasswordToken = token))
    );

    before(() => // get setup token for user with password already set
      getSetupPasswordJwtForUserId('51181aa2-560a-11e5-a1d5-c7050c4109a4')
        .then(token => (setupPasswordTokenInvalid = token))
    );

    it('should fail to login with reset password token (for now)', () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send({ token: resetPasswordToken })
        .expect(403)
    );

    it('should fail to login with setup password token when password already set', () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send({ token: setupPasswordTokenInvalid })
        .expect(403)
    );

    it('should login with setup password token', () =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send({ token: setupPasswordToken })
        .expect(200)
        .expect(res => expect(jwt.decode(res.body.token).aud).to.equal(config.jwtAudience))
    );
  });
});
