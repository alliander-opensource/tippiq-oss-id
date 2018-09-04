/**
 * Express Router for attribute actions.
 * @module attributes/attribute-routes
 */

import { Router as expressRouter } from 'express';

import {
  getAttribute,
  getAttributes,
  addAttribute,
  updateAttribute,
  deleteAttribute,
} from './actions';

const router = expressRouter();
export { router as default };

router.route('/')
  .get(getAttributes)
  .post(addAttribute);

router.route('/:id')
  .get(getAttribute)
  .put(updateAttribute)
  .delete(deleteAttribute);
