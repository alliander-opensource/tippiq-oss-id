import {
  app,
  createTippiqPlacesServiceJwt,
  expect,
  request,
} from '../../../common/test-utils';

const API_USERS_LOGIN_URL = '/users/login';
const API_USERS_GET_DISPLAY_NAME_URL_EMAIL = '/users/43211aa2-120a-11e5-a1d5-e7050c4109b1/display-name';
const API_USERS_GET_DISPLAY_NAME_URL_ATTRIBUTE = '/users/12341aa2-120a-11e5-a1d5-e7050c4109a1/display-name';
const API_USERS_GET_DISPLAY_NAME_NON_EXISTING = '/users/00000000-0000-0000-0000-000000000000/display-name';

const userJsonEmail = {
  email: 'get-display-name-email-e2e@example.com',
  password: '8OO!gyxFR9qqB&We',
};

const userDisplayName = 'Chuck Norris';
const userJsonNameAttribute = {
  email: 'get-display-name-attribute-e2e@example.com',
  password: '8OO!gyxFR9qqB&We',
};

describe('Get Display name', () => {
  let tokenUserEmail;
  let tokenUserNameAttribute;

  before(() =>
    request(app)
      .post(API_USERS_LOGIN_URL)
      .send(userJsonEmail)
      .expect(200)
      .expect((res) => {
        tokenUserEmail = res.body.token;
      })
  );

  before(() =>
    request(app)
      .post(API_USERS_LOGIN_URL)
      .send(userJsonNameAttribute)
      .expect(200)
      .expect((res) => {
        tokenUserNameAttribute = res.body.token;
      })
  );

  it('should return email address as display name when no display name attribute set', () =>
    request(app)
      .get(API_USERS_GET_DISPLAY_NAME_URL_EMAIL)
      .set('Authorization', `Bearer ${tokenUserEmail}`)
      .expect(200)
      .expect(res => expect(res.body.displayName).to.equal(userJsonEmail.email))
  );

  it('should return custom display name', () =>
    request(app)
      .get(API_USERS_GET_DISPLAY_NAME_URL_ATTRIBUTE)
      .set('Authorization', `Bearer ${tokenUserNameAttribute}`)
      .expect(200)
      .expect(res => expect(res.body.displayName).to.equal(userDisplayName))
  );

  it('should return an unauthorized error for another user', () =>
    request(app)
      .get(API_USERS_GET_DISPLAY_NAME_URL_ATTRIBUTE)
      .set('Authorization', `Bearer ${tokenUserEmail}`)
      .expect(403)
  );

  it('should return an unauthorized error for non existing user', () =>
    request(app)
      .get(API_USERS_GET_DISPLAY_NAME_NON_EXISTING)
      .set('Authorization', `Bearer ${tokenUserEmail}`)
      .expect(403)
  );

  describe('with a service user', () => {
    it('should return the display name', () =>
      createTippiqPlacesServiceJwt({ action: 'tippiq_id.get_user_display_name' })
        .then(token =>
          request(app)
            .get(API_USERS_GET_DISPLAY_NAME_URL_ATTRIBUTE)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(res => expect(res.body.displayName).to.equal(userDisplayName))
        )
    );

    it('should return the email address', () =>
      createTippiqPlacesServiceJwt({ action: 'tippiq_id.get_user_display_name' })
        .then(token =>
          request(app)
            .get(API_USERS_GET_DISPLAY_NAME_URL_EMAIL)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(res => expect(res.body.displayName).to.equal(userJsonEmail.email))
        )
    );

    it('should fail for an incorrect action', () =>
      createTippiqPlacesServiceJwt({ action: 'tippiq_id.incorrect-action' })
        .then(token =>
          request(app)
            .get(API_USERS_GET_DISPLAY_NAME_URL_EMAIL)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
        )
    );

    it('should fail for a non exising user', () =>
      createTippiqPlacesServiceJwt({ action: 'tippiq_id.get_user_display_name' })
        .then(token =>
          request(app)
            .get(API_USERS_GET_DISPLAY_NAME_NON_EXISTING)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
        )
    );
  });
});
