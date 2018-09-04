/**
 * Response handler for complete-login-request.
 * @module irma/actions/complete-login-request
 */

import debugLogger from 'debugnyan';
import { UserRepository } from '../../users/repositories';
import { IrmaSessionTokenRepository } from '../../irma/repositories';
import { verifyAttributeDisclosureResponse } from '../../irma/irma';
import { UnauthorizedError } from '../../../common/errors';

const debug = debugLogger('tippiq-id:irma-verify:actions:complete-login-request');

/**
 * Response handler for complete-login-request.
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

  let id;
  return verifyAttributeDisclosureResponse(req.body)
    .then(attributes => attributes['tippiq.Tippiq.user.id'])
    .then(userId => UserRepository.findOne({ id: userId }))
    .then(user => (id = user.get('id')))
    .then(() => IrmaSessionTokenRepository.updateTokenWithUser(sessionToken, id))
    .then(() => {
      res
        .status(201)
        .json({ success: true, message: 'UUID geldig.' });
    })
    .catch(UserRepository.Model.NotFoundError, () => // User id not found, delete session token
      IrmaSessionTokenRepository.deleteBySessionToken(sessionToken)
        .then(() => { throw new UnauthorizedError(); })
    )
    .catch(UnauthorizedError, () => {
      res
        .status(400)
        .json({
          success: false,
          message: 'Inlogaanvraag afgebroken: onbekend user id attribuut.',
        });
    })
    .catch(err => {
      debug.warn(`Failed to complete login request for id: ${id} and session token ${sessionToken}: ${err.message}`);
      res
        .status(403)
        .json({ success: false, message: 'Inlogaanvraag afgebroken.' });
    });
}
