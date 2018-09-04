/**
 * Response handler for generate-login-request.
 * @module irma-verify/actions/generate-login-request.
 */

import debugLogger from 'debugnyan';
import config from '../../../config';
import { generateAttributeDisclosureRequest, requestVerificationSessionToken } from '../../irma';
import { IrmaSessionTokenRepository } from '../../irma/repositories';

const debug = debugLogger('tippiq-id:irma-verify:actions:generate-login-request');

/**
 * Response handler for generate-login-request.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const attributes = [
    {
      label: 'Inloggen bij Tippiq e-mail',
      attributes: ['tippiq.Tippiq.user.e-mail'],
    },
    {
      label: 'Inloggen bij Tippiq id',
      attributes: ['tippiq.Tippiq.user.id'],
    },
  ];

  generateAttributeDisclosureRequest('tippiq_login_request', attributes)
    .then(sprequest => requestVerificationSessionToken(sprequest))
    .then(sessionToken => IrmaSessionTokenRepository.create(
        { session_token: sessionToken.u, created_at: new Date() }).then(() => sessionToken.u)
    )
    .then(sessionToken => {
      res
        .status(201)
        .json({
          qr: {
            u: `http://${config.irmaApiServerHost}:${config.irmaApiServerPort}/irma_api_server/api/v2/verification/${sessionToken}`,  // TODO: https!
            v: '2.1',
            vmax: '2.1',
          },
          token: sessionToken,
        });
    })
    .catch(err => {
      debug.debug(`Failed to generate a request: ${err.message}`);
      res
        .status(403)
        .json({ success: false, message: 'Aanvraag genereren mislukt.' });
    });
}

