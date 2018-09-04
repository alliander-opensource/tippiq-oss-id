import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { app, expect, request } from '../../../common/test-utils';
import validAttributes from '../../../testdata/attributes';
import { UserRepository } from '../../users/repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';

describe('Update attribute', () => {
  let attributeUrl;
  let userId;
  let token;

  const userJson = {
    email: 'update-attribute-e2e@example.com',
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

  it('should update unaltered attribute', () => {
    const validAttr = _.clone(validAttributes[0]);
    validAttr.userId = userId;
    return request(app)
      .put(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(validAttr)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('userId', validAttr.userId));
  });

  it('should update label', () => {
    const validAttr = _.clone(validAttributes[0]);
    validAttr.userId = userId;
    validAttr.label = 'Updated label';
    return request(app)
      .put(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(validAttr)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('label', validAttr.label));
  });

  it('should update data', () => {
    const validAttr = _.clone(validAttributes[0]);
    validAttr.userId = userId;
    validAttr.data = {
      type: 'place_key',
      placeId: validAttributes[0].data.placeId,
    };
    return request(app)
      .put(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(validAttr)
      .expect(200)
      .expect(res => expect(res.body).to.have.deep.property('data.type',
        validAttr.data.type));
  });

  it('should not update when payload is invalid', () => {
    const validAttr = _.clone(validAttributes[0]);
    validAttr.userId = userId;
    validAttr.data = null;
    return request(app)
      .put(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(validAttr)
      .expect(400);
  });
});
