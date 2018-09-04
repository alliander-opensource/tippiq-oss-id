/**
 * Response handler for policies/get-service-provider.
 * @module modules/service-provider/actions/get-service-provider
 */

import debugLogger from 'debugnyan';

import { ServiceProviderRepository } from '../repositories';
import { GET_SERVICE_PROVIDER } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';

const debug = debugLogger('tippiq-id:get-service-provider');

/**
 * Response handler for getting service provider
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default (req, res) =>
  validatePermissions(req, res, GET_SERVICE_PROVIDER)
    .then(() => ServiceProviderRepository.findById(req.params.id))
    .then(data => res.json(data.serialize({ context: 'service-provider-resources' })))
    .catch(e => {
      debug.error(e);
      res
        .status(500)
        .json({
          success: false,
          message: 'Serverfout.',
        });
    });

