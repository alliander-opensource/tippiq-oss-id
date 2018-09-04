/**
 * IrmaRepository.
 * @module modules/irma/repositories/irma-issue-token-repository
 */

import autobind from 'autobind-decorator';
import { IrmaIssueTokenModel } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for Irma.
 * @class IrmaIssueTokenRepository
 * @extends BaseRepository
 */
export class IrmaIssueTokenRepository extends BaseRepository {
  /**
   * Construct an IrmaIssueTokenRepository for Irma.
   * @constructs IrmaIssueTokenRepository
   */
  constructor() {
    super(IrmaIssueTokenModel);
  }

  /**
   * Update an issue token with an issue status
   * @function updateTokenWithIssueStatus
   * @param {string} sessionToken An issue token that already exists
   * @param {string} issueStatus New state of issueing
   * @returns {Promise<Model>} A promise resolving to the updated Model.
   */
  updateTokenWithIssueStatus(sessionToken, issueStatus) {
    return this.findOne({ session_token: sessionToken })
      .then(record => {
        record.updateWith({ issueStatus });
        return record.save();
      });
  }
}

export default new IrmaIssueTokenRepository();
