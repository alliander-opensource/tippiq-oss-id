import { app, request } from '../../../common/test-utils';
import { IrmaSessionTokenRepository } from '../../irma/repositories';

const API_USERS_IRMA_LOGIN_TOKEN_URL = '/irma/generate-login-token';

describe('Generate IRMA Login token', () => {
  const sessionToken = 'BUfvSfGjzNPNQhEqIudPp8GhUg8Pd0GUj3Abqp341a';
  const createdAt = new Date();
  let id;

  before('add test session token', () =>
    IrmaSessionTokenRepository
      .create({ session_token: sessionToken, created_at: createdAt })
      .then(record => (id = record.get('id')))
  );

  after('remove test session token', () =>
    IrmaSessionTokenRepository
      .deleteById(id)
  );

  it('should return 403 when an unknown token is supplied', () =>
    request(app)
      .get(`${API_USERS_IRMA_LOGIN_TOKEN_URL}/UNKNOWN`)
      .expect(403)
  );

  it('should return 200 when no user is coupled to this session token', () =>
    request(app)
      .get(`${API_USERS_IRMA_LOGIN_TOKEN_URL}/${sessionToken}`)
      .expect(200)
  );

  it('should return 201 when session token is coupled to valid user', () => {
    const testUserId = '48181aa2-560a-11e5-a1d5-c7050c4109ab';
    return IrmaSessionTokenRepository.updateTokenWithUser(sessionToken, testUserId)
      .then(() =>
        request(app)
          .get(`${API_USERS_IRMA_LOGIN_TOKEN_URL}/${sessionToken}`)
          .expect(201)
      );
  });
});
