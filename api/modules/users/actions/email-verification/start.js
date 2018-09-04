/**
 * Handler to start the email verification process.
 * @module users/actions/email-verification/start
 */

import debugLogger from 'debugnyan';

import { startEmailVerificationForUser } from '../../user-email-verification';
import { START_USER_EMAIL_VERIFICATION } from '../../../auth/permissions';
import { validatePermissions, validateServicePermissions } from '../../../auth/auth';
import { ValidationError, UnauthorizedError } from '../../../../common/errors';
import { sendError } from '../../../../common/route-utils';
import { UserRepository } from '../../repositories';

const debug = debugLogger('tippiq-id:users:email-verification:start');
const START_USER_EMAIL_VERIFICATION_ACTION = 'tippiq_id.start-email-verification';

/**
 * validate the service or user token from the request and return user model
 * @function validateRequest
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {object} user
 */
function validateRequest(req, res) {
  return req.user && req.user.service ?
    validateServicePermissions(req, res, START_USER_EMAIL_VERIFICATION_ACTION)
      .then(() => UserRepository.findById(req.query.remindUser)) :
    validatePermissions(req, res, START_USER_EMAIL_VERIFICATION).then(() => req.user);
}
/**
 * get user if its not verified otherwise throw ValidationError
 * @function getNonVerifiedUser
 * @param {object} user User object
 * @returns {object} user
 */
function getNonVerifiedUser(user) {
  if (user.get('emailIsVerified')) {
    throw new ValidationError('Email address already verified.');
  }
  return user;
}

export default (req, res) => {
  const { remindUser, sendWeeklyNotification } = req.query;
  const returnUrl = req.query.returnUrl +
    (sendWeeklyNotification === 'true' ? '&sendWeeklyNotification=true' : '');

  validateRequest(req, res)
    .then(getNonVerifiedUser)
    .then(user =>
      startEmailVerificationForUser(user, returnUrl, remindUser))
    .tap(() => {
      res.json({
        success: true,
        message: 'E-mail verificatie gestart.',
      });
    })
    .catch(UnauthorizedError, err => {
      debug.debug({ message: 'Authentication error', err });
      sendError(res, 403, 'Authenticatiefout.');
    })
    .catch(ValidationError, err => {
      debug.debug({ message: 'Bad request', err });
      sendError(res, 400, err.message);
    })
    .catch(err => {
      debug.debug({ message: 'Server error', err });
      sendError(res, 500, 'Serverfout.');
    });
};
