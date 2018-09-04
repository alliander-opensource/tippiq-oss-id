/**
 * Response handler for attributes/delete-attribute.
 * @module modules/attributes/actions/delete-attribute
 */

import debugLogger from 'debugnyan';
import { Attribute } from '../models';
import { AttributeRepository } from '../repositories';
import { sendSuccess, sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { DELETE_ATTRIBUTE } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-id:attributes:actions:delete-attribute');

/**
 * Response handler for deleting a attribute.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  return AttributeRepository
    .findById(req.params.id)
    .tap((attribute) => {
      const localRoles = [];
      if (req.user && req.user.id && attribute.get('userId') === req.user.id) {
        localRoles.push(ROLES.OWNER);
      }
      return validatePermissions(req, res, DELETE_ATTRIBUTE, localRoles);
    })
    .then(attribute => AttributeRepository.deleteById(attribute.get('id')))
    .then(() => sendSuccess(res, 200, `Attribuut met id ${req.params.id} verwijderd.`))
    .catch(Attribute.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch((e) => {
      debug.debug(`Error delete attribute: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}
