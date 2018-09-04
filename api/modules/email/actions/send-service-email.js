/**
 * Handler for sending service email
 * @module modules/email/actions/send-service-mail
 */

import debugLogger from 'debugnyan';

import Email from '../email';
import { SEND_SERVICE_EMAIL } from '../../../modules/auth/permissions';
import { validatePermissions } from '../../../modules/auth/auth';
import { UserRepository } from '../../../modules/users/repositories';
import { sendSuccess, sendError } from '../../../common/route-utils';
import { User } from '../../../modules/users/models';
import { RenderError } from '../../../modules/email/render-email-template';

const debug = debugLogger('tippiq-id:email:actions:send-service-email');

/**
 * Response handler for sending service emails.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const { data, from, subject, templateName, userId } = req.body;
  validatePermissions(req, res, SEND_SERVICE_EMAIL)
    .then(() => UserRepository.findById(userId))
    .then(user => user.get('email'))
    .then(email => new Email(templateName, from, subject, data).send(email))
    .then(() => {
      sendSuccess(res, 200, `Bericht '${templateName}' verstuurd.`);
    })
    .catch(RenderError, () => {
      debug.debug('Email template not found');
      sendError(res, 400, 'E-mailsjabloon niet gevonden.');
    })
    .catch(User.NotFoundError, () => {
      debug.debug('Recipient not found');
      sendError(res, 400, 'Ontvanger niet gevonden.');
    })
    .catch((e) => {
      debug.debug(`Failed to send email: ${e.message}`);
      sendError(res, 500, 'Versturen van e-mail mislukt.');
    });
}
