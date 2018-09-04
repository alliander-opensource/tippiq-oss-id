import { app, expect, request } from '../../../common/test-utils';

const API_USERS_LOGIN_URL = '/users/login';
const API_GET_SERVICE_PROVIDER_URL = '/service-provider';

const email = 'test@example.com';
const password = '8OO!gyxFR9qqB&We';
const clientId = 'b63d545a-0633-11e6-b686-bb1d47039b65';

describe('Get service provider', () => {
  before(() =>
   request(app)
    .post(API_USERS_LOGIN_URL)
    .send({ email, password })
  );

  it('return service provider info', () =>
    request(app)
      .get(`${API_GET_SERVICE_PROVIDER_URL}/${clientId}`)
      .expect(200)
      .expect(res => expect(res.body.name).to.equal('Fake Third Party'))
      .expect(res => expect(res.body).to.have.property('logo'))
      .expect(res => expect(res.body.brandColor).to.equal('ff876a'))
  );
});
