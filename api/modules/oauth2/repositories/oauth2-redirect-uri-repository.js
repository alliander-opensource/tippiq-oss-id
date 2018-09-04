/**
 * OAuth2RedirectUriRepository.
 * @module modules/oauth2/repositories/oauth2-redirect-uri-repository
 */

import { OAuth2RedirectUri } from '../models';
import BaseRepository from '../../../common/base-repository';

/**
 * A Repository for OAuth2 redirect uris.
 * @class OAuth2RedirectUriRepository
 * @extends BaseRepository
 */
export class OAuth2RedirectUriRepository extends BaseRepository {
  /**
   * Construct a OAuth2RedirectUriRepository for OAuth2RedirectUris.
   * @constructs OAuth2RedirectUriRepository
   */
  constructor() {
    super(OAuth2RedirectUri);
  }

   /**
   * Match redirect uri
   * @function matchRedirectUri
   * @param {string} clientId Client ID
   * @param {string} redirectUri Redirect URI
   * @return {*|Promise.<OAuth2RedirectUri|null>} A single OAuth2RedirectUri model
   */
  matchRedirectUri(clientId, redirectUri) {
    return this.Model
      .query(qb =>
        qb.where('client_id', clientId)
          .whereRaw("? LIKE redirect_uri || '%'", [redirectUri])
      ).fetch();
  }
}

export default new OAuth2RedirectUriRepository();
