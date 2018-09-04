/**
 * Helper functions that codify our use of bcrypt to authenticate users.
 * @module auth
 */
import BPromise from 'bluebird';
import bcrypt from 'bcrypt-nodejs';
import { defaults, get, isEqual, intersection, isArray, includes } from 'lodash';
import debugLogger from 'debugnyan';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../../config';
import { AuthenticationError, TokenDecodeError, UnauthorizedError } from '../../common/errors';
import { sendUnauthorized } from '../../common/route-utils';
import { RolePermissionRepository } from './repositories';
import { OAuth2ClientRepository } from '../oauth2/repositories';

/**
 * Array for storing requests for rate limiting.
 */
let requestsObj = {
  creationDate: Date.now(),
};

BPromise.promisifyAll(bcrypt);

const debug = debugLogger('tippiq-id:auth');
const JWT_EXPIRATION = '7d';
const JWT_RESET_PASSWORD_EXPIRATION = '1h';
const JWT_SETUP_PASSWORD_EXPIRATION = '7d';

const JWT_OPTIONS = {
  algorithm: 'RS256',
  audience: config.jwtAudience,
  expiresIn: JWT_EXPIRATION,
  issuer: config.jwtIssuer,
};

export const ACTIONS = Object.freeze({
  EMAIL_VERIFICATION: 'tippiq-id.email_verification',
  EMAIL_VERIFICATION_COMPLETE: 'tippiq-id.email-verification-complete',
  LOGIN_SESSION: 'tippiq-id.login_session',
  PASSWORD_RESET: 'tippiq-id.password_reset',
  PASSWORD_SETUP: 'tippiq-id.password_setup',
});

export const ROLES = Object.freeze({
  ANONYMOUS: 'anonymous',
  AUTHENTICATED: 'authenticated',
  OWNER: 'owner',
  REGISTERED: 'registered',
  SERVICE: 'service',
  ADMINISTRATOR: 'administrator',
});

/**
 * getValidAudience
 * @param {string} requestedAudience audience
 * @returns {string} a validated audience
 */
function getValidAudience(requestedAudience) {
  const audience = { // whitelisted audiences
    id: config.jwtAudience,
    policies: config.jwtAudiencePolicies,
    places: config.jwtAudiencePlaces,
  };

  return BPromise.resolve(audience[requestedAudience])
    .then(validAudience => validAudience ||
      OAuth2ClientRepository // check known oauth2 client_id as audience
        .findOne({ client_id: requestedAudience })
        .then(() => requestedAudience)
    );
}

/**
 * Use bcrypt to salt and hash the clear text password
 * @param {string} password Clear text password to be hashed
 * @returns {string} a salted hash from the password
 */
export function hashPassword(password) {
  return bcrypt
    .genSaltAsync(5)
    .then(salt => bcrypt.hashAsync(password, salt, null));
}

/**
 * Use bcrypt to compare the given clear text password against the hash
 * @param {string} password Clear text
 * @param {string} hash Salted hash from storage
 * @returns {boolean} true when the clear text matches the hash
 */
export function verifyPassword(password, hash) {
  return bcrypt
    .compareAsync(password, hash)
    .catch(Error, (err) => {
      debug.debug(`Invalid credentials: ${err.message}`);
      throw new AuthenticationError('Invalid credentials.');
    });
}

/**
 * validateAction
 * @param {string} action Action to match
 * @param {string|array} allowedActions Allowed actions
 * @returns {bool}
 */
function validateAction(action, allowedActions) {
  if ((isArray(allowedActions) && !includes(allowedActions, action)) || // check in action array
    (!isArray(allowedActions) && !isEqual(action, allowedActions))) { // check single action
    throw new AuthenticationError(`Invalid action: ${action}`);
  }
}
/**
 * Verify the token against the configured audience and issuer and return the payload.
 * @param {string} token To decode
 * @param {string|array} [allowedActions] If present, the action field in the payload must be equal.
 * @returns {Promise<Object>} JWT payload object
 */
