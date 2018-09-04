/**
 * Express Router for Redirect actions.
 * @module redirect/redirect-routes
 */
import { Router as expressRouter } from 'express';

import redirect from './actions/redirect';

const router = expressRouter();
export { router as default };

router.route('/')
  .get(redirect);
