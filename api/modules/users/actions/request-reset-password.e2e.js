import BPromise from 'bluebird';

import config from '../../../config';
import { app, expect, request } from '../../../common/test-utils';

const API_USERS_REQUEST_RESET_PASSWORD_URL = '/users/request-reset-password';

describe('Reset password', () => {
  describe('with a non existing email address', () => {
    const requestBody = {
      email: 'oempaloempa@tippiq.nl',
    };

    it('should return success', () => request(app)
      .post(API_USERS_REQUEST_RESET_PASSWORD_URL)
      .send(requestBody)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
    );
  });

  describe('with an existing email address', () => {
    const requestBody = {
      email: 'reset@test.com',
    };

    it('should return success', () => request(app)
      .post(API_USERS_REQUEST_RESET_PASSWORD_URL)
      .send(requestBody)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
    );

    it('should succeed 9 more times', () => {
      const requests = [];

      for (let i = 1; i < config.rateLimitMaxAttempts; i += 1) {
        requests.push(request(app)
          .post(API_USERS_REQUEST_RESET_PASSWORD_URL)
          .send(requestBody)
          .expect(200));
      }
      return BPromise.all(requests);
    }).timeout(0);

    it(`should fail after ${config.rateLimitMaxAttempts} attempts within a short period of time`, () =>
      request(app)
        .post(API_USERS_REQUEST_RESET_PASSWORD_URL)
        .send(requestBody)
        .expect(403)
    );
  });
});
