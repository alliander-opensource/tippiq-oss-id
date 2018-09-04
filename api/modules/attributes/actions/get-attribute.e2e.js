import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { app, expect, request } from '../../../common/test-utils';
import validAttributes from '../../../testdata/attributes';
import { UserRepository } from '../../users/repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';

describe('Get attribute', () => {
  let attributeUrl;
  let userId;
  let token;

  const userJson = {
    email: 'get-attribute-e2e@example.com',
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

  it('should send 403 when not authorized ', () =>
    request(app)
      .get(attributeUrl)
      .set('Accept', 'application/json')
      .expect(403)
  );

  it('should return 200 if the attribute exists', () =>
    request(app)
      .get(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('id');
        return true;
      })
  );

  it('should return 404 if the attribute does not exist', () =>
    request(app)
      .get('/api/attributes/00000000-0000-0000-0000-000000000000')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  );
});
