/**
 * Utility functions for routing.
 * @module common/route-utils
 */

/**
 * Send created message.
 * @function sendCreated
 * @param {Object} res Express response object
 * @param {string} id Id of the created object
 * @returns {undefined}
 */
export function sendCreated(res, id) {
  res
    .set({ Location: `${res.req.baseUrl}/${id}` })
    .status(201)
    .send({
      success: true,
      message: 'Aangemaakt.',
      id,
    });
}

/**
 * Send created message for multiple resources.
 * @function sendCreatedMultiple
 * @param {Object} res Express response object
 * @param {array} ids Ids of the created objects
 * @returns {undefined}
 */
export function sendCreatedMultiple(res, ids) {
  res
    .set({ Location: `${res.req.baseUrl}` })
    .status(201)
    .send({
      success: true,
      message: 'Aangemaakt.',
      ids,
    });
}

/**
 * Send status.
 * @function sendStatus
 * @param {Object} res Express response object
 * @param {Number} status Status code to be send
 * @param {boolean} success True if call is successful
 * @param {string} message Message to be send
 * @returns {undefined}
 */
export function sendStatus(res, status, success, message) {
  res
    .status(status)
    .send({
      success,
      message,
    });
}

/**
 * Send error.
 * @function sendStatus
 * @param {Object} res Express response object
 * @param {Number} status Status code to be send
 * @param {string} message Message to be send
 * @returns {undefined}
 */
export function sendError(res, status, message) {
  sendStatus(res, status, false, message);
}

/**
 * Send success.
 * @function sendSuccess
 * @param {Object} res Express response object
 * @param {Number} [status=200] Status code to be send
 * @param {string} [message=null] Message to be send
 * @returns {undefined}
 */
export function sendSuccess(res, status = 200, message = null) {
  sendStatus(res, status, true, message);
}

/**
 * Send unauthorized.
 * @function sendUnauthorized
 * @param {Object} res Express response object
 * @param {string} user Logged in user
 * @param {string} permission Permission needed
 * @returns {undefined}
 */
export function sendUnauthorized(res, user, permission) {
  sendStatus(res, 403, false, `Gebruiker ${user} heeft geen toestemming voor ${permission}.`);
}

/**
 * Catch invalid uuid error.
 * @function catchInvalidUUIDError
 * @param {Object} res Express response object
 * @param {Object} exception Exception object
 * @returns {undefined}
 */
export function catchInvalidUUIDError(res, exception) {
  if (exception.code === '22P02') {
    sendError(res, 404, 'Niet gevonden, ongeldig UUID.');
  } else {
    throw exception;
  }
}
