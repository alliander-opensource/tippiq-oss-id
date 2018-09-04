/**
 * OAuth2AuthorizationCodeRepository.
 * @module modules/oauth2/repositories/oauth2-authorization-code-repository
 */

import { OAuth2AuthorizationCode } from '../models';
import BaseRepository from '../../../common/base-repository';

/**
 * A Repository for OAuth2 authorization codes.
 * @class OAuth2AuthorizationCodeRepository
 * @extends BaseRepository
 */
export class OAuth2AuthorizationCodeRepository extends BaseRepository {
  /**
   * Construct a OAuth2AuthorizationCodeRepository for OAuth2AuthorizationCodes.
   * @constructs OAuth2AuthorizationCodeRepository
   */
  constructor() {
    super(OAuth2AuthorizationCode);
  }
}

export default new OAuth2AuthorizationCodeRepository();
