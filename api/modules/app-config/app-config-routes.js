/**
 * Express Router for config actions.
 * @module modules/config/config-routes
 */

import { Router as expressRouter } from 'express';

import { getAppConfig } from './actions';

const router = expressRouter();

export { router as default };

router.route('/')
  .get(getAppConfig);
