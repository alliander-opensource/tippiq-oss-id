/**
 * Response handler for generate-tippiqid-issue-request.
 * @module irma-verify/actions/generate-tippiqid-issue-request.
 */

import BPromise from 'bluebird';
import debugLogger from 'debugnyan';
import { UnauthorizedError, VerificationError } from '../../../common/errors';
import {
  createQrJson,
  generateCredentialIssueRequest,
  generateIrmaCredential,
  requestIssueSessionToken,
} from '../../irma';
import { sendError } from '../../../common/route-utils';
import { IrmaIssueTokenRepository } from '../../irma/repositories';

const debug = debugLogger('tippiq-id:irma-verify:actions:generate-tippiqid-issue-request');

/**
 * Check if a we have a user (supplied by middleware)
 * @function checkUserIsDefined
 * @param {Object} user User object
 * @returns {Promise<null>} Promise
 */
function checkUserIsDefined(user) {
  if (typeof user === 'undefined') {
    return BPromise.reject(new UnauthorizedError('No bearer token supplied!'));
  }
  return BPromise.resolve();
}

/**
 * Check if a user's email is verified
 * @function checkEmailVerified
 * @param {Object} user User object
 * @returns {Promise<null>} Promise
 */
function checkEmailVerified(user) {
  if (typeof user.get('emailIsVerified') === 'undefined') {
    return BPromise.reject(new VerificationError('emailIsVerified is undefined!'));
  }
  if (user.get('emailIsVerified') !== true) {
    return BPromise.reject(new VerificationError('Email is not verified!'));
  }
  return BPromise.resolve();
}

/**
 * Convert a user object into a dictionary of IRMA attributes
 * @function generateIrmaAttributes
 * @param {Object} user User object
 * @returns {Promise<Object>} Dictionary of IRMA attributes corresponding to user
 */
function generateUserAttributesFromUser(user) {
  const attributes = {
    'e-mail': user.get('email'),
    id: user.get('id'),
  };

  if (typeof attributes['e-mail'] === 'undefined') {
    return BPromise.reject(new VerificationError('Could not retrieve e-mail attribute from user'));
  }
  if (typeof attributes.id === 'undefined') {
    return BPromise.reject(new VerificationError('Could not retrieve id attribute from user'));
  }

  return BPromise.resolve(attributes);
}

/**
 * Convert a dict of attributes values to a Tippiq IRMA user credential
 * @function generateTippiqUserCredential
 * @param {Object} user User object
 * @returns {Promise<Object>} Tippiq IRMA credential
 */
function generateTippiqUserCredential(user) {
  return generateUserAttributesFromUser(user)
    .then(attributes => {
      const now = new Date();
      // Set validity to one year from now
      const validity = new Date(now.getFullYear() + 1, now.getMonth(), now.getDay());
      return generateIrmaCredential('tippiq.Tippiq.user', attributes, validity);
    });
}

/**
 * Response handler for generate-tippiqid-issue-request.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const user = req.user;
  checkUserIsDefined(user)
    .then(() => checkEmailVerified(req.user))
    .then(() => generateTippiqUserCredential(req.user))
    .then(tippiqUserCredential => generateCredentialIssueRequest(
      'tippiqid_issue_request',
      'api/irma/complete-tippiqid-issue-request',
      [tippiqUserCredential])
    )
    .then(ipRequest => requestIssueSessionToken(ipRequest))
    .then(sessionToken => IrmaIssueTokenRepository.create({
      session_token: sessionToken.u,
      created_at: new Date(),
      user: user.get('id'),
    })
    .then(() => sessionToken.u))
    .then(sessionToken =>
      createQrJson('issue', sessionToken)
        .then(qr =>
          res
            .cacheControl('no-store')
            .status(201)
            .json({
              qr,
              token: sessionToken,
            })
        )
    )
    .catch(UnauthorizedError, err => {
      debug.debug(`Authorization error: ${err.message}`);
      sendError(res, 403, err.message);
    })
    .catch(VerificationError, err => {
      debug.debug(`Verification error: ${err.message}`);
      sendError(res, 403, err.message);
    })
    .catch(err => {
      debug.error(`Failed to generate an IRMA issue request for user ${user}: ${err.message}`);
      sendError(res, 403, 'Genereren van een IRMA issue aanvraag mislukt.');
    });
}
