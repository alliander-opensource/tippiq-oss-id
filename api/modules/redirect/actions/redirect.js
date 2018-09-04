/**
 * Response handler for redirect/redirect
 * @module modules/redirect/actions/redirect
 */
import debugLogger from 'debugnyan';
import BPromise from 'bluebird';
import { OAuth2RedirectUriRepository } from '../../../modules/oauth2/repositories';
import config from '../../../config';

const debug = debugLogger('tippiq-id:redirect');

/**
 * Check if checkUri starts with startsWithUri
 * @function matchUri
 * @param {string} checkUri Uri to check
 * @param {string} startsWithUri Uri to match start.
 * @returns {bool}
 */
function matchUri(checkUri, startsWithUri) {
  if (!checkUri || !startsWithUri) {
    return false;
  }
  const uri = startsWithUri.replace(/\/?$/, '/');  // add trailing slashes
  return checkUri.replace(/\/?$/, '/') === uri // check if equal when trailing slashes are added
    || checkUri.startsWith(uri);               // check startswitch
}

/**
 * Response handler for getting service provider
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const { clientId, uri } = req.query;
  debug.debug({ clientId });
  BPromise.try(() => (clientId && clientId.length > 0 ?
    OAuth2RedirectUriRepository.matchRedirectUri(clientId, uri) : (
      matchUri(uri, '/') ||
      matchUri(uri, config.frontendBaseUrl) ||
      matchUri(uri, config.tippiqPlacesBaseUrl)
    ))
  )
  .then(success => {
    debug.debug({ success });
    if (success) {
      res.redirect(uri);
    } else {
      res.redirect('/niet-gevonden');
    }
  })
  .catch(e => {
    debug.warn(`Error verifying redirect uri: ${e.message} ${e.stack}`);
    res.redirect('/niet-gevonden');
  });
}

