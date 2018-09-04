/**
 * Oauth2ClientRepository.
 * @module modules/auth/repositories/oauth2-client-repository
 */

import autobind from 'autobind-decorator';
import { OAuth2Client } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for OAuth2ClientModel.
 * @class Oauth2ClientRepository
 * @extends BaseRepository
 */
export class OAuth2ClientRepository extends BaseRepository {
  /**
   * Construct a OAuth2ClientRepository for OAuth2ClientModel.
   * @constructs OAuth2ClientRepository
   */
  constructor() {
    super(OAuth2Client);
  }

  /**
   * Find a OAuth2ClientModel by email.
   * @function findOne
   * @param {Object|string} where Bookshelf key/operator/value or attributes hash.
   * @param {Object} [options] Bookshelf options to pass on to fetch.
   * @returns {Promise<OAuth2ClientModel>} A Promise that resolves to a OAuth2ClientModel.
   */
  findOne(where, options = {}) {
    return super.findOne(where, {
      ...options,
      withRelated: ['owner.roles'],
    });
  }
}

export default new OAuth2ClientRepository();
