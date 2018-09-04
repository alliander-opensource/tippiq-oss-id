/**
 * Response handler for get session.
 * @module users/actions/get-session
 */

import debugLogger from 'debugnyan';

import { getJwtForUserId } from '../../auth';
import { GET_USER_SESSION } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';
import { AttributeRepository } from '../../../modules/attributes/repositories';

const debug = debugLogger('tippiq-id:users:actions:get-session');

/**
 * Check if the user has a key for the given place and create payload for token
 * @function createPayload
 * @param {String} userId UserId
 * @param {String} placeId PlaceId
 * @returns {Promise<string>} Validated placeId or null when validation fails.
 */
function createPayload(userId, placeId) {
  return AttributeRepository
    .findWithPayloadKeyValue(userId, 'placeId', placeId)
    .then(attributes => (attributes.length > 0 ? { placeId } : {}));
}

/**
 * Response handler for get session
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissions(req, res, GET_USER_SESSION)
    .then(() => createPayload(req.user.id, req.query ? req.query.place_id : null))
    .then(payload => getJwtForUserId(req.user.id, req.query.audience, payload))
    .then(token => {
      res
        .cacheControl('no-store')
        .json({
          success: true,
          token,
          email: req.user.get('email'),
        });
    })
    .catch(err => {
      debug.debug(err);
      res.json({
        success: false,
        message: 'Fout.',
      });
    });
}
