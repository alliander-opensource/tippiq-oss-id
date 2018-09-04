import { IrmaSessionTokenRepository } from './index';
import { expect } from '../../../common/test-utils';

describe('IrmaSessionTokenRepository', () => {
  const sessionToken = 'WKcOQcejT8G3enCGcKbuYCuUtTII4WtvLI49r5MeF0';
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

  it('should return the session token when asked', () =>
    IrmaSessionTokenRepository
      .findOne({ session_token: sessionToken })
      .then(record => record.toJSON())
      .then(jsonRecord => expect(jsonRecord).to.deep.equal({
        id,
        sessionToken,
        createdAt,
        user: null,
      }))
  );
});
