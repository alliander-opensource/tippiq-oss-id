import { UserRepository } from '../../users/repositories';
import { app, request } from '../../../common/test-utils';
import { IrmaIssueTokenRepository } from '../../irma/repositories';
import { irmaApiMockServer } from '../../../common/irma-api-mock-server';

const API_USERS_IRMA_COMPLETE_ISSUE_URL = '/irma/complete-tippiqid-issue-request';
const API_USERS_REGISTRATION_URL = '/users/registration';

const userJson = {
  email: 'just-another-user-e2e@example.com',
  password: 'test1234',
};

describe('Complete tippiqid issue request', () => {
  let userId;
  const issueTokenOne = '2Dr9QBuGNLVn48fyERQdcWLsruyedSr7FUiCXsDRNxE3';
  const issueTokenTwo = '2Dr9QBuGNLVn48fyERQdcWLsruyedSr7FUiCXsDRNxE4';
  let issueIdOne;
  let issueIdTwo;

  const validApiServerToken =
           'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJpcm1hX3N0YXR1cyIsImV4cCI6MzM3NDA' +
           '1MjYzOSwiaWF0IjoxNDgwNTk2NjM5LCJzdGF0dXMiOiJET05FIn0.zpVF7AhzZSa' +
           'uB_bKOHAyHhNkm-0BvX11XIMzG0DgrJIZnYDWXydyR_hpA6Jlo433G7PZY43J0BW' +
           '7AhAExvJPQIfCTfrmKRwU1PvhGXBiIzHfm-zKebyPM_d5D20_xGIIeKaEmV1_M6W' +
           'qHlU2oozz1gMJbedjT_S7iHVRgaXwXGHfOBa2ungc91dH6cLUL62XCGRAsGjwclH' +
           '7X-ucAbSAUWtAicUgXCrjtfr799CXWV5J7lJfaUjDMX8F6bIXEgGWmJYQzMkv8in' +
           'R49x4TN4bcn9ZCNUlSh9fOKvfJrByUhIZl1CzRK0Hl9OHvWtjCPG_Yr0tdTfX5ip' +
           'urF2bKtb9Ng';

  const invalidStatusApiServerToken =
           'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJpcm1hX3N0YXR1cyIsImV4cCI6MzM3NDA' +
           '1MzE1MCwic3RhdHV6eiI6IkRPTkUiLCJpYXQiOjE0ODA1OTcxNTB9.JKxSi7FLwG' +
           '953dyXdwdZnmGNHt4a4CIXlPPOUn44tXpiWnPUtRwEQtC9b54hf1Bh-B9DzRmZrG' +
           'hw6M1E5fKJkvjIWVtlm_bka79XAmAZ8JZddqDuu8jAd6mMPPeL7qLz56cP_0QtdS' +
           '4rX85G9b7wIN-lzYk-K1yhPqmgz_rL44cz0959pctBSz15mNOAtdYgNphdOqJT5u' +
           'Hlon77ptt99Lb8AcQ8xdRqNZQgiflzGptbgiK1LOYxlgCiFeSZKL9i2AZ6rmj0v1' +
           'wYthwdlDfZyJnBBpjcNkLbN3J1RM8tYVrYSukeCU5SHdnYYakuOq6d_kWI7uQv_f' +
           'tb50fA0PXaUg';

  before('add test data', () => {
    irmaApiMockServer.start();

    return request(app)
      .post(API_USERS_REGISTRATION_URL)
      .send(userJson)
      .expect(201)
      .then(() => UserRepository.findByEmail(userJson.email))
      .then(record => (userId = record.get('id')))
      .then(() => IrmaIssueTokenRepository.create({
        session_token: issueTokenOne,
        user: userId,
      }))
      .then(record => (issueIdOne = record.get('id')))
      .then(() => IrmaIssueTokenRepository.create({
        session_token: issueTokenTwo,
        user: userId,
      }))
      .then(record => (issueIdTwo = record.get('id')));
  });

  after('remove test data', () => {
    irmaApiMockServer.stop();
    return IrmaIssueTokenRepository.deleteById(issueIdOne)
      .then(() => IrmaIssueTokenRepository.deleteById(issueIdTwo))
      .then(() => UserRepository.deleteById(userId));
  });

  it('should return 404 when no issue token is supplied', () => {
    const requestBody = 'NOT RELEVANT';

    return request(app)
      .post(API_USERS_IRMA_COMPLETE_ISSUE_URL)
      .type('text/plain')
      .send(requestBody)
      .expect(404);
  });

  it('should fail with invalid token', () => {
    const requestBody = 'INVALID';

    return request(app)
      .post(`${API_USERS_IRMA_COMPLETE_ISSUE_URL}/${issueTokenOne}`)
      .type('text/plain')
      .send(requestBody)
      .expect(403);
  });

  it('should fail with valid api-server and issue token and invalid json status', () =>
    request(app)
      .post(`${API_USERS_IRMA_COMPLETE_ISSUE_URL}/${issueTokenOne}`)
      .type('text/plain')
      .send(invalidStatusApiServerToken)
      .expect(403)
  );

  it('should succeed with valid api-server token and issue token', () =>
    request(app)
      .post(`${API_USERS_IRMA_COMPLETE_ISSUE_URL}/${issueTokenOne}`)
      .type('text/plain')
      .send(validApiServerToken)
      .expect(201)
  );

  it('should fail with valid api-server token and invalid issue token', () =>
    request(app)
      .post(`${API_USERS_IRMA_COMPLETE_ISSUE_URL}/${issueTokenOne}INVALID`)
      .type('text/plain')
      .send(validApiServerToken)
      .expect(403)
  );
});
