/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import BPromise from 'bluebird';
import _ from 'lodash';
import { app, expect, request } from '../../../common/test-utils';
import validAttributes from '../../../testdata/attributes';
import { UserRepository } from '../../users/repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';

describe('Get attributes', () => {
  const attributeUrls = [];
  let userId;
  let token;

  const userJson = {
    email: 'get-attributes-e2e@example.com',
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

  function addAttribute(attributeParam) {
    const attribute = _.clone(attributeParam);
    delete attribute.id;
    attribute.userId = userId;
    return request(app)
      .post('/attributes')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(attribute)
      .expect(201)
      .expect((res) => {
        attributeUrls.push(res.headers.location);
      });
  }

  function deleteAttribute(url) {
    return request(app)
      .del(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  }

  before(() =>
    BPromise.all([
      addAttribute(validAttributes[0]),
      addAttribute(validAttributes[1]),
    ])
  );

  after(() =>
    (attributeUrls ?
      BPromise.all([
        deleteAttribute(attributeUrls[0]),
        deleteAttribute(attributeUrls[1]),
      ]) : true)
  );

  after(() =>
    UserRepository
      .findByEmail(userJson.email)
      .then(user => user.destroy())
  );

  it('should return 200 if the attribute exists', () =>
    request(app)
      .get('/attributes')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => expect(res.body.length).to.equal(2))
  );
});
