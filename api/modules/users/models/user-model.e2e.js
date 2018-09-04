import jwt from 'jsonwebtoken';
import { UserRepository, UserRoleRepository } from '../repositories';
import { app, expect, request } from '../../../common/test-utils';
import { ROLES } from '../../auth/auth';

const API_USERS_REGISTRATION_URL = '/users/registration';

describe('UserModel', () => {
  let userId;

  const userJson = {
    email: 'test-user-model-e2e@example.com',
    password: 'test1234',
  };

  beforeEach(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(userJson)
      .expect(201)
      .expect((res) => {
        userId = jwt.decode(res.body.token).sub;
      })
  );

  beforeEach(() =>
    UserRoleRepository.create({ user: userId, role: ROLES.SERVICE })
  );

  afterEach(() =>
    UserRoleRepository
      .findOne({ user: userId })
      .then(userRole => userRole.destroy())
  );

  afterEach(() =>
    UserRepository
      .findOneByWhere({ id: userId })
      .then(user => user.destroy())
  );

  it('should return true for a user that has the specified role', () =>
    UserRepository
      .findOneByWhere({ id: userId })
      .then(user => expect(user.hasRole(ROLES.SERVICE)).to.equal(true))
  );

  it('should return false for a user without the specified role', () =>
    UserRepository
      .findOneByWhere({ id: userId })
      .then(user => expect(user.hasRole(ROLES.ADMINISTRATOR)).to.equal(false))
  );
});
