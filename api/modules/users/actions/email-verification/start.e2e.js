import {
  app,
  expect,
  request,
  createTippiqServiceJwt,
} from '../../../../common/test-utils';
import { UserRepository } from '../../repositories';

const API_USERS_REGISTRATION_URL = '/users/registration';

const verificationUser = {
  email: 'verification-e2e@example.com',
  password: 'test1234',
};

const alreadyRemindedUser = {
  email: 'verification-already-reminded-e2e@example.com',
  password: 'test1234',
};

const reminderUser = {
  email: 'verification-reminder-e2e@example.com',
  password: 'test1234',
};

describe('GET /users/email-verification/start', () => {
  let token;
  let serviceToken;
  let alreadyRemindedUserId;
  let reminderUserId;

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(verificationUser)
      .expect(201)
      .expect((res) => {
        token = res.body.token;
      })
  );

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(alreadyRemindedUser)
      .expect(201)
      .expect(() => UserRepository.findByEmail(alreadyRemindedUser.email)
        .then((user) => {
          alreadyRemindedUserId = user.get('id');
          return user.set({ emailIsVerified: true }).save();
        }))
  );

  before(() =>
    request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(reminderUser)
      .expect(201)
      .expect(() => UserRepository.findByEmail(reminderUser.email)
        .then((user) => { reminderUserId = user.get('id'); }))
  );

  before(() => createTippiqServiceJwt({ action: 'tippiq_id.start-email-verification' })
    .then((tippiqTokent) => { serviceToken = tippiqTokent; }));

  after(() => UserRepository.findByEmail(verificationUser.email).then(user => user.destroy()));
  after(() => UserRepository.findByEmail(reminderUser.email).then(user => user.destroy()));
  after(() => UserRepository.findByEmail(alreadyRemindedUser.email).then(user => user.destroy()));

  it('should require authentication', () =>
    request(app)
      .get('/users/email-verification/start')
      .expect(403)
  );

  it('should start the email verification when not yet verified', () =>
    request(app)
      .get('/users/email-verification/start?returnUrl=http://localhost:3001')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => expect(res.body).to.have.property('message', 'E-mail verificatie gestart.'))
      .expect(res => expect(res.body).to.have.property('success', true))
      .expect(200)
  );

  it('should not start the email verification reminder when already verified', () =>
    request(app)
      .get('/users/email-verification/start?returnUrl=http://localhost:3001' +
        `&remindUser=${alreadyRemindedUserId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${serviceToken}`)
      .expect(res => expect(res.body).to.have.property('message',
        'Email address already verified.'))
      .expect(res => expect(res.body).to.have.property('success', false))
      .expect(400)
  );

  it('should start the email verification reminder', () =>
    request(app)
      .get('/users/email-verification/start?returnUrl=http://localhost:3001' +
        `&remindUser=${reminderUserId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${serviceToken}`)
      .expect(res => expect(res.body).to.have.property('message', 'E-mail verificatie gestart.'))
      .expect(res => expect(res.body).to.have.property('success', true))
      .expect(200)
  );
});
