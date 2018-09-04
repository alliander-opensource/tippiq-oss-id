/**
 * Response handler for login.
 * @module users/actions/login
 */
import debugLogger from 'debugnyan';
import { getJwtForUserId } from '../../auth';
import {
  verifyPassword,
  validatePermissions,
  limitRequests,
  resetRequestLimit,
  verifyJWT,
  ACTIONS,
} from '../../auth/auth';
import { UserRepository } from '../repositories';
import { AuthenticationError } from '../../../common/errors';
import { LOGIN_USER } from '../../auth/permissions';

const debug = debugLogger('tippiq-id:users:actions:login');

/**
 * Verify token and return user id, if user has no password set yet
 * @function getUserIdFromValidToken
 * @param {string} token Token to validate
 * @returns {Promise} UserId
 */
function getUserIdFromValidToken(token) {
  let action;
  return verifyJWT(token, [ACTIONS.PASSWORD_SETUP, ACTIONS.LOGIN_SESSION])
    .then(payload => {
      action = payload.action;
      return payload.sub;
    })
    .then(userId => UserRepository.findUserById(userId))
    .then(user => {
      if (action === ACTIONS.PASSWORD_SETUP && user.get('passwordHash') !== null) {
        throw new AuthenticationError('De verificatiecode is verlopen');
      }
      return user.get('id');
    });
}

/**
 * Verify email / password and return user id
 * @function getUserIdFromValidLogin
 * @param {string} email Email address of user
 * @param {string} password User password to verify
 * @returns {Promise} UserId
 */
function getUserIdFromValidLogin(email, password) {
  limitRequests(email);
  return UserRepository.findByEmail(email)
    .then(user => verifyPassword(password, user.get('passwordHash')).then(success => {
      if (!success) {
        throw new AuthenticationError('Invalid credentials.');
      }
      resetRequestLimit(email);
      return user;
    }))
    .then(user => user.get('id'));
}

/**
 * Response handler for login.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissions(req, res, LOGIN_USER)
    .then(() => (req.body.token ? getUserIdFromValidToken(req.body.token) :
      getUserIdFromValidLogin(req.body.email, req.body.password)))
    .then(userId => getJwtForUserId(userId, req.body.audience))
    .then(token => {
      res
        .cacheControl('no-store')
        .status(200)
        .send({ token });
    })
    .catch(err => {
      debug.debug(`Failed to login: ${err.message}`);
      res
        .status(403)
        .json({ success: false, message: 'Inloggen mislukt.' });
    });
}
