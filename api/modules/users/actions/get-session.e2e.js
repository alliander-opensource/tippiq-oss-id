
import { UserRepository } from '../repositories';

import { app, expect, request } from '../../../common/test-utils';

const API_USERS_REGISTRATION_URL = '/users/registration';
const API_USERS_GET_SESSION_URL = '/users/get-session';
const userJson = {
  email: 'just-another-user-e2e@example.com',
  password: 'test1234',
};

describe('Get session', () => {
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

  it('return session when authorization header is provided and valid', () =>
    request(app)
      .get(API_USERS_GET_SESSION_URL)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('token'))
  );

  it('should return unauthorized when no authorization token is specified', () =>
    request(app)
      .get(API_USERS_GET_SESSION_URL)
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false))
  );
});
