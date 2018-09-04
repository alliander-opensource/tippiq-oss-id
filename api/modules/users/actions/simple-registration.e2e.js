
import { app, expect, request } from '../../../common/test-utils';
import { UserRepository } from '../repositories';

const API_USERS_AUTO_CREATE_URL = '/users/simple-registration';

describe('Simple-registration', () => {
  describe('with only an email address', () => {
    const requestBody = {
      email: 'simple-registration-e2e@example.com',
    };
    it('should set a token in the response', () => request(app)
      .post(API_USERS_AUTO_CREATE_URL)
      .send(requestBody)
      .expect(201)
      .expect(res => Promise
        .all([
          expect(res.body).to.have.property('success', true),
          expect(res.body).to.have.property('token'),
        ])
      )
    );
    after('clean up', () => UserRepository
      .findByEmail(requestBody.email)
      .then(user => user.destroy())
    );
  });

  it('should fail when the email address is missing', () => request(app)
    .post(API_USERS_AUTO_CREATE_URL)
    .send({})
    .expect(400)
    .expect(res => Promise
      .all([
        expect(res.body).to.have.property('success', false),
      ])
    )
  );

  it('should fail when the email address is invalid', () => request(app)
    .post(API_USERS_AUTO_CREATE_URL)
    .send({
      email: 'invalid',
    })
    .expect(400)
    .expect(res => Promise
      .all([
        expect(res.body).to.have.property('success', false),
      ])
    )
  );
});
