import jwt from 'jsonwebtoken';
import _ from 'lodash';
import BPromise from 'bluebird';
import config from '../../../config';
import { app, expect, request } from '../../../common/test-utils'; // eslint-disable-line no-unused-vars
import validAttributes from '../../../testdata/attributes';
import { UserRepository } from '../../users/repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';

const nameAttribute = {
  id: '43321aa2-560a-11e5-a1d5-c7050c4106aa',
  userId: '12341aa2-120a-11e5-a1d5-e7050c4109a1',
  data: {
    type: 'user_name',
    name: 'Chuck Norris',
  },
  label: 'Mijn naam',
};

describe('Adding an attribute', () => {
  let token;
  let userId;

  const userJson = {
    email: 'add-attribute-e2e@example.com',
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

  after(() =>
    UserRepository
      .findByEmail(userJson.email)
      .then(user => user.destroy())
  );

  /**
   * Generate a signed JWT for a place.
   * @function getSignedPlaceJwt
   * @param {Object} [payload] To include in the token.
   * @returns {Promise<string>} JWT
   */
  function getSignedPlaceJwt(payload) {
    const JWT_OPTIONS = {
      algorithm: 'RS256',
      audience: config.jwtAudience,
      expiresIn: '5m',
      issuer: 'tippiq-places.local',
    };
    const placePrivateKey = config.privateKey; // Fake a generated set of keys
    const jwtPayload = _.defaults({}, payload);
    const jwtOptions = _.defaults({}, JWT_OPTIONS);
    return BPromise.try(() => jwt.sign(jwtPayload, placePrivateKey, jwtOptions));
  }

  it('should work with a placeToken', () => {
    const payload = { placeId: 'b63d545a-0633-11e6-b686-bb1d47039b65' };
    return getSignedPlaceJwt(payload)
      .then(placeToken =>
        request(app)
          .post('/attributes')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId,
            label: 'Mijn huis',
            data: {
              type: 'place_key',
              token: placeToken,
              placeId: payload.placeId,
            },
          })
          .expect(201));
  });

  it('should add an attribute when valid data is provided', () => {
    const validAttr = _.clone(validAttributes[0]);
    validAttr.userId = userId;
    delete validAttr.id;
    return request(app)
      .post('/attributes')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(validAttr)
      .expect(201);
  });


  it('should not add an attribute when label is missing', () => {
    const validAttr = _.clone(validAttributes[0]);
    validAttr.userId = userId;
    delete validAttr.label;
    delete validAttr.id;
    return request(app)
      .post('/attributes')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(validAttr)
      .expect(400);
  });

  it('should not add an attribute when payload is missing', () => {
    const validAttr = _.clone(validAttributes[0]);
    validAttr.userId = userId;
    delete validAttr.data;
    delete validAttr.id;
    return request(app)
      .post('/attributes')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(validAttr)
      .expect(400);
  });

  describe('Add unique attribute', () => {
    it('should succeed', () => {
      const validAttr = _.clone(nameAttribute);
      validAttr.userId = userId;
      delete validAttr.id;
      return request(app)
        .post('/attributes')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(validAttr)
        .expect(201);
    });

    it('should fail second time', () => {
      const validAttr = _.clone(nameAttribute);
      validAttr.userId = userId;
      delete validAttr.id;
      return request(app)
        .post('/attributes')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(validAttr)
        .expect(400);
    });
  });
});
