import { UserRepository } from '../../users/repositories';
import { IrmaIssueTokenRepository } from '../../irma/repositories';
import { app, expect, request } from '../../../common/test-utils';
import config from '../../../config';
import { irmaApiMockServer, qrIssueJson } from '../../../common/irma-api-mock-server';

const API_USERS_REGISTRATION_URL = '/users/registration';
const API_IRMA_ISSUE_URL = '/irma/generate-tippiqid-issue-request';

const userJson = {
  email: 'just-another-user-e2e@example.com',
  password: 'test1234',
};

const userJson2 = {
  email: 'just-another-user-2-e2e@example.com',
  password: 'test1234',
};

describe('Generate tippiqid issue request', () => {
  let token;
  let token2;

  before(() => {
    irmaApiMockServer.start();
    return request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(userJson)
      .expect(201)
      .expect(res => {
        token = res.body.token;
      })
      .then(() => UserRepository.findByEmail(userJson.email))
      .then(user => user.set('emailIsVerified', true).save())
      .then(() => request(app)
        .post(API_USERS_REGISTRATION_URL)
        .send(userJson2)
        .expect(201)
        .expect(res => {
          token2 = res.body.token;
        }))
      .then(() => UserRepository.findByEmail(userJson2.email))
      .then(user => user.set('emailIsVerified', false).save());
  });

  after(() => {
    irmaApiMockServer.stop();
    return IrmaIssueTokenRepository.findOne({ session_token: qrIssueJson.u })
      .then(record => record.destroy())
      .then(() => UserRepository.findByEmail(userJson.email))
      .then(user => user.destroy())
      .then(() => UserRepository.findByEmail(userJson2.email))
      .then(user => user.destroy());
  }
  );

  it('should return a valid IRMA issue token when valid authorization header is provided', () =>
    request(app)
      .get(API_IRMA_ISSUE_URL)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(response => response.toJSON().text)
      .then(jsonResponse => expect(jsonResponse).to.deep.equal(JSON.stringify({
        qr: {
          u: `http://${config.irmaApiServerHost}:${config.irmaApiServerPort}/irma_api_server/api/v2/issue/${qrIssueJson.u}`,
          v: qrIssueJson.v,
          vmax: qrIssueJson.vmax,
        },
        token: qrIssueJson.u,
      })))
  );

  it('should return unauthorized when no authorization token is specified', () =>
    request(app)
      .get(API_IRMA_ISSUE_URL)
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false))
  );

  it('should return unauthorized with valid auth header but no verified email', () =>
    request(app)
      .get(API_IRMA_ISSUE_URL)
      .set('Authorization', `Bearer ${token2}`)
      .expect(403)
      .expect(res => expect(res.body).to.have.property('success', false))
  );
});
