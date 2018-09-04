/**
 * Response handler for attributes/get-attribute.
 * @module modules/attributes/actions/get-policy
 */

import debugLogger from 'debugnyan';

import { Attribute } from '../models';
import { AttributeRepository } from '../repositories';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';

const debug = debugLogger('tippiq-id:attributes:actions:get-attributes');

/**
 * Response handler for getting attributes.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const userId = req.user && req.user.id;
  AttributeRepository
    .findAllByUser(userId)
    .then(attributes => res.json(attributes.serialize({ context: 'attribute' })))
    .catch(Attribute.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch((e) => {
      debug.error(`Error get attributes: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}
