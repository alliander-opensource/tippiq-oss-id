/**
 * Users related helper functions.
 * @module users/user-common-utils
 */
import BPromise from 'bluebird';
import debugLogger from 'debugnyan';
import jwt from 'jsonwebtoken';

import { jwtAudience, jwtIssuer, publicKey } from '../../config';
import { ACTIONS } from '../auth/auth';
import { UserRepository } from './repositories';
import { UnauthorizedError } from '../../common/errors';

const debug = debugLogger('tippiq-id:users:user-common-utils');

const jwtVerify = BPromise.promisify(jwt.verify, jwt);

const jwtOptions = { audience: jwtAudience, issuer: jwtIssuer };

/**
 * Get a user object for which the password can be set.
 * @function getResetPasswordUser
 * @param {string} resetPasswordToken JWT token which is checked for password reset action.
 * @returns {Promise<Object>} Resolved user
 */
export function getResetPasswordUser(resetPasswordToken) {
  return jwtVerify(resetPasswordToken, publicKey, jwtOptions)
    .catch((e) => {
      debug.debug(`getResetPasswordUser: ${e.message}`);
      throw new UnauthorizedError('De verificatiecode is verlopen');
    })
    .tap((jwtPayload) => {
      if (jwtPayload.action !== ACTIONS.PASSWORD_RESET) {
        throw new UnauthorizedError('De verificatiecode is verlopen');
      }
    })
    .then(payload => payload.sub)
    .then(UserRepository.findById);
}


/**
 * Get a user object for which the password can be set.
 * @function getSetupPasswordUser
 * @param {string} setupPasswordToken JWT token which is checked for password setup action.
 * @returns {Promise<Object>} Resolved user
 */
export function getSetupPasswordUser(setupPasswordToken) {
  return jwtVerify(setupPasswordToken, publicKey, jwtOptions)
    .catch((e) => {
      debug.debug(`getSetupPasswordUser: ${e.message}`);
      throw new UnauthorizedError('De verificatiecode is verlopen');
    })
    .tap((jwtPayload) => {
      if (jwtPayload.action !== ACTIONS.PASSWORD_SETUP) {
        throw new UnauthorizedError('De verificatiecode is verlopen');
      }
    })
    .then(payload => payload.sub)
    .then(UserRepository.findById);
}
