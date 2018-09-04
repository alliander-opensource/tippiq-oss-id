/**
 * Helper functions for IRMA
 * TODO: may need to be divided over different modules in a later stage
 * @module irma
 */
import BPromise from 'bluebird';
import jwt from 'jsonwebtoken';
import superagent from 'superagent';

import config from '../../config';
import { IrmaConfigurationError } from './errors';
import { ValidationError } from '../../common/errors';
import {
  verifyIrmaApiServerJwt,
  verifyIrmaApiServerStatusJwt,
  checkIrmaProofValidity,
} from './irma-jwt-helpers';

const irmaVerifyJwtOptions = {
  algorithm: (config.tippiqIdIrmaPrivateKey ? 'RS256' : 'none'),
  issuer: config.tippiqIdIrmaName,
  subject: 'verification_request',
};

const irmaIssueJwtOptions = {
  algorithm: (config.tippiqIdIrmaPrivateKey ? 'RS256' : 'none'),
  issuer: config.tippiqIdIrmaName,
  subject: 'issue_request',
};

/**
 * Generate an IRMA disclosure request JWT containing the attributes specified
 * @function generateAttributeDisclosureRequest
 * @param {string} name name of this disclosure request
 * @param {list} attributes disjunction list with the attributes to be revealed
 * @returns {Promise<string>} JWT with an IRMA disclosure request
 */
function generateAttributeDisclosureRequest(name, attributes) {
  const key = config.tippiqIdIrmaPrivateKey;
  const request = {
    data: name,
    validity: 60,
    timeout: 600,
    callbackUrl: `${config.frontendBaseUrl}/api/irma/complete-login-request`,
    request: {
      content: attributes,
    },
  };
  return BPromise
    .try(() => jwt.sign({ sprequest: request }, key, irmaVerifyJwtOptions));
}

/**
 * Generate an IRMA issue request JWT containing the credentials specified
 * @function generateCredentialIssueRequest
 * @param {string} name name of this disclosure request (will be present in de data field)
 * @param {string} callbackEndpoint endpoint of the api url where issue status will be posted
 * @param {list} credentials list with credentials and their attribute values that will be issued
 * @param {list} disclose disjunction list with the attributes to be revealed
 * @returns {Promise<string>} JWT with an IRMA disclosure request
 */
function generateCredentialIssueRequest(name, callbackEndpoint, credentials, disclose) {
  const key = config.tippiqIdIrmaPrivateKey;
  const request = {
    data: name,
    validity: 60,
    timeout: 600,
    callbackUrl: `${config.frontendBaseUrl}/${callbackEndpoint}`,
    request: {
      credentials,
      disclose,
    },
  };
  return BPromise
    .try(() => jwt.sign({ iprequest: request }, key, irmaIssueJwtOptions));
}

/**
 * Contact IRMA api server to request a session token for an IRMA session
 * @function requestSessionToken
 * @param {object} data POST data for the IRMA api server
 * @param {string} endpoint api endpoint on IRMA api server
 * @returns {Promise<object>} IRMA api server session token that can be presented to client in QR
 */
function requestSessionToken(data, endpoint) {
  const url = `http://${config.irmaApiServerHost}:${config.irmaApiServerPort}/irma_api_server/api/v2/${endpoint}`; // TODO: https
  const request = superagent.post(url);

  request.type('text/plain');
  request.send(data);

  return new Promise((resolve, reject) => {
    request.end((err, result = {}) => {
      if (err) {
        reject(result.body || err);
      } else {
        resolve(result.body);
      }
    });
  });
}

/**
 * Contact IRMA api server to request a session token for a verification session
 * @function requestVerificationSessionToken
 * @param {object} sprequest with attributes that need to be revealed
 * @returns {Promise<object>} IRMA api server session token that can be presented to client in QR
 */
function requestVerificationSessionToken(sprequest) {
  return requestSessionToken(sprequest, 'verification');
}

/**
 * Contact IRMA api server to request a session token for a verification session
 * @function requestIssueSessionToken
 * @param {object} iprequest issue request with credentials to be issued
 * @returns {Promise<object>} IRMA api server session token that can be presented to client in QR
 */
function requestIssueSessionToken(iprequest) {
  return requestSessionToken(iprequest, 'issue');
}

/**
 * Verify an IRMA JWT token and return attributes that this token contains
 * @function verifyAttributeDisclosureResponse
 * @param {string} token JWT token that is obtained from the IRMA api server
 * @returns {Promise<json>} The list of attributes that are revealed
 */
function verifyAttributeDisclosureResponse(token) {
  return verifyIrmaApiServerJwt(token)
    .then(decoded => checkIrmaProofValidity(decoded))
    .then(checkedToken => checkedToken.attributes);
}

/**
 * Verify an IRMA JWT issue status token and return issue status
 * @function verifyIrmaStatus
 * @param {string} token JWT token that is obtained from the IRMA api server
 * @returns {Promise<json>} Issue status
 */
function verifyIrmaStatus(token) {
  return verifyIrmaApiServerStatusJwt(token);
}

/**
 * Floor validity date to a non-identifying interval
 * @function floorValidityDate
 * @param {int} timestamp UNIX timestamp in millisecs to be floored
 * @returns {int} floored UNIX timestamp in seconds
 */
function floorValidityDate(timestamp) {
  const EXPIRY_FACTOR = 1000 * 60 * 60 * 24 * 7; // Taken from IRMA source code
  return Math.floor((Math.floor(timestamp / EXPIRY_FACTOR) * EXPIRY_FACTOR) / 1000);
}

/**
 * Generate an IRMA credential from a name, list of attributes and validity date
 * @param {string} name of credentials
 * @param {object} attributes dictionary containing names of IRMA attributes and their values
 * @param {Date} validity date object with expiry date of credential
 * @returns {Promise<object>} IRMA credential
 */
function generateIrmaCredential(name, attributes, validity) {
  if (typeof (attributes) !== 'object') {
    return BPromise.reject(new ValidationError('Invalid type for attributes!'));
  }
  return BPromise.resolve({
    credential: name,
    validity: floorValidityDate(validity.getTime()),
    attributes,
  });
}

/**
 * Create json to be presented in a QR code for IRMA
 * @param {string} path string with path
 * @param {string} sessionToken to be present in QR
 * @returns {Promise<json>} QR code json
 */
function createQrJson(path, sessionToken) {
  if (typeof (config.irmaApiServerHost) === 'undefined') {
    return BPromise.reject(
      new IrmaConfigurationError('irmaApiServerHost config entry is not defined!'));
  }

  if (typeof (config.irmaApiServerPort) === 'undefined') {
    return BPromise.reject(
      new IrmaConfigurationError('irmaApiServerPort config entry is not defined!'));
  }

  return BPromise.resolve({
    u: `http://${config.irmaApiServerHost}:${config.irmaApiServerPort}/irma_api_server/api/v2/${path}/${sessionToken}`,  // TODO: https!
    v: '2.1',
    vmax: '2.1',
  });
}

export default {
  generateAttributeDisclosureRequest,
  requestVerificationSessionToken,
  requestIssueSessionToken,
  generateCredentialIssueRequest,
  verifyAttributeDisclosureResponse,
  verifyIrmaStatus,
  generateIrmaCredential,
  createQrJson,
};
