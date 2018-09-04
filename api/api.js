/**
 * Module for the backend API.
 * @module api
 * @author Tippiq
 */
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { pick } from 'lodash';
import modifyResponse from 'express-modify-response';

import auth from './modules/auth';
import users from './modules/users';
import irmaVerify from './modules/irma-verify';
import email from './modules/email';
import attributes from './modules/attributes';
import serviceProvider from './modules/service-provider';
import redirect from './modules/redirect';
import {
  jwt,
  tippiqServiceJwt,
  tippiqPlacesServiceJwt,
  oauth2ClientStrategy,
} from './modules/auth/strategies';
import config, { healthKey } from './config';
import appConfigRoutes from './modules/app-config';
import cacheControl from './common/cache-control';
import apiHealthcheck from './api-healthcheck';

const app = express();

export { app as default };

app.use(bodyParser.json({ limit: '10mb' })); // Needed for sending weekly notification
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10mb',
}));

/*
TODO: replace with `app.use(cacheResponseDirective());` when it returns `this`
import legacyExpires from 'express-legacy-expires';
import cacheResponseDirective from 'express-cache-response-directive';
 */
app.use(cacheControl);

app.use(passport.initialize());
passport.use('jwt', jwt.strategy);
passport.use('tippiqServiceJwt', tippiqServiceJwt.strategy);
passport.use('tippiqPlacesServiceJwt', tippiqPlacesServiceJwt.strategy);
passport.use('oauth2Client', oauth2ClientStrategy);
app.use(auth.performAuthenticationLogic);
app.use(auth.performTippiqServiceAuthenticationLogic);
app.use(auth.performTippiqPlacesServiceAuthenticationLogic);
app.use(auth.oauth2ClientAuthentication);

app.use('/healthcheck',
  modifyResponse(
    req => req.header('x-health') !== healthKey,
    (req, res, body) => Promise
      .resolve(body)
      .then(buffer => (buffer.length ? buffer.toString() : '{}'))
      .then(JSON.parse)
      .then(obj => pick(obj, ['status', 'api.status', 'api.database.status', 'api.addresses.status']))
      .then(JSON.stringify),
  ),
  apiHealthcheck());
app.use('/app-config', appConfigRoutes.routes);
app.use('/users', users.routes);
app.use('/email', email.routes);
app.use('/service-provider', serviceProvider.routes);
app.use('/attributes', attributes.routes);
app.use('/redirect', redirect.routes);

// Enable IRMA only if config is properly set
if (config.irmaEnabled === true
  && (typeof config.irmaApiServerHost !== 'undefined')
  && (typeof config.irmaApiServerPort !== 'undefined')
  && (typeof config.irmaApiServerPublicKey !== 'undefined')) {
  app.use('/irma', irmaVerify.routes);
}
