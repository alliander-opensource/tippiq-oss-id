/**
 * IrmaRepository.
 * @module modules/irma/repositories/irma-session-token-repository
 */

import autobind from 'autobind-decorator';
import { IrmaSessionTokenModel } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for Irma.
 * @class IrmaSessionTokenRepository
 * @extends BaseRepository
 */
export class IrmaSessionTokenRepository extends BaseRepository {
  /**
   * Construct an IrmaSessionTokenRepository for Irma.
   * @constructs IrmaSessionTokenRepository
   */
  constructor() {
    super(IrmaSessionTokenModel);
  }

  /**
   * Update a session token with an user uuid
   * @function updateTokenWithUser
   * @param {string} sessionToken A session token that already exists
   * @param {string} userId Uuid of an existing user to be coupled to this session token
   * @returns {Promise<Model>} A promise resolving to the updated Model.
   */
  updateTokenWithUser(sessionToken, userId) {
    return this.findOne({ session_token: sessionToken })
      .then(record => {
        record.updateWith({ user: userId });
        return record.save();
      });
  }

  /**
   * Delete a session by a session token
   * @function deleteBySessionToken
   * @param {string} sessionToken A session token that already exists
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Promise<Model>} A promise resolving to the destroyed
   * and thus "empty" Model.
   */
  deleteBySessionToken(sessionToken, options = {}) {
    return this.findOne({ session_token: sessionToken })
      .then(record => record.destroy(options));
  }
}

export default new IrmaSessionTokenRepository();
