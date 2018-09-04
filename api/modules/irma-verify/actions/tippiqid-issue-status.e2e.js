import { UserRepository } from '../../users/repositories';
import { app, expect, request } from '../../../common/test-utils';
import { IrmaIssueTokenRepository } from '../../irma/repositories';
import { irmaApiMockServer } from '../../../common/irma-api-mock-server';

const API_USERS_IRMA_ISSUE_STATUS_URL = '/irma/tippiqid-issue-status';
const API_USERS_REGISTRATION_URL = '/users/registration';

const userJson = {
  email: 'just-another-user-e2e@example.com',
  password: 'test1234',
};

describe('Update tippiqid issue status', () => {
  let userId;
  const createdAt = new Date();
  const issueToken = '2Dr9QBuGNLVn48fyERQdcWLsruyedSr7FUiCXsDRNxE3';
  let issueId;

  before('add test data', () => {
    irmaApiMockServer.start();

    return request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(userJson)
      .expect(201)
      .then(() => UserRepository.findByEmail(userJson.email))
      .then(record => (userId = record.get('id')))
      .then(() => IrmaIssueTokenRepository.create({
        session_token: issueToken,
        created_at: createdAt,
        user: userId,
      }))
      .then(record => (issueId = record.get('id')))
      .then(() => IrmaIssueTokenRepository.updateTokenWithIssueStatus(issueToken, 'TESTDONE'));
  });

  after('remove test data', () => {
    irmaApiMockServer.stop();
    return IrmaIssueTokenRepository.deleteById(issueId)
      .then(() => UserRepository.deleteById(userId));
  });

  it('should return 404 when no issue token is supplied', () =>
    request(app)
      .get(API_USERS_IRMA_ISSUE_STATUS_URL)
      .send()
      .expect(404)
  );

  it('should return 403 with invalid issue token', () =>
    request(app)
      .get(`${API_USERS_IRMA_ISSUE_STATUS_URL}/INVALID`)
      .send()
      .expect(403)
  );

  it('should return correct issue status with valid issue token', () =>
    request(app)
      .get(`${API_USERS_IRMA_ISSUE_STATUS_URL}/${issueToken}`)
      .send()
      .expect(200)
      .then(response => expect(response.body).to.deep.equal({
        status: 'TESTDONE',
      }))
  );
});
