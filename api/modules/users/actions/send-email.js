/**
 * Response handler for send user email.
 * @module users/actions/send-email
 */

import debugLogger from 'debugnyan';

import { validateServicePermissions } from '../../auth/auth';
import { sendError } from '../../../common/route-utils';
import { ValidationError, UnauthorizedError, VerificationError } from '../../../common/errors';
import { UserRepository } from '../repositories';
import { User } from '../models';
import config from '../../../config';
import { sendEmail, renderEmailTemplate } from '../../email';

const debug = debugLogger('tippiq-id:users:actions:send-email');
const USER_SEND_MAIL = 'tippiq_id.user-send-mail';

/**
 * Validate email template name
 * @function validateTemplate
 * @param {string} templateName Name of template to check
 * @returns {undefined}
 */
function validateTemplateName(templateName) {
  if (typeof templateName !== 'string' ||
    templateName.search(/^[a-zA-Z0-9-_]+$/) === -1) {
    throw new ValidationError('Invalid template name');
  }
}

/**
 * Create email message
 * @function createEmailMessage
 * @param {object} req Express request object
 * @param {object} user User model
 * @returns {undefined}
 */
function createEmailMessage(req, user) {
  if (req.body.verificationRequired === true) {
    const verifiedEmailUser = user.get('emailIsVerified');
    if (!verifiedEmailUser) {
      throw new VerificationError('User not verified');
    }
  }
  const userEmail = user.get('email');
  const templateData = req.body.templateData || {};
  templateData.userEmail = userEmail;

  return {
    to: req.body.to || userEmail,
    subject: req.body.subject,
    templateName: req.body.templateName,
    templateData,
  };
}

/**
 * Send email directly
 * TODO: api/email/send-mail endpoint should be moved to a separate sendEmail endpoint in the
 * new email micro-service. For now sendEmailDirect should mimic its functionality because calling
 * send-mail endpoint with super-agent seems to have blocking issues causing connection errors.
 * @function sendEmailDirect
 * @param {object} emailData Email data object
 * @returns {undefined}
 */
function sendEmailDirect(emailData) {
  const { from, to, subject, templateName, templateData } = emailData;
  renderEmailTemplate(templateName, templateData)
    .then(emailTemplate =>
      ({
        from: from || config.emailFromAddress,
        to,
        subject,
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail);
}

/**
 * Response handler for send email
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validateServicePermissions(req, res, USER_SEND_MAIL)
    .then(() => UserRepository.findById(req.body.userId))
    .tap(() => validateTemplateName(req.body.templateName))
    .then(user => createEmailMessage(req, user))
    .then(sendEmailDirect)
    /* TODO: call external email endpoint instead of local sendEmail method.
    .then(requestBody =>
      auth.getSignedJwt({ action: 'email_service.send-mail' }).then(serviceToken =>
       superagent.request
         .post(config.emailServiceUrl)
         .set('Authorization', `Bearer ${serviceToken}`)
         .send(requestBody)
    ))*/
    .tap(() => {
      res
        .status(202)
        .json({
          success: true,
          message: 'Gebruikers e-mail verstuurd.',
        });
    })
    .catch(UnauthorizedError, (err) => {
      debug.debug(`Authentication error: ${err.message}`, err.stack);
      sendError(res, 403, err.message);
    })
    .catch(User.NotFoundError, () => sendError(res, 404, 'Ontvanger niet gevonden.'))
    .catch(ValidationError, e => sendError(res, 400, e.message))
    .catch(VerificationError, e => sendError(res, 412, e.message))
    .catch((e) => {
      debug.error(e);
      res
        .status(500)
        .json({
          success: false,
          message: 'Serverfout.',
        });
    });
}
