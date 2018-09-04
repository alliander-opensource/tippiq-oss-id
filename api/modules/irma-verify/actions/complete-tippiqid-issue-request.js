/**
 * Response handler for complete-tippiqid-issue-request.
 * @module irma/actions/complete-tippiqid-issue-request
 */

import debugLogger from 'debugnyan';
import BPromise from 'bluebird';
import { verifyIrmaStatus } from '../../irma/irma';
import { ValidationError } from '../../../common/errors';
import { IrmaIssueTokenRepository } from '../../irma/repositories';

const debug = debugLogger('tippiq-id:irma-verify:actions:complete-tippiqid-issue-request');

/**
 * Check if issue status is valid (currently only != null, later maybe more specific)
 * @function responseHandler
 * @param {string} status Issue status
 * @returns {Promise<string>} issue status
 */
function checkStatus(status) {
  if (typeof (status) === 'undefined') {
    return BPromise.reject(new ValidationError('No valid status found!'));
  }
  return BPromise.resolve(status);
}

/**
 * Response handler for complete-tippiqid-issue-request.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const sessionToken = req.params.sessionToken;

  // All routes without session token are non-existent
  if (!sessionToken) {
    return res.send(404);
  }

  return verifyIrmaStatus(req.body)
    .then(token => token.status)
    .then(status => checkStatus(status))
    .then(status => IrmaIssueTokenRepository.updateTokenWithIssueStatus(sessionToken, status))
    .then(() => {
      res
        .status(201)
        .json({ success: true, message: 'Issuestatus bijgewerkt.' });
    })
    .catch(err => {
      debug.warn(`Failed to update issue status for session token ${sessionToken}: ${err.message}`);
      res
        .status(403)
        .json({ success: false, message: 'Issuestatus bijwerken mislukt.' });
    });
}
