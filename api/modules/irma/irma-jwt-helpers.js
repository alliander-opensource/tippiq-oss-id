/**
 * Helper functions used to verify jwt proofs from the IRMA api server
 * @module irma
 */
import BPromise from 'bluebird';
import jwt from 'jsonwebtoken';

import config from '../../config';
import { AuthenticationError } from '../../common/errors';

const jwtIrmaApiServerVerifyOptions = {
  algorithm: 'RS256',
  subject: 'disclosure_result',
};

const jwtIrmaApiServerStatusOptions = {
  algorithm: 'RS256',
  subject: 'irma_status',
};

/**
 * Decode and verify JWT verify token from api server and check validity/signature
 * @function verifyIrmaJwt
 * @param {string} token JWT string
 * @returns {Promise<json>} decoded IRMA JWT token from api server
 */
function verifyIrmaApiServerJwt(token) {
  const key = config.irmaApiServerPublicKey;
  return BPromise.try(() => jwt.verify(token, key, jwtIrmaApiServerVerifyOptions));
}

/**
 * Decode and verify JWT issue status token from api server and check validity/signature
 * @function issueIrmaJwt
 * @param {string} token JWT string
 * @returns {Promise<json>} decoded IRMA JWT token from api server
 */
function verifyIrmaApiServerStatusJwt(token) {
  const key = config.irmaApiServerPublicKey;
  return BPromise.try(() => jwt.verify(token, key, jwtIrmaApiServerStatusOptions));
}

/**
 * Check IRMA proof status
 * @function checkIrmaProofValidity
 * @param {json} jwtPayload IRMA JWT token from api server
 * @throws AuthenticationError if status is not equal to 'VALID'
 * @returns {Promise<json>} decoded IRMA JWT token from api server
 */
function checkIrmaProofValidity(jwtPayload) {
  const proofStatus = jwtPayload.status;
  if (proofStatus !== 'VALID') {
    throw new AuthenticationError(`Invalid IRMA proof status: ${proofStatus}`);
  }
  return BPromise.resolve(jwtPayload);
}

export default {
  verifyIrmaApiServerJwt,
  verifyIrmaApiServerStatusJwt,
  checkIrmaProofValidity,
};
