/**
 * JWT Token Passport Strategy.
 * @module auth/strategies/tippiqServiceJwt
 */
import { ExtractJwt, Strategy } from 'passport-jwt';

import BPromise from 'bluebird';
import config from '../../../config';

const options = Object.freeze({
  issuer: config.jwtIssuerTippiq,
  audience: config.jwtAudienceTippiq,
  secretOrKey: config.tippiqServicePublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
});

const strategy = new Strategy(options, (jwtPayload, done) => {
  BPromise.resolve(jwtPayload.sub)
    .then(() => ({
      service: 'tippiq-service',
      action: jwtPayload.action,
    }))
    .asCallback(done);
});

export default {
  strategy,
};
