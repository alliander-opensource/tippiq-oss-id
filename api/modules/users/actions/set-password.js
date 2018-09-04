/**
 * Response handler for set password.
 * @module users/actions/set-password
 */
import BPromise, { AggregateError } from 'bluebird';
import debugLogger from 'debugnyan';

import config from '../../../config';
import { validatePermissions, ROLES } from '../../auth/auth';
import Email from '../../email/email';
import { ValidationError, UnauthorizedError } from '../../../common/errors';
import { sendSuccess, sendError } from '../../../common/route-utils';
import { validatePassword, validateUserIsNew } from '../user-validation';
import { getResetPasswordUser } from '../user-common-utils';
import { SET_PASSWORD } from '../../auth/permissions';

const debug = debugLogger('tippiq-id:users:actions:set-password');
const email = new Email(
  'password-set',
  config.emailFromAddress,
  'Wachtwoord ingesteld', {});

/**
 * Response handler for set password
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  getResetPasswordUser(req.body.resetPasswordToken)
    .tap(user => BPromise
      .all([
        validatePermissions(req, res, SET_PASSWORD, [ROLES.REGISTERED]),
        validatePassword(req.body.password),
        validateUserIsNew(user),
      ])
    )
    .then(user => user.setPassword(req.body.password))
    .tap(user => email.send(user.get('email')))
    .then(() => sendSuccess(res, 200, 'Wachtwoord ingesteld.'))
    .catch(AggregateError, (err) => {
      throw err[0];
    })
    .catch(UnauthorizedError, (err) => {
      debug.debug(`Authorization error: ${err.message}`);
      sendError(res, 403, err.message);
    })
    .catch(ValidationError, (err) => {
      debug.debug(`Validation error: ${err.message}`);
      sendError(res, 400, err.message);
    })
    .catch((err) => {
      debug.warn('Server error:', err);
      sendError(res, 500, 'Serverfout.');
    });
}
