/**
 * Express Router for serviceProvider actions.
 * @module users/user-routes
 */
import { Router as expressRouter } from 'express';

import getServiceProvider from './actions/get-service-provider';

const router = expressRouter();
export { router as default };

router.route('/:id')
  .get(getServiceProvider);
