/**
 * Response handler for change password.
 * @module users/actions/change-password
 */

import debugLogger from 'debugnyan';
import jwt from 'jsonwebtoken';
import BPromise, { AggregateError } from 'bluebird';

import config from '../../../config';
import { verifyPassword, validatePermissions, ACTIONS } from '../../auth/auth';
import { renderEmailTemplate, sendEmail } from '../../email';
import { UserRepository } from '../repositories';
import { UnauthorizedError, ValidationError } from '../../../common/errors';
import { sendError } from '../../../common/route-utils';
import { validatePassword } from '../user-validation';
import { UPDATE_USER_PASSWORD, RESET_USER_PASSWORD } from '../../auth/permissions';
import { getJwtForUserId } from '../../auth';

const debug = debugLogger('tippiq-id:users:actions:change-password');
const emailTemplatePromise = renderEmailTemplate('password-changed', {});
const jwtVerify = BPromise.promisify(jwt.verify, jwt);

/**
 * Send an email to the user saying the password has changed.
 * @function sendPasswordChangedEmail
 * @param {Object} user Model object with the users data.
 * @returns {Promise} Information about the sent email.
 */
function sendPasswordChangedEmail(user) {
  return emailTemplatePromise
    .then(emailTemplate =>
      ({
        from: config.emailFromAddress,
        to: [user.get('email')],
        subject: 'Wachtwoord gewijzigd',
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail)
    .catch((err) => {
      debug.warn(`Failed to send 'password-changed' email: ${err.message}`);
    });
}

/**
 * Get user
 * @function getUser
 * @param {Object} user User object
 * @param {string} resetPasswordToken Rest password token
 * @returns {Promise<Object>} Resolved user
 */
function getUser(user, resetPasswordToken) {
  const jwtOptions = { audience: config.jwtAudience, issuer: config.jwtIssuer };

  return new Promise((resolve, reject) => {
    if (resetPasswordToken) {
      jwtVerify(resetPasswordToken, config.publicKey, jwtOptions)
        .then(jwtPayload => (jwtPayload.action === ACTIONS.PASSWORD_RESET ? jwtPayload.sub : null))
        .then(UserRepository.findById)
        .then(found => resolve(found))
        .catch(err => {
          debug.warn(err);
          reject(new UnauthorizedError('Invalid token'));
        });
    } else if (user) {
      resolve(user);
    } else {
      debug.warn('No authentication');
      reject(new UnauthorizedError('No authentication'));
    }
  });
}

/**
 * Verify old password if needed, throws error when incorrect
 * @function verifyOldPasswordIfNeeded
 * @param {string} permissionType Type of permission needed
 * @param {object} req Express request object
 * @returns {undefined}
 */
function verifyOldPasswordIfNeeded(permissionType, req) {
  if (!req.body.oldPassword) return null;
  const passwordHash = req.user ? req.user.get('passwordHash') : null;
  // Only verify when updating an existing password (password can be empty for new users)
  if (permissionType === UPDATE_USER_PASSWORD && passwordHash !== null) {
    return verifyPassword(req.body.oldPassword, passwordHash)
      .then((success) => {
        if (!success) {
          throw new UnauthorizedError('Invalid credentials');
        }
      });
  }
  return null;
}

/**
 * Response handler for change password
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const permissionType = typeof req.body.resetPasswordToken === 'undefined' ?
      UPDATE_USER_PASSWORD : RESET_USER_PASSWORD;

  validatePermissions(req, res, permissionType)
    .tap(() => verifyOldPasswordIfNeeded(permissionType, req))
    .tap(() => validatePassword(req.body.newPassword))
    .then(() => getUser(req.user, req.body.resetPasswordToken))
    .then(user => user.setPassword(req.body.newPassword))
    .tap(sendPasswordChangedEmail)
    .then(user => user.get('id'))
    .then(getJwtForUserId)
    .then(token =>
      res
        .cacheControl('no-store')
        .status(200)
        .send({ token, success: true })
    )
    .catch(AggregateError, (err) => {
      throw err[0];
    })
    .catch(UnauthorizedError, (err) => {
      debug.debug(`Authorization error: ${err.message}`, err.stack);
      sendError(res, 403, err.message);
    })
    .catch(ValidationError, (err) => {
      debug.debug(`Validation error: ${err.message}`);
      sendError(res, 400, err.message);
    })
    .catch((err) => {
      debug.debug(`Failed to change password: ${err.message}`);
      sendError(res, 400, 'Wachtwoord wijzigen mislukt.');
    })
    .catch((err) => {
      debug.warn('Server error:', err);
      sendError(res, 500, 'Serverfout.');
    });
}
