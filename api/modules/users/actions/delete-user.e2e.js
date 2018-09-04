import jwt from 'jsonwebtoken';

import { app, expect, request } from '../../../common/test-utils';

const API_USERS_LOGIN_URL = '/users/login';
const API_USERS_REGISTRATION_URL = '/users/registration';
const API_USERS_SIMPLE_REGISTRATION_URL = '/users/simple-registration';
const API_USERS_DELETE_URL = '/users/delete-user';
const password = '1234ABCD';
const adminEmail = 'test@test.com';
const adminPassword = '8OO!gyxFR9qqB&We';
const incorrectUserId = '07690a6e-e1c8-40bc-a197-24c1c020b1f1';

describe('Delete user - ', () => {
  describe('without password set', () => {
    let token;
    let userId;

    before(() =>
      request(app)
        .post(API_USERS_SIMPLE_REGISTRATION_URL)
        .send({
          email: 'simple-user-e2e@example.com',
        })
        .expect(201)
        .expect((res) => {
          token = res.body.token;
          userId = jwt.decode(res.body.token).sub;
        })
    );

    it('should fail to delete user when password not valid', () =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: userId,
          password: 'x',
        })
        .expect(400)
        .expect(res => expect(res.body).to.have.property('success', false))
    );

    it('should delete user when password is empty', () =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: userId,
          password: '',
        })
        .expect(204)
    );
  });

  describe('with password set', () => {
    let token;
    let userId;
    let otherUserToken;
    let otherUserId;

    before(() =>
      request(app)
        .post(API_USERS_REGISTRATION_URL)
        .send({
          email: 'user-with-password-e2e@example.com',
          password,
        })
        .expect(201)
        .expect((res) => {
          token = res.body.token;
          userId = jwt.decode(res.body.token).sub;
        })
    );

    before(() =>
      request(app)
        .post(API_USERS_REGISTRATION_URL)
        .send({
          email: 'other-user-e2e@example.com',
          password,
        })
        .expect(201)
        .expect((res) => {
          otherUserToken = res.body.token;
          otherUserId = jwt.decode(res.body.token).sub;
        })
    );

    after(() =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({
          id: otherUserId,
          password,
        })
        .expect(204)
    );

    it('should fail to delete user when password not valid', () =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: userId,
          password: 'x',
        })
        .expect(403)
        .expect(res => expect(res.body).to.have.property('success', false))
    );

    it('should fail to delete user when password is empty', () =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: userId,
          password: '',
        })
        .expect(res => expect(res.body).to.have.property('success', false))
        .expect(403)
    );

    it('should fail to delete user for incorrect user id', () =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: incorrectUserId,
          password,
        })
        .expect(res => expect(res.body).to.have.property('success', false))
        .expect(403)
    );

    it('should fail to delete other user', () =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: otherUserId,
          password,
        })
        .expect(403)
    );

    it('should delete user when password is valid', () =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: userId,
          password,
        })
        .expect(204)
    );
  });

  describe('admin', () => {
    let adminToken;
    let userToDeleteId;
    const userEmail = 'user-to-delete-e2e@example.com';

    before(() =>
      request(app)
        .post(API_USERS_SIMPLE_REGISTRATION_URL)
        .send({
          email: userEmail,
        })
        .expect(201)
        .expect((res) => {
          userToDeleteId = jwt.decode(res.body.token).sub;
        })
    );

    before(() =>
      request(app)
        .post(API_USERS_LOGIN_URL)
        .send({
          email: adminEmail,
          password: adminPassword,
        })
        .expect((res) => {
          adminToken = res.body.token;
        })
    );

    it('should delete another user', () =>
      request(app)
        .post(API_USERS_DELETE_URL)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          id: userToDeleteId,
          password: adminPassword,
        })
        .expect(204)
    );
  });
});
