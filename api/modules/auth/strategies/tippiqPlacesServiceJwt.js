/**
 * JWT Token Passport Strategy.
 * @module auth/strategies/tippiqPlacesServiceJwt
 */
import { ExtractJwt, Strategy } from 'passport-jwt';

import BPromise from 'bluebird';
import config from '../../../config';

const options = Object.freeze({
  issuer: config.jwtIssuerPlaces,
  audience: config.jwtAudience,
  secretOrKey: config.tippiqPlacesServicePublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
});

const strategy = new Strategy(options, (jwtPayload, done) => {
  BPromise.resolve(jwtPayload.sub)
    .then(() => ({
      service: 'tippiq-places-service',
      action: jwtPayload.action,
    }))
    .asCallback(done);
});

export default {
  strategy,
};
