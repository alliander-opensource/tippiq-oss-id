import { app, request, createTippiqPlacesServiceJwt } from '../../../common/test-utils';
import { UserRepository } from '../repositories';


const nonVerifiedEmailAddress = 'send-rendered-email-non-verified.e2e.@example.com';
const verifiedEmailAddress = 'send-rendered-email-verified.e2e.@example.com';

describe('Send rendered email to user', () => {
  const emailBody = {
    subject: 'Test mail from 3P service',
    html: '<html><h1>Test email from 3P service</h1></html>',
    text: 'Test email from 3P service',
  };

  let tippiqPlacesServiceToken;
  let nonVerifiedEmailUserId;
  let verifiedEmailUserId;

  before('create non verified user', () =>
    UserRepository
      .create({ email: nonVerifiedEmailAddress })
      .then(user => {
        nonVerifiedEmailUserId = user.get('id');
      })
  );

  before('create verified user', () =>
    UserRepository
      .create({ email: verifiedEmailAddress, email_is_verified: true })
      .then(user => {
        verifiedEmailUserId = user.get('id');
      })
  );

  before(() => createTippiqPlacesServiceJwt({ action: 'tippiq_id.user-send-rendered-mail' }).then((token) => {
    tippiqPlacesServiceToken = token;
  }));

  after(() => UserRepository.deleteById(nonVerifiedEmailUserId));
  after(() => UserRepository.deleteById(verifiedEmailUserId));

  it('should return 403 when not authorized', () =>
    request(app)
      .post(`/users/${nonVerifiedEmailUserId}/messages/email`)
      // Invalid token
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ')
      .set('Content-Type', 'application/json')
      .send(emailBody)
      .expect(403)
  );

  it('should return 404 when user is not found', () =>
    request(app)
      .post('/users/00000000-0000-0000-0000-000000000000/messages/email')
      .set('Authorization', `Bearer ${tippiqPlacesServiceToken}`)
      .set('Content-Type', 'application/json')
      .send(emailBody)
      .expect(404)
  );

  it('should return 412 when users email is not verified', () =>
    request(app)
      .post(`/users/${nonVerifiedEmailUserId}/messages/email`)
      .set('Authorization', `Bearer ${tippiqPlacesServiceToken}`)
      .set('Content-Type', 'application/json')
      .send(emailBody)
      .expect(412)
  );

  it('should return 202 when message is queued', () =>
    request(app)
      .post(`/users/${verifiedEmailUserId}/messages/email`)
      .set('Authorization', `Bearer ${tippiqPlacesServiceToken}`)
      .set('Content-Type', 'application/json')
      .send(emailBody)
      .expect(202)
  );
});
