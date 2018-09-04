import { IrmaIssueTokenRepository } from './index';
import { UserRepository } from '../../users/repositories';
import { expect } from '../../../common/test-utils';

describe('IrmaIssueTokenRepository', () => {
  const sessionToken = 'WKcOQcejT8G3enCGcKbuYCuUtTII4WtvLI49r5MeF0';
  const createdAt = new Date();
  const testUserId = '48181aa2-560a-11e5-a1d5-c7050c4109ab';
  let id;

  before('add test session token', () =>
    UserRepository.findOne({ id: testUserId })
      .then(user =>
        IrmaIssueTokenRepository
          .create({ session_token: sessionToken, created_at: createdAt, user: user.get('id') })
          .then(record => (id = record.get('id')))
      )
  );

  after('remove test session token', () =>
    IrmaIssueTokenRepository
      .deleteById(id)
  );

  it('should update the database with a new issue status', () =>
    IrmaIssueTokenRepository.updateTokenWithIssueStatus(sessionToken, 'DONE')
      .then(record => record.toJSON())
      .then(jsonRecord => expect(jsonRecord).to.deep.equal({
        id,
        sessionToken,
        createdAt,
        user: testUserId,
        issueStatus: 'DONE',
      }))
  );
});
