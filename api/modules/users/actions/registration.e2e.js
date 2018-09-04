
import { app, expect, request } from '../../../common/test-utils';
import { UserRepository } from '../repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';

describe('Registration', () => {
  const requestBody = {
    email: 'registration-e2e@example.com',
    password: 'test1234',
  };

  it('should set a token in the response', () =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(requestBody)
      .expect(201)
      .expect(res => Promise
        .all([
          expect(res.body).to.have.property('success', true),
          expect(res.body).to.have.property('token'),
        ])
      )
  );

  it('should fail with invalid email', () =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send({
        email: 'invalid',
        password: 'test1234',
      })
      .expect(400)
      .expect(res => Promise
        .all([
          expect(res.body).to.have.property('success', false),
          expect(res.body).to.have.property('message', 'Invalid email'),
        ])
      )
  );

  it('should fail with invalid password', () =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send({
        email: 'registration-2-e2e@example.com',
        password: 'test',
      })
      .expect(400)
      .expect(res => Promise
        .all([
          expect(res.body).to.have.property('success', false),
          expect(res.body).to.have.property('message',
            'Wachtwoord moet uit minimaal 8 karakters bestaan'),
        ])
      )
  );

  after('clean up', () => UserRepository
    .findByEmail(requestBody.email)
    .then(user => user.destroy())
  );
});
