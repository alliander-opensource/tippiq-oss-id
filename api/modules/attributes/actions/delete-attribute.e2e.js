import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { app, request } from '../../../common/test-utils';
import validAttributes from '../../../testdata/attributes';
import { UserRepository } from '../../users/repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';

describe('Delete attribute', () => {
  let attributeUrl;
  let userId;
  let token;

  const userJson = {
    email: 'delete-attribute-e2e@example.com',
    password: 'test1234',
  };

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(userJson)
      .expect(201)
      .expect((res) => {
        token = res.body.token;
        userId = jwt.decode(res.body.token).sub;
      })
  );

  before(() => {
    const validAttr = _.clone(validAttributes[0]);
    validAttr.userId = userId;
    delete validAttr.id;
    return request(app)
      .post('/attributes')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(validAttr)
      .expect(201)
      .expect((res) => {
        attributeUrl = res.headers.location;
      });
  });

  after(() =>
    UserRepository
      .findByEmail(userJson.email)
      .then(user => user.destroy())
  );

  it('should send 403 when not authorized', () =>
    request(app)
      .del(attributeUrl)
      .expect(403)
  );

  it('should remove an attribute when valid url is provided', () =>
    request(app)
      .del(attributeUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  );

  it('should work only once', () =>
    request(app)
      .del(attributeUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  );

  it('should require an existing attribute', () =>
    request(app)
      .del('/attributes/non-existing-id')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  );
});
