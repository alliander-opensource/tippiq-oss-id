/**
 * Response handler for registration.
 * @module users/actions/registration
 */

import debugLogger from 'debugnyan';

import config from '../../../config';
import { getJwtForUserId } from '../../auth';
import { hashPassword, validatePermissions } from '../../auth/auth';
import { UserRepository } from '../repositories';
import { renderEmailTemplate, sendEmail } from '../../email';
import { ValidationError } from '../../../common/errors';
import { validateUser } from '../user-validation';
import { REGISTER_USER } from '../../auth/permissions';

const debug = debugLogger('tippiq-id:users:actions:registration');

const emailTemplatePromise = renderEmailTemplate('registration-confirmation', {});

/**
 * Send an email to the user to confirm registration.
 * @function sendRegistrationConfirmationEmail
 * @param {Object} user Model object with the users data.
 * @returns {Promise} Information about the sent email.
 */
function sendRegistrationConfirmationEmail(user) {
  return emailTemplatePromise
    .then(emailTemplate =>
      ({
        from: config.emailFromAddress,
        to: [user.get('email')],
        subject: 'Bedankt voor je registratie bij Tippiq',
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail)
    .catch((err) => {
      debug.warn(`Failed to send 'registration-confirmation' email: ${err.message}`);
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
  const { email, password } = req.body;
  validatePermissions(req, res, REGISTER_USER)
    .then(() => validateUser({ email, password }))
    .then(() => hashPassword(password))
    .then(passwordHash => ({ email, passwordHash }))
    .then(UserRepository.create)
    .tap(sendRegistrationConfirmationEmail)
    .then(user => user.get('id'))
    .then(getJwtForUserId)
    .then((token) => {
      res
        .cacheControl('no-store')
        .status(201)
        .send({
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
        .json({
          success: false,
          message: 'Registratie mislukt.',
        });
    });
}
