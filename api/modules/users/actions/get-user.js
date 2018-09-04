/**
 * Response handler for get user.
 * @module users/actions/get-user
 */

import debugLogger from 'debugnyan';

import { GET_USER } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';
import { UserRepository } from '../repositories';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { garbleEmailAddress } from '../../../common/garble-email-address';

const debug = debugLogger('tippiq-id:users:actions:get-user');

/**
 * Response handler for get user
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissions(req, res, GET_USER)
    .then(() => UserRepository.findById(req.params.id))
    .then(user => user.serialize({ context: 'user' }))
    .then(user => ({
      scrambledEmail: garbleEmailAddress(user.email),
      emailIsVerified: user.emailIsVerified,
    }))
    .then(user => res.json(user)) // do not shorten, res.json will break
    .catch(UserRepository.Model.NotFoundError, () => {
      sendError(res, 404, 'Niet gevonden.');
    })
    .catch((err) => {
      catchInvalidUUIDError(res, err);
    })
    .catch((err) => {
      debug.debug(err);
      sendError(res, 500, 'Serverfout.');
    });
}
