/**
 * Response handler for attributes/add-attribute.
 * @module modules/attributes/actions/add-attribute
 */

import debugLogger from 'debugnyan';
import { includes } from 'lodash';

import { AttributeRepository } from '../repositories';
import { sendCreated, sendError } from '../../../common/route-utils';
import validateAttribute from '../attribute-validation';
import { ADD_ATTRIBUTE } from '../../auth/permissions';
import { ValidationError } from '../../../common/errors';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-id:attributes:actions:add-attribute');

const UNIQUE_ATTRIBUTES = ['user_name'];
/**
 * Response handler for adding a attribute.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  debug.debug('add attribute');
  const userId = req.user ? req.user.get('id') : undefined;
  const localRoles = [];
  if (req.body.userId === userId || userId) {
    localRoles.push(ROLES.OWNER);
  }
  return validatePermissions(req, res, ADD_ATTRIBUTE, localRoles)
    .then(() => validateAttribute(req.body))
    .then(attribute => (includes(UNIQUE_ATTRIBUTES, attribute.data.type) ?
        AttributeRepository.findWithPayloadKeyValue(req.user.id, 'type', 'user_name')
          .then(attributes => {
            if (attributes.length > 0) {
              throw new ValidationError('Attribute is unique and already set');
            } else return attribute;
          })
      : attribute)
    )
    .then(attribute => AttributeRepository.create(attribute))
    .then(attribute => sendCreated(res, attribute.get('id')))
    .catch(ValidationError, e => {
      debug.debug(`ValidationError on add attribute: ${e.message} ${e.stack}`);
      res
        .status(400)
        .json({
          success: false,
          message: e.message,
        });
    })
    .catch((e) => {
      debug.debug(`Error add attribute: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}
