/**
 * Handler to send mail.
 * @module modules/email/actions/send-mail
 */

import debugLogger from 'debugnyan';

import { sendEmail, renderEmailTemplate } from '../index';
import { sendSuccess, sendError } from '../../../common/route-utils';
import { UnauthorizedError, ValidationError } from '../../../common/errors';
import config from '../../../config';

const debug = debugLogger('tippiq-id:email:actions:send-email');

/**
 * Response handler for send-mail.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const { from, to, replyTo, subject, templateName, templateData } = req.body;
  // TODO Add endpoint security (tpx-864)
  renderEmailTemplate(templateName, templateData)
    .then(emailTemplate =>
      ({
        replyTo,
        from: from || config.emailFromAddress,
        sender: config.emailFromAddress,
        to,
        subject,
        text: emailTemplate.text,
        html: emailTemplate.html,
      })
    )
    .then(sendEmail)
    .then(() => {
      sendSuccess(res, 200, 'Bericht verstuurd.');
    })
    .catch(UnauthorizedError, (err) => {
      debug.debug(`Authorization error: ${err.message}`, err.stack);
      sendError(res, 403, err.message);
    })
    .catch(ValidationError, (err) => {
      debug.debug(`Validation error: ${err.message}`, err.stack);
      sendError(res, 400, err.message);
    })
    .catch((e) => {
      debug.debug(`Failed to send email: ${e.message}`);
      sendError(res, 500, 'Versturen van e-mail mislukt.');
    });
}
