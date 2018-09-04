/**
 * JWT Token Passport Strategy.
 * @module auth/strategies/jwt
 */
import { ExtractJwt, Strategy } from 'passport-jwt';

import BPromise from 'bluebird';
import { UserRepository } from '../../users/repositories';
import config from '../../../config';

const options = Object.freeze({
  issuer: config.jwtIssuer,
  audience: config.jwtAudience,
  secretOrKey: config.publicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
});

const strategy = new Strategy(options, (jwtPayload, done) => {
  BPromise.resolve(jwtPayload.sub)
    .then(UserRepository.findUserById)
    .tap((user) => {
      if (!user) {
        throw new Error('Incorrect or empty token user');
      }
    })
    .asCallback(done);
});

export default {
  strategy,
};
