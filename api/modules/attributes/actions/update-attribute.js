/**
 * Response handler for attributes/update-attribute.
 * @module modules/attributes/actions/update-attribute
 */

import debugLogger from 'debugnyan';

import { Attribute } from '../models';
import validateAttribute from '../attribute-validation';
import { AttributeRepository } from '../repositories';
import { ValidationError } from '../../../common/errors';
import { sendError } from '../../../common/route-utils';
import { UPDATE_ATTRIBUTE } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-id:attributes:actions:update-attribute');

/**
 * Response handler for updating a attribute.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  debug.debug('Update attribute');

  validateAttribute(req.body)
    .then(() => AttributeRepository.findById(req.params.id))
    .tap((attribute) => {
      const localRoles = [];
      if (req.user && req.user.id && attribute.get('userId') === req.user.id) {
        localRoles.push(ROLES.OWNER);
      }
      return validatePermissions(req, res, UPDATE_ATTRIBUTE, localRoles);
    })
    .then(attribute => AttributeRepository.updateById(attribute.get('id'), req.body))
    .then(attribute => res.json(attribute.serialize({ context: 'attribute' })))
    .catch(Attribute.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(ValidationError, e => sendError(res, 400, `Validatiefout: ${e.message}.`))
    .catch(e => sendError(res, 500, `Serverfout: ${e}.`));
}
