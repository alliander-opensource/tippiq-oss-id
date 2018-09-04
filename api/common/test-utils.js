/**
 * Utility functions for testing
 * @module common/test-utils
 */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiThings from 'chai-things';
import BPromise from 'bluebird';
import jwt from 'jsonwebtoken';

import { defaults } from 'lodash';

import config from '../config';

export chai, { expect } from 'chai';
export superagent from 'superagent';
export request from 'supertest-as-promised';
export app from '../api';

chai.use(chaiAsPromised);
chai.use(chaiThings);

/**
 * Create a fake Tippiq Service JWT with private key that should normally not be known by tippiq ID
 * @param {object} payload Jwt payload
 * @param {object} options Jwt Options
 * @returns {Promise<string>} JWT
 */
export function createTippiqServiceJwt(payload, options) {
  const tippiqServicePrivateKey = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIN9reLMPRaqt94t74mHvfqefCXWzuA9hRO1H+qjIrEISoAcGBSuBBAAK
oUQDQgAERaacYfJo5nsgQ/0MkCYtcKzxhyoQyWY4Fe/ecUSRNunOI+CID2zeZ5/o
Clp7c+C4eUmroYfwEgfCDb6SBRoPqQ==
-----END EC PRIVATE KEY-----`;

  const jwtPayload = defaults({}, payload);
  const jwtOptions = defaults({}, options, {
    algorithm: 'RS256',
    audience: config.jwtAudienceTippiq,
    expiresIn: '5m',
    issuer: config.jwtIssuerTippiq,
  });
  return BPromise.try(() => jwt.sign(jwtPayload, tippiqServicePrivateKey, jwtOptions));
}

/**
 * Create a fake Tippiq Places Service JWT with private key that should
 * normally not be known by tippiq ID
 * @param {object} payload Jwt payload
 * @param {object} options Jwt Options
 * @returns {Promise<string>} JWT
 */
export function createTippiqPlacesServiceJwt(payload, options) {
  const tippiqPlacesServicePrivateKey = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIA3AfB/8ewOQFAjWEoLbNsQ5QVnTihPEPyHvnrX006u7oAcGBSuBBAAK
oUQDQgAENqWoqfszSKmYzr7PFSDDMcx0sUfefHavWpzryi4kN15rvz5V81a0mCIg
xTJMWldn7gyb1IaDlD0wV6MJ79lTvA==
-----END EC PRIVATE KEY-----`;
  const jwtPayload = defaults({}, payload);
  const jwtOptions = defaults({}, options, {
    algorithm: 'RS256',
    audience: config.jwtAudience,
    expiresIn: '5m',
    issuer: config.jwtIssuerPlaces,
  });
  return BPromise.try(() => jwt.sign(jwtPayload, tippiqPlacesServicePrivateKey, jwtOptions));
}
