/**
 * Express Router for user actions.
 * @module email/email-routes
 */

import { Router as expressRouter } from 'express';

import testAllEmails from './actions/generate-test-emails';
import sendServiceEmail from './actions/send-service-email';
import sendEmail from './actions/send-email';

const router = expressRouter();
export { router as default };

router
  .post('/send', sendServiceEmail)
  .post('/send-email', sendEmail)
  .get('/test/:emails*?', testAllEmails);
