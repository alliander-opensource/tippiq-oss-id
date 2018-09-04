import { app, expect, request } from '../../../common/test-utils';

const API_SEND_SERVICE_EMAIL_URL = '/email/send';

const clientId = 'b63d545a-0633-11e6-b686-bb1d47039b65';
const clientSecret = '123';
const requestBody = {
  data: {
    frontendBaseUrl: 'http://reference3p.example.com',
    serviceName: 'Reference 3P',
    policies: [
      { title: 'Reference 3P mag mijn gegevens uitlezen.' },
      { title: 'Reference 3P mag mijn gegevens anoniem delen' },
    ],
  },
  from: 'test@test.com',
  subject: 'Test',
  templateName: 'policies-set',
  userId: '48181aa2-560a-11e5-a1d5-c7050c4109ab',
};

describe('Send service email', () => {
  it('should accept basic auth', () =>
    request(app)
      .post(API_SEND_SERVICE_EMAIL_URL)
      .auth(clientId, clientSecret)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(requestBody))
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
  );

  it('should fail when client secret is invalid', () =>
    request(app)
      .post(API_SEND_SERVICE_EMAIL_URL)
      .auth(clientId, 'invalid-secret')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(requestBody))
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false))
  );

  it('should fail when userId is not registered', () =>
    request(app)
      .post(API_SEND_SERVICE_EMAIL_URL)
      .auth(clientId, clientSecret)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        ...requestBody,
        userId: '00000000-0000-0000-0000-000000000000',
      }))
      .expect(400)
      .expect(res => expect(res.body).to.have.property('success', false))
  );

  it('should fail when templateName is invalid', () =>
    request(app)
      .post(API_SEND_SERVICE_EMAIL_URL)
      .auth(clientId, clientSecret)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        ...requestBody,
        templateName: 'invalid-template',
      }))
      .expect(400)
      .expect(res => expect(res.body).to.have.property('success', false))
  );
});
