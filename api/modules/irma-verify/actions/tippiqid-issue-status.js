/**
 * Response handler for tippiqid-issue-status.
 * @module irma-verify/actions/tippiqid-issue-status
 */

import debugLogger from 'debugnyan';
import { IrmaIssueTokenRepository } from '../../irma/repositories';

const debug = debugLogger('tippiq-id:irma-verify:actions:tippiqid-issue-status');

/**
 * Response handler for tippiqid-issue-status.
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

  return IrmaIssueTokenRepository.findOne({ session_token: sessionToken })
    .then(record => record.get('issueStatus'))
    .then(status => {
      res
        .status(200)
        .send({ status });
    })
    .catch(err => {
      debug.debug(`Failed to generate login token: ${err.message}`);
      res
        .status(403)
        .json({ success: false, message: 'Toegang geweigerd voor dit sessietoken.' });
    });
}
