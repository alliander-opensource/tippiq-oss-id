import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { app, request } from '../../common/test-utils';
import validAttributes from '../../testdata/attributes';
import { UserRepository } from '../users/repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';

describe('Attribute validation', () => {
  let attributeUrl;
  let userId;
  let token;

  const userJson = {
    email: 'attribute-validation-e2e@example.com',
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
    (attributeUrl ?
      request(app)
        .del(attributeUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      : true)
  );

  after(() =>
    UserRepository
      .findByEmail(userJson.email)
      .then(user => user.destroy())
  );

  it('validation should fail when user does not exist', () => {
    const invalidAttr = _.clone(validAttributes[0]);
    invalidAttr.userId = '00000000-0000-0000-0000-000000000000';
    delete invalidAttr.id;
    return request(app)
      .put(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidAttr)
      .expect(400);
  });
});
