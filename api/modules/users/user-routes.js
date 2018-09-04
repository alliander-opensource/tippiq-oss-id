/**
 * Express Router for user actions.
 * @module users/user-routes
 */

import { Router as expressRouter } from 'express';

import changeEmail from './actions/change-email';
import changePassword from './actions/change-password';
import checkEmail from './actions/check-email';
import emailVerificationComplete from './actions/email-verification/complete';
import emailVerificationStart from './actions/email-verification/start';
import getProfile from './actions/get-profile';
import getDisplayName from './actions/get-display-name';
import getSession from './actions/get-session';
import getUser from './actions/get-user';
import login from './actions/login';
import registration from './actions/registration';
import requestResetPassword from './actions/request-reset-password';
import setPassword from './actions/set-password';
import simpleRegistration from './actions/simple-registration';
import refreshToken from './actions/refresh-token';
import deleteUser from './actions/delete-user';
import sendEmail from './actions/send-email';
import quickRegistration from './actions/quick-registration';
import sendRenderedEmail from './actions/send-rendered-email';

const router = expressRouter();
export { router as default };

router
  .post('/check-email', checkEmail)
  .post('/email', changeEmail)
  .get('/email-verification/complete', emailVerificationComplete)
  .get('/email-verification/start', emailVerificationStart)
  .get('/refresh-token', refreshToken)
  .get('/profile', getProfile)
  .get('/get-session', getSession)
  .post('/login', login)
  .post('/password', changePassword)
  .post('/registration', registration)
  .post('/request-reset-password', requestResetPassword)
  .post('/set-password', setPassword)
  .post('/simple-registration', simpleRegistration)
  .post('/delete-user', deleteUser)
  .get('/:id', getUser)
  .get('/:id/display-name', getDisplayName)
  .post('/send-email', sendEmail)
  .post('/quick-registration', quickRegistration)
  .post('/:id/messages/email', sendRenderedEmail)
;
