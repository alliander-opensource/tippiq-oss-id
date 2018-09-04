/**
 * Express Router for irma actions.
 * @module irma-verify/irma-routes
 */

import { Router as expressRouter } from 'express';
import bodyParser from 'body-parser';

import generateLoginRequest from './actions/generate-login-request';
import completeLoginRequest from './actions/complete-login-request';
import generateLoginToken from './actions/generate-login-token';

import generateTippiqidIssueRequest from './actions/generate-tippiqid-issue-request';
import completeTippiqidIssueRequest from './actions/complete-tippiqid-issue-request';
import tippiqIdIssueStatus from './actions/tippiqid-issue-status';

const router = expressRouter();
export { router as default };

router
  .get('/generate-login-request', generateLoginRequest)
  .post('/complete-login-request/:sessionToken', bodyParser.text(), completeLoginRequest)
  .get('/generate-login-token/:sessionToken', generateLoginToken)
  .get('/generate-tippiqid-issue-request', generateTippiqidIssueRequest)
  .post('/complete-tippiqid-issue-request/:sessionToken', bodyParser.text(),
    completeTippiqidIssueRequest)
  .get('/tippiqid-issue-status/:sessionToken', tippiqIdIssueStatus)
;
