/**
 * Response handler for send a user a rendered email.
 * @module users/actions/send-rendered-email
 */

import debugLogger from 'debugnyan';

import { validateServicePermissions } from '../../auth/auth';
import { sendError, sendSuccess } from '../../../common/route-utils';
import { UnauthorizedError, VerificationError } from '../../../common/errors';
import { UserRepository } from '../repositories';
import { User } from '../models';
import config from '../../../config';
import { sendEmail } from '../../email';

const debug = debugLogger('tippiq-id:users:actions:send-rendered-email');
const USER_SEND_RENDERED_MAIL = 'tippiq_id.user-send-rendered-mail';

/**
 * Prepare email for sending
 * @function prepareEmailMessage
 * @param {object} req Express request object
 * @param {object} user User model
 * @returns {object} Email object
 */
function prepareEmailMessage(req, user) {
  const verifiedEmailUser = user.get('emailIsVerified');
  if (!verifiedEmailUser) {
    throw new VerificationError('User not verified');
  }
  return {
    from: req.body.from || config.emailFromAddress,
    to: [user.get('email')],
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.html,
  };
}

/**
 * Response handler for send rendered email to a user if email is verified
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validateServicePermissions(req, res, USER_SEND_RENDERED_MAIL)
    .then(() => UserRepository.findById(req.params.id))
    .then(user => prepareEmailMessage(req, user))
    .then(sendEmail)
    /* todo: call external email endpoint instead of local sendEmail method.
     .then(requestBody =>
     auth.getSignedJwt({ action: 'email_service.send-mail' }).then(serviceToken =>
     superagent.request
     .post(config.emailServiceUrl)
     .set('Authorization', `Bearer ${serviceToken}`)
     .send(requestBody)
     ))*/
    .tap(() => sendSuccess(res, 202, 'Gebruikers e-mail verstuurd.'))
    .catch(UnauthorizedError, (err) => {
      debug.debug(`Authentication error: ${err.message}`, err.stack);
      sendError(res, 403, err.message);
    })
    .catch(User.NotFoundError, () => sendError(res, 404, 'Ontvanger niet gevonden.'))
    .catch(VerificationError, e => sendError(res, 412, e.message))
    .catch(e => {
      debug.error(e);
      res
        .status(500)
        .json({
          success: false,
          message: 'Serverfout.',
        });
    });
}
