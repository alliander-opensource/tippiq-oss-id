/**
 * Response handler for generate-login-token.
 * @module irma-verify/actions/generate-login-token.
 */

import debugLogger from 'debugnyan';
import { getJwtForUserId } from '../../auth';
import { IrmaSessionTokenRepository } from '../../irma/repositories';
import { UnknownIrmaSessionTokenError } from '../../irma/errors';

const debug = debugLogger('tippiq-id:irma-verify:actions:generate-login-token');

/**
 * Response handler for generate-login-token.
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

  return IrmaSessionTokenRepository.findOne({ session_token: sessionToken })
    .then(record => record.get('user'))
    .then(id => {
      if (!id) {
        throw new UnknownIrmaSessionTokenError();
      }
      return id;
    })
    .then(getJwtForUserId)
    .then(token => {
      // Session successfully retreived, remove session token
      IrmaSessionTokenRepository.deleteBySessionToken(sessionToken);
      return res
        .status(201)
        .send({ status: 'DONE', token });
    })
    .catch(UnknownIrmaSessionTokenError, () => {
      // Session not (yet) coupled to user, send waiting
      res
        .status(200)
        .send({ status: 'PENDING' });
    })
    .catch(err => {
      debug.debug(`Failed to generate login token: ${err.message}`);
      return res
        .status(403)
        .json({ success: false, message: 'Toegang geweigerd voor dit sessietoken.' });
    });
}
