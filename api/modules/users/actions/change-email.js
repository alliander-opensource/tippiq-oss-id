/**
 * Response handler for change email.
 * @module users/actions/change-email
 */

import debugLogger from 'debugnyan';
import config from '../../../config';
import { renderEmailTemplate, sendEmail } from '../../email';
import { ValidationError } from '../../../common/errors';
import { validateEmail } from '../user-validation';
import { UPDATE_USER_EMAIL } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';
import { startEmailVerificationForUser } from '../../users/user-email-verification';

const debug = debugLogger('tippiq-id:users:actions:change-email');
const emailChangedTemplatePromise = renderEmailTemplate('email-changed', {});
const emailRemovedTemplatePromise = renderEmailTemplate('email-removed', {});

/**
 * Send an email to the user saying the email has changed.
 * @function sendEmailChangedEmail
 * @param {Object} user Model object with the users data.
 * @returns {Promise} Information about the sent email.
 */
function sendEmailChangedEmail(user) {
  return emailChangedTemplatePromise
    .then(emailTemplate =>
      ({
        from: config.emailFromAddress,
        to: [user.get('email')],
        subject: 'Nieuw e-mailadres ingesteld',
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail)
    .catch((err) => {
      debug.warn(`Failed to send 'email-changed' email: ${err.message}`);
    });
}

/**
 * Send an email to the user saying the email has been removed/changed.
 * @function sendEmailRemovedEmail
 * @param {string} oldEmailAddress previous email address.
 * @returns {Promise} Information about the sent email.
 */
function sendEmailRemovedEmail(oldEmailAddress) {
  return emailRemovedTemplatePromise
    .then(emailTemplate =>
      ({
        from: config.emailFromAddress,
        to: [oldEmailAddress],
        subject: 'E-mailadres gewijzigd',
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail)
    .catch((err) => {
      debug.warn(`Failed to send 'email-removed' email: ${err.message}`);
    });
}


/**
 * Response handler for change email
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  let oldEmailAddress;

  validatePermissions(req, res, UPDATE_USER_EMAIL)
    .tap(() => { oldEmailAddress = req.user.get('email'); })
    .then(() => req.body.email)
    .tap(validateEmail)
    .then(validatedEmail => req.user.set({ email: validatedEmail, emailIsVerified: false }).save())
    .tap(() => sendEmailRemovedEmail(oldEmailAddress))
    .tap(sendEmailChangedEmail)
    .tap(startEmailVerificationForUser)
    .then(() =>
      res
        .status(200)
        .send({
          success: true,
        })
    )
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
      debug.debug(`Failed to change email: ${err.message}`);
      res
        .status(400)
        .json({ success: false, message: 'E-mail wijzigen mislukt.' });
    });
}
