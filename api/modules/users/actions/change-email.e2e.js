
import { app, expect, request } from '../../../common/test-utils';
import { UserRepository } from '../repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';
const API_USERS_CHANGE_EMAIL_URL = '/users/email';

const registrationJson = {
  email: 'email-changer-e2e@example.com',
  password: 'test1234',
};
const newEmail = 'new-email-e2e@example.com';

describe('Change email', () => {
  let token;

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(registrationJson)
      .expect(201)
      .expect((res) => {
        token = res.body.token;
      })
  );

  after(() =>
    UserRepository
      .findByEmail(newEmail)
      .then(user => user.destroy())
  );

  it('should return unauthorized when no authorization token is specified', () =>
    request(app)
      .post(API_USERS_CHANGE_EMAIL_URL)
      .send({ email: newEmail })
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false))
  );

  it('should return a success after the email has been changed', () =>
    request(app)
      .post(API_USERS_CHANGE_EMAIL_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: newEmail })
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
  );

  it('should return an error when an invalid email is supplied', () =>
    request(app)
      .post(API_USERS_CHANGE_EMAIL_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'invalid',
      })
      .expect(400)
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(res => expect(res.body).to.have.property('message', 'Invalid email'))
  );
});
