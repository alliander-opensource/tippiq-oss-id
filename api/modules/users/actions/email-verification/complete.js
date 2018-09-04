/**
 * Handler to complete the email verification process.
 * @module users/actions/email-verification/complete
 */

import debugLogger from 'debugnyan';

import { completeEmailVerificationWithToken } from '../../user-email-verification';
import { AuthenticationError, ValidationError } from '../../../../common/errors';
import { COMPLETE_USER_EMAIL_VERIFICATION } from '../../../auth/permissions';
import {
  validatePermissions,
  getSetupPasswordJwtForUserId,
  getEmailVerificationCompleteJwtForUserId,
} from '../../../auth/auth';
import { renderEmailTemplate, sendEmail } from '../../../email';
import config from '../../../../config';

const debug = debugLogger('tippiq-id:users:email-verification:complete');

/**
 * Send setup password email
 * @param {object} user
 * @returns {object} promise
 */
function sendSetupPasswordEmailForUser(user) {
  return typeof (user.get('password_hash')) === 'undefined' && getSetupPasswordJwtForUserId(user.get('id'))
    .then(setupPasswordToken => renderEmailTemplate('setup-password', { setupPasswordToken }))
    .then(emailTemplate =>
      ({
        from: config.emailFromAddress,
        to: [user.get('email')],
        subject: 'Wachtwoord instellen',
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail);
}

export default (req, res) => {
  validatePermissions(req, res, COMPLETE_USER_EMAIL_VERIFICATION)
    .then(() => completeEmailVerificationWithToken(req.query.token))
    .tap(sendSetupPasswordEmailForUser)
    .then(user => getEmailVerificationCompleteJwtForUserId(user.get('id')))
    .then(emailVerifiedToken => {
      res
        .cacheControl('no-store')
        .json({
          success: true,
          emailVerifiedToken,
          message: 'E-mail verificatie voltooid.',
        });
    })
    .catch(AuthenticationError, (e) => {
      debug.debug(e);
      res
        .status(400)
        .json({
          success: false,
          message: 'Validatiefout: ongeldig token.',
        });
    })
    .catch(ValidationError, (e) => {
      // Email is already verified
      res
        .status(400)
        .json({
          success: false,
          message: e.message,
        });
    })
    .catch((e) => {
      debug.error(e);
      res
        .status(500)
        .json({
          success: false,
          message: 'Serverfout.',
        });
    });
};