export function verifyJWT(token, allowedActions) {
  return BPromise
    .try(() => jwt.verify(
      token,
      config.publicKey,
      {
        audience: config.jwtAudience,
        issuer: config.jwtIssuer,
      })
    )
    .catch(err => {
      debug.debug(err);
      throw new AuthenticationError(err.message);
    })
    .tap(payload => {
      if (allowedActions) {
        validateAction(payload.action, allowedActions);
      }
    }
  );
}

/**
 * Decode the token.
 * WARNING: Unsafe!
 * @param {string} token To decode
 * @returns {Promise<Object>} JWT payload object
 */
export function decodeJWT(token) {
  return BPromise
    .try(() => jwt.decode(token))
    .catch((err) => {
      debug.debug(err);
      throw new TokenDecodeError(err.message);
    });
}

/**
 * Validate the service permissions.
 * @function validatePermissions
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {string} action Action to check permissions for
 * @returns {Promise} Resolves only if permissions validate
 */
export function validateServicePermissions(req, res, action) {
  return BPromise
    .try(() => {
    // todo: check if service has permission for action ?
      if (!isEqual(get(req, 'user.action'), action)) {
        throw new UnauthorizedError('service', action);
      }
    });
}

/**
 * Validate the permissions.
 * @function validatePermissions
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {string} permission Permissions to check for
 * @param {Array} localRoles Array of local roles
 * @returns {Promise} Resolves only if permissions validate
 */
export function validatePermissions(req, res, permission, localRoles = []) {
  return new BPromise((resolve) => {
    let user = 'anonymous';
    let myRoles = [ROLES.ANONYMOUS, ...localRoles];
    if (req.user && req.user.get('id')) {
      myRoles = [
        ROLES.AUTHENTICATED,
        ...myRoles,
        ...req.user.related('roles').map(role => role.get('name')),
      ];
      user = req.user.get('id');
    }

    RolePermissionRepository
      .findRolesByPermission(permission)
      .then((collection) => {
        const permissionRoles = collection.map(rolePermission => rolePermission.get('role'));
        if (intersection(myRoles, permissionRoles).length > 0) {
          resolve();
        } else {
          sendUnauthorized(res, user, permission);
        }
      });
  });
}

/**
 * Parse the Authentication header and add a user object to the request when it is results in a
 * valid user.
 * @function performAuthenticationLogic
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback
 * @returns {undefined}
 */
