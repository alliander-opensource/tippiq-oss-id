/**
 * Response handler for attributes/get-attribute.
 * @module modules/attributes/actions/get-policy
 */

import debugLogger from 'debugnyan';

import { Attribute } from '../models';
import { AttributeRepository } from '../repositories';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { GET_ATTRIBUTE } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-id:attributes:actions:get-attribute');

/**
 * Response handler for getting a attribute.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  AttributeRepository
    .findById(req.params.id)
    .tap((attribute) => {
      const localRoles = [];
      if (req.user && req.user.id && attribute.get('userId') === req.user.id) {
        localRoles.push(ROLES.OWNER);
      }
      return validatePermissions(req, res, GET_ATTRIBUTE, localRoles);
    })
    .then(attribute => res.json(attribute.serialize({ context: 'attribute' })))
    .catch(Attribute.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch((e) => {
      debug.debug(`Error get attribute: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}
