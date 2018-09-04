import BPromise from 'bluebird';
import { app, request } from '../../../common/test-utils';
import { IrmaSessionTokenRepository } from '../../irma/repositories';

const API_USERS_IRMA_LOGIN_URL = '/irma/complete-login-request';

describe('Complete IRMA login request', () => {
  const sessionTokenOne = '2Dr9QBuGNLVn48fyERQdcWLsruyedSr7FUiCXsDRNxE1';
  const createdAt = new Date();
  let idOne;
  const sessionTokenTwo = '2Dr9QBuGNLVn48fyERQdcWLsruyedSr7FUiCXsDRNxE2';

  const validApiServerToken =
           'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkaXNjbG9zdXJlX3Jlc3VsdCIsImF0dHJ' +
           'pYnV0ZXMiOnsidGlwcGlxLlRpcHBpcS51c2VyLmUtbWFpbCI6InRlc3RAZXhhbXB' +
           'sZS5jb20iLCJ0aXBwaXEuVGlwcGlxLnVzZXIuaWQiOiIzMWNkMDczYS1mZWYzLTR' +
           'lZTUtYjFjMy1mZTExNDJkZjc5MDgifSwiZXhwIjoyNDIyNTcxODQ5LCJpYXQiOjE' +
           '0Nzc1NzE4NDksImp0aSI6IlRpcHBpcSIsInN0YXR1cyI6IlZBTElEIn0.A55LRCl' +
           'Tmh1-DaFFeWJWbVITorsNLjhzyBc9Vaj-W4U-Nx3SnlcxDA8h_OuAV7umYh6lGBd' +
           'R_vLL8WCVVGrPsLKtv7aXXY421aapTO7Mhtog4QmoVTKm_Vjz-rfFygfzIgYD1bD' +
           'QpxO1hQRKOOAaTYINdBxwaO6wPnIcVslk7RtI4z259Vrv3_F_wRbBcL2wKEMWkdc' +
           'O_SxIqB2Zs3_iS2RS0WMdWz1_obwhsfeiyerwKKvCanE2XeHYKT0pmxCdBksVAiP' +
           '-Ge5L1hvZHNhUhGTHVGyxPQzbjQbPafRo_0nof3Z9-LxKgy3Lk_Duj7_YzV01ggP' +
           'NQ0Pag0ijiSwsZQ';

  const invalidUuidApiServerToken =
           'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkaXNjbG9zdXJlX3Jlc3VsdCIsImF0dHJ' +
           'pYnV0ZXMiOnsidGlwcGlxLlRpcHBpcS51c2VyLmUtbWFpbCI6InRlc3RAdGVzdC5' +
           'jb20iLCJ0aXBwaXEuVGlwcGlxLnVzZXIuaWQiOiI0ODE4MWFhMi01NjBhLTExZTU' +
           'tYTFkNS1jNzA1MGM0MTA5YWIifSwiZXhwIjoyNDIyNTcxMjMwLCJpYXQiOjE0Nzc' +
           '1NzEyMzAsImp0aSI6IlRpcHBpcSIsInN0YXR1cyI6IlZBTElEIn0.E_6yvwa1Vxz' +
           'UxtWKqtHmW5l6ilisgsQm7DE6g6npUbh1MP5pM-FcUxn3fCTmUHy8qc3jtI8uwYq' +
           '5jCdAjUsU0wETj8F2y-ba0-ZktU8UKhRpUplSNCMpdYCGN2ULhfeUsACUrETbPnd' +
           'LyRMk_01iBaIXALWYJppwz2N65OHsCMKAzMltPBBzhCqbPT7Tzjz8YERP__52feJ' +
           'fmjsQZRIE1lCPeFtQxTx0L57Xw4ODJactEB6Gx88iEDKWj3MdVDEMvEMBx6hHbbT' +
           'HGYvDjAYNy5371eEv3PiC-pat3hXQVIpGhmsS9ZDG2CsrNhHZxSGK1whe4SjEutR' +
           'QxRxCPUdLEQ';

  before('add test session tokens', () => {
    const testSessionTokens = [];
    testSessionTokens.push(
      IrmaSessionTokenRepository
      .create({ session_token: sessionTokenOne, created_at: createdAt })
      .then(record => (idOne = record.get('id')))
    );

    testSessionTokens.push(
    IrmaSessionTokenRepository
      .create({ session_token: sessionTokenTwo, created_at: createdAt })
    );

    return BPromise.all(testSessionTokens);
  });

  after('remove test session token', () =>
    IrmaSessionTokenRepository
      .deleteById(idOne)
  );

  it('should return 404 when no session token is supplied', () => {
    const requestBody = 'NOT RELEVANT';

    return request(app)
      .post(API_USERS_IRMA_LOGIN_URL)
      .type('text/plain')
      .send(requestBody)
      .expect(404);
  });

  it('should fail with invalid token', () => {
    const requestBody = 'INVALID';

    return request(app)
      .post(`${API_USERS_IRMA_LOGIN_URL}/${sessionTokenOne}`)
      .type('text/plain')
      .send(requestBody)
      .expect(403);
  });

  it('should fail with valid api-server token, invalid uuid and valid session token', () =>
    request(app)
      .post(`${API_USERS_IRMA_LOGIN_URL}/${sessionTokenTwo}`)
      .type('text/plain')
      .send(validApiServerToken)
      .expect(400)
  );

  it('should succeed with valid api-server token, uuid and session token', () =>
    request(app)
      .post(`${API_USERS_IRMA_LOGIN_URL}/${sessionTokenOne}`)
      .type('text/plain')
      .send(invalidUuidApiServerToken)
      .expect(201)
  );

  it('should fail with valid api-server token, uuid and invalid session token', () =>
    request(app)
      .post(`${API_USERS_IRMA_LOGIN_URL}/${sessionTokenOne}INVALID`)
      .type('text/plain')
      .send(invalidUuidApiServerToken)
      .expect(403)
  );
});