export function performAuthenticationLogic(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Parse the Authentication header and add a user object to the request when it is results in a
 * valid Tippiq user.
 * @function performTippiqServiceAuthenticationLogic
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback
 * @returns {undefined}
 */
export function performTippiqServiceAuthenticationLogic(req, res, next) {
  passport.authenticate('tippiqServiceJwt', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Parse the Authentication header and add a user object to the request when it is results in a
 * valid Tippiq Places user.
 * @function performTippiqPlacesServiceAuthenticationLogic
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express callback
 * @returns {undefined}
 */
export function performTippiqPlacesServiceAuthenticationLogic(req, res, next) {
  passport.authenticate('tippiqPlacesServiceJwt', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Parse the Basic Authentication header and add a user object to the request when it results
 * in a valid client.
 * @function oauth2ClientAuthentication
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express callback.
 * @returns {undefined}
 */
export function oauth2ClientAuthentication(req, res, next) {
  passport.authenticate('oauth2Client', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Generate a signed JWT with defaults for the audience and issuer.
 * @function getSignedJwt
 * @param {Object} [payload] To include in the token.
 * @param {Object} [options] To create the token with.
 * @returns {Promise<string>} JWT
 */
export function getSignedJwt(payload, options) {
  const jwtPayload = defaults({}, payload);
  const jwtOptions = defaults({}, options, JWT_OPTIONS);
  return BPromise.try(() => jwt.sign(jwtPayload, config.privateKey, jwtOptions));
}

/**
 * Generate a JWT token for the configured audience for this issuer.
 * @function getJwtForUserId
 * @param {string} userId To generate a token for
 * @param {string} requestedAudience The requested audience (default id)
 * @param {string} payload Optional extra jwt payload
 * @returns {Promise<string>} JWT token
 */
export function getJwtForUserId(userId, requestedAudience = 'id', payload = {}) {
  return getValidAudience(requestedAudience)
    .then(validAudience => getSignedJwt({
      ...payload,
      ...{ action: ACTIONS.LOGIN_SESSION },
    }, {
      audience: validAudience,
      subject: userId,
    })
  );
}

/**
 * Generate a JWT token for the configured audience for this issuer.
 * @function getResetPasswordJwtForUserId
 * @param {string} userId To generate a token for
 * @returns {Promise<string>} JWT token
 */
export function getResetPasswordJwtForUserId(userId) {
  return getSignedJwt({ action: ACTIONS.PASSWORD_RESET },
    { expiresIn: JWT_RESET_PASSWORD_EXPIRATION, subject: userId });
}

/**
 * Generate a JWT token for the configured audience for this issuer.
 * @function getSetupPasswordJwtForUserId
 * @param {string} userId To generate a token for
 * @returns {Promise<string>} JWT token
 */
export function getSetupPasswordJwtForUserId(userId) {
  return getSignedJwt({ action: ACTIONS.PASSWORD_SETUP },
    { expiresIn: JWT_SETUP_PASSWORD_EXPIRATION, subject: userId });
}

/**
 * Generate a JWT token for the configured audience for this issuer.
 * @function generateEmailVerificationJwtTokenForUserId
 * @param {string} userId To generate a token for
 * @returns {Promise<string>} JWT token
 */
export function getEmailVerificationJwtForUserId(userId) {
  return getSignedJwt({ action: ACTIONS.EMAIL_VERIFICATION }, { subject: userId });
}

/**
 * Generate a JWT token for the configured audience for this issuer.
 * @function getEmailVerificationCompleteJwtForUserId
 * @param {string} userId To generate a token for
 * @returns {Promise<string>} JWT token
 */
export function getEmailVerificationCompleteJwtForUserId(userId) {
  return getSignedJwt({ action: ACTIONS.EMAIL_VERIFICATION_COMPLETE }, { subject: userId });
}

/**
 * Calculate date time difference
 * @function calculateDateTimeDifference
 * @param {string} dateTime date/time of previous date
 * @returns {int} difference in seconds
 */
export function calculateDateTimeDifference(dateTime) {
  return Math.round(Math.abs((dateTime - Date.now()) / 1000));
}

/**
 * Limit login requests by same email.
 * @function limitRequests
 * @param {string} emailAddress address of the user
 * @returns {undefined}
 */
export function limitRequests(emailAddress) {
  const loginDateTime = Date.now();

  // Delete all requests history every 2 hours, to keep memory usuage low
  if (calculateDateTimeDifference(requestsObj.creationDate) > 120) {
    requestsObj = { creationDate: loginDateTime };
  }

  if (!requestsObj[emailAddress]) {
    requestsObj[emailAddress] = {
      loginDateTime,
      attempts: 1,
    };
  } else {
    // Increase number of attempts if email already exists in requestsObj
    requestsObj[emailAddress].attempts += 1;

    if (requestsObj[emailAddress].attempts > config.rateLimitMaxAttempts) {
      if (calculateDateTimeDifference(requestsObj[emailAddress].loginDateTime)
        >= config.rateLimitTimeDifference) {
        // Reset if delay between attemps was long enough
        requestsObj[emailAddress].attempts = 1;
      } else {
        // Rate limit hit
        throw new AuthenticationError('Too many login attempts');
      }
    }
  }
}

/**
 * Reset request limit (call this after successful login attempt)
 * @function resetRequestLimit
 * @param {string} emailAddress address of the user
 * @returns {undefined}
 */
export function resetRequestLimit(emailAddress) {
  if (requestsObj[emailAddress]) {
    delete requestsObj[emailAddress];
  }
}

export default {
  verifyJWT,
  decodeJWT,
  getJwtForUserId,
  getEmailVerificationJwtForUserId,
  getEmailVerificationCompleteJwtForUserId,
  getResetPasswordJwtForUserId,
  performAuthenticationLogic,
  performTippiqServiceAuthenticationLogic,
  performTippiqPlacesServiceAuthenticationLogic,
  oauth2ClientAuthentication,
  verifyPassword,
  ACTIONS,
};
