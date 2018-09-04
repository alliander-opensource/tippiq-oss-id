
import { app, expect, request } from '../../../common/test-utils';
import { UserRepository } from '../repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';
const API_USERS_REFRESH_TOKEN_URL = '/users/refresh-token';


const userJson = {
  email: 'refresh-token-e2e@example.com',
  password: 'test1234',
};

describe('Get refresh token', () => {
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

  it('should return refreshed token when authorization header is provided and valid', () =>
    request(app)
      .get(API_USERS_REFRESH_TOKEN_URL)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
      .expect(res => expect(res.body).to.have.property('token'))
      .expect(res => expect(typeof res.body.token).to.equal('string'))
  );

  it('should not return refresh token when authorization header is not provided', () =>
    request(app)
      .get(API_USERS_REFRESH_TOKEN_URL)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(res => expect(res.body).not.to.have.property('token'))
  );

  it('should not return refresh token when authorization header is invalid', () =>
    request(app)
      .get(API_USERS_REFRESH_TOKEN_URL)
      .set('Authorization', 'Bearer not.a.token')
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(res => expect(res.body).not.to.have.property('token'))
  );
});
