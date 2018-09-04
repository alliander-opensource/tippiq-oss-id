import { app, expect, request, createTippiqServiceJwt } from '../../../common/test-utils';

const API_SEND_EMAIL_URL = '/email/send-email';

const requestBody = {
  from: 'test@tippiq.com',
  to: 'test@test.com',
  subject: 'Test',
  templateName: 'test-template',
  templateData: {},
};

describe('Send Email', () => {
  let serviceToken;

  before(() => createTippiqServiceJwt({ action: 'tippiq_id.send-mail' }).then((token) => {
    serviceToken = token;
  }));

  // TODO Re-enable test when correct security model is implemented (tpx-864).
  xit('should not send email without authentication', () =>
    request(app)
      .post(API_SEND_EMAIL_URL)
      .set('Content-Type', 'application/json')
      .send(requestBody)
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false))
  );

  it('should send email with tippiq service authentication', () =>
    request(app)
      .post(API_SEND_EMAIL_URL)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${serviceToken}`)
      .send(requestBody)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('success', true))
  );
});
