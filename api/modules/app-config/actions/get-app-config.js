/**
 * Response handler for config/get-app-config.
 * @module modules/config/actions/get-app-config
 */

import config from './../../../config';

/**
 * Response handler for getting the app-config.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  res.json({
    tippiqPlacesBaseUrl: config.tippiqPlacesBaseUrl,
    frontendBaseUrl: config.frontendBaseUrl,
    privacyUrl: config.privacyUrl,
    landingBaseUrl: config.landingBaseUrl,
    irmaEnabled: config.irmaEnabled,
  });
}
