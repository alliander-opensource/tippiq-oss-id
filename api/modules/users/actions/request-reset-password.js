import debugLogger from 'debugnyan';

import config from '../../../config';
import { getResetPasswordJwtForUserId, limitRequests, validatePermissions } from '../../auth/auth';
import { AuthenticationError } from '../../../common/errors';
import { renderEmailTemplate, sendEmail } from '../../email';
import { UserRepository } from '../repositories';
import { REQUEST_RESET_USER_PASSWORD } from '../../auth/permissions';

const debug = debugLogger('tippiq-id:request-reset-password');

/**
 * Send an email to the user with a password reset link
 * @function sendPasswordResetEmail
 * @param {string} email Address to send reset link to.
 * @param {string} clientId ClientId (service provider).
 * @param {string} returnParams Uri to go to after successfully setting the password.
 * @returns {Promise} Information about the sent email.
 */
function sendPasswordResetEmail(email, clientId, returnParams) {
  const params = typeof returnParams !== 'undefined' ? encodeURIComponent(returnParams) : null;

  return UserRepository
    .findByEmail(email)
    .then((user) => {
      if (!user) {
        // todo: handle user not found
        return null;
      }
      return getResetPasswordJwtForUserId(user.get('id'))
        .then(token =>
          renderEmailTemplate('request-reset-password', {
            resetPasswordToken: token,
            client_id: clientId,
            returnParams: params,
          })
        )
        .then(emailTemplate => ([user, emailTemplate]));
    })
    .all()
    .then(([user, emailTemplate]) =>
      ({
        from: config.emailFromAddress,
        to: [user.get('email')],
        subject: 'Wachtwoord vergeten',
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail)
    .catch((err) => {
      debug.warn(`Failed to send 'request-reset-password' email: ${err.message}`);
    });
}

/**
 * Response handler for request reset password
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissions(req, res, REQUEST_RESET_USER_PASSWORD)
    .then(() => limitRequests(req.body.email))
    .then(() => sendPasswordResetEmail(req.body.email, req.body.clientId, req.body.returnParams))
    .then(() =>
      res
        .status(200)
        .json({ success: true, message: 'Wachtwoord vergeten e-mail verstuurd.' })
    )
    .catch(AuthenticationError, err => {
      debug.debug(`Failed to request password reset: ${err.message}`);
      res
        .status(403)
        .json({ success: false, message: 'Geen toegang.' });
    })
    .catch(err => {
      debug.debug(`Failed to send request reset password mail: ${err.message}`);
      res
        .status(500)
        .json({ success: false, message: 'Wachtwoord vergeten e-mail versturen mislukt.' });
    });
}
