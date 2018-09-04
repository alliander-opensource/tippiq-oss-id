/**
 * Response handler for simple registration.
 * @module users/actions/simple-registration
 */

import debugLogger from 'debugnyan';

import config from '../../../config';
import auth from '../../auth';
import { UserRepository } from '../repositories';
import { Email } from '../../email';
import { ValidationError } from '../../../common/errors';
import { validateEmail } from '../user-validation';
import { SIMPLE_USER_REGISTRATION } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';

const debug = debugLogger('tippiq-id:users:actions:simple-registration');

const emailPromise = new Email(
  'simple-registration-confirmation',
  config.emailFromAddress,
  'Bedankt voor je registratie bij Tippiq'
);

/**
 * Send an email to the user to confirm registration.
 * @function sendConfirmationEmail
 * @param {Object} user Model object with the users data.
 * @param {string} resetPasswordToken JWT token that can be used to create a change password URL.
 * @returns {Promise} Information about the sent email.
 */
function sendConfirmationEmail(user, resetPasswordToken) {
  return emailPromise.send(user.get('email'), {
    resetPasswordToken,
  });
}

/**
 * Response handler for registration.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissions(req, res, SIMPLE_USER_REGISTRATION)
    .then(() => ({
      email: req.body.email,
    }))
    .tap(user => validateEmail(user.email))
    .then(UserRepository.create)
    .tap(user =>
      auth.getResetPasswordJwtForUserId(user.get('id'))
        .then(token => sendConfirmationEmail(user, token))
    )
    .then(user => user.get('id'))
    .then(auth.getJwtForUserId)
    .then((token) => {
      res
        .cacheControl('no-store')
        .status(201)
        .json({
          success: true,
          token,
        });
    })
    .catch(ValidationError, (err) => {
      debug.debug(`Validation error: ${err.message}`);
      res
        .status(400)
        .json({
          success: false,
          message: err.message,
        });
    })
    .catch((err) => {
      debug.debug(`Failed to register: ${err.message}`);
      res
        .status(400)
        .json({ success: false, message: 'Registratie mislukt.' });
    });
}
