import { app, expect, request } from '../../../common/test-utils';

const API_USERS_CHECK_EMAIL_URL = '/users/check-email';

describe('Check email', () => {
  it('should return success if email found', () =>
    request(app)
      .post(API_USERS_CHECK_EMAIL_URL)
      .send({
        email: 'test@test.com',
      })
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
  );

  it('should return success if email found even if casing is off', () =>
    request(app)
      .post(API_USERS_CHECK_EMAIL_URL)
      .send({
        email: 'TEST@test.com',
      })
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
  );

  it('should not return success if email not found', () =>
    request(app)
      .post(API_USERS_CHECK_EMAIL_URL)
      .send({
        email: 'not-found@test.com',
      })
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', false))
  );
});
