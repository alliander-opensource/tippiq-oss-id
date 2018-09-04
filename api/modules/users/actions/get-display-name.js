/**
 * Response handler for get display name.
 * @module users/actions/get-display-name
 */
import debugLogger from 'debugnyan';
import BPromise from 'bluebird';
import { first, flatten, get, isEqual } from 'lodash';

import { AttributeRepository } from '../../attributes/repositories';
import { UserRepository } from '../../users/repositories';
import { validatePermissions, validateServicePermissions, ROLES } from '../../auth/auth';
import { GET_USER_DISPLAY_NAME } from '../../auth/permissions';
import { UnauthorizedError } from '../../../common/errors';
import { sendError } from '../../../common/route-utils';

const SERVICE_GET_USER_DISPLAY_NAME = 'tippiq_id.get_user_display_name';

const debug = debugLogger('tippiq-id:users:actions:get-display-name');

/**
 * Response handler for get display name
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default (req, res) => {
  BPromise
    .any([
      BPromise
        .resolve(isEqual(get(req, 'user.id'), req.params.id) ? [ROLES.OWNER] : [])
        .then(localRoles =>
          validatePermissions(req, res, GET_USER_DISPLAY_NAME, localRoles)),
      validateServicePermissions(req, res, SERVICE_GET_USER_DISPLAY_NAME),
    ])
    .catch(BPromise.AggregateError, err => {
      debug.debug({ message: 'No valid credentials supplied', err });
      throw new UnauthorizedError('No valid credentials supplied');
    })
    .then(() => BPromise
      .all([
        AttributeRepository
          .findWithPayloadKeyValue(req.params.id, 'type', 'user_name')
          .map(attribute => attribute.get('data').name),
        UserRepository
          .findUserById(req.params.id)
          .then(user => user.get('email')),
      ])
      .then(flatten)
      .then(first)
    )
    .then(displayName => res.json({ success: true, displayName }))
    .catch(err => {
      debug.debug({ message: 'Could not retrieve display_name for user', err });
      sendError(res, 400, 'Kon geen display_name voor user vinden.');
    })
    .catch(UnauthorizedError, err => {
      debug.debug({ message: 'Unauthorized', err });
      sendError(res, 403, 'Geen toegang.');
    })
    .catch(err => {
      debug.debug({ message: 'Server error', err });
      sendError(res, 500, 'Serverfout.');
    });
};
