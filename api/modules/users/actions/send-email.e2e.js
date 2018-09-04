
import { verifyJWT, ACTIONS } from '../../auth/auth';
import { app, expect, request, createTippiqServiceJwt } from '../../../common/test-utils';
import { UserRepository } from '../repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';
const API_USERS_SEND_EMAIL_URL = '/users/send-email';

const registrationJson = {
  email: 'send-email.e2e.@example.com',
  password: 'test1234',
};

describe('Send email to user', () => {
  let userId;
  let serviceToken;

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(registrationJson)
      .expect(201)
      .expect(res =>
        verifyJWT(res.body.token, ACTIONS.LOGIN_SESSION)
        .then((decoded) => { userId = decoded.sub; }))
  );

  before(() => createTippiqServiceJwt({ action: 'tippiq_id.user-send-mail' }).then((token) => {
    serviceToken = token;
  }));

  after(() =>
    UserRepository
      .findByEmail(registrationJson.email)
      .then(user => user.destroy())
  );

  it('should fail when no valid token is supplied', () =>
    request(app)
      .post(API_USERS_SEND_EMAIL_URL)
      .send({ userId: '00000000-0000-0000-0000-000000000000' })
      .expect(403)
  );

  it('should return not found for invalid user id', () =>
    request(app)
      .post(API_USERS_SEND_EMAIL_URL)
      .set('Authorization', `Bearer ${serviceToken}`)
      .send({ userId: '00000000-0000-0000-0000-000000000000' })
      .expect(404)
  );

  it('should fail when template name is supplied with invalid characters', () =>
    request(app)
      .post(API_USERS_SEND_EMAIL_URL)
      .set('Authorization', `Bearer ${serviceToken}`)
      .send({
        userId,
        templateName: '../xyz',
      })
      .expect(400)
  );

  it('should fail when email needs a verified email but has no verification', () =>
    request(app)
      .post(API_USERS_SEND_EMAIL_URL)
      .set('Authorization', `Bearer ${serviceToken}`)
      .send({
        userId,
        userName: 'Guy Fieri',
        templateName: 'test-template',
        subject: 'onderwerp',
        content: {},
        verificationRequired: true,
      })
      .expect(412)
  );

  it('should return a success after the email has been send', () =>
    request(app)
      .post(API_USERS_SEND_EMAIL_URL)
      .set('Authorization', `Bearer ${serviceToken}`)
      .send({
        userId,
        templateName: 'test-template',
        subject: 'onderwerp',
        templateData: {
          userName: 'Guy Fieri',
        },
      })
      .expect(202)
      .expect(res => expect(res.body).to.have.property('success', true))
  );
});
