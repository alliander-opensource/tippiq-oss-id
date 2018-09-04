import expressBunyanLogger from 'express-bunyan-logger';
import traverse from 'traverse';
import { flattenDeep } from 'lodash';

/**
 * Wrapper for expressBunyanLogger that offers more obfuscation
 * @param {object} options Are passed on to expressBunyanLogger
 * @returns {function} Express middleware function
 */
export default function serverLogger(options) {
  const obfuscatePlaceholder = options.obfuscatePlaceholder || '[HIDDEN]';
  const obfuscateKeys = flattenDeep([options.obfuscateKeys || ['token']]);
  delete options.obfuscateKeys; // eslint-disable-line no-param-reassign
  const urlObfuscatePlaceholder = `$1=${obfuscatePlaceholder}`;
  const queryStringMatcher = new RegExp(
    `(${obfuscateKeys.join('|')})=([^&]*?)(?=&|$)`
  );

  /**
   * All values matching the key url or referer will be scanned as an url. Every instance of
   * obfuscateKeys in the query string will replaced with the obfuscatePlaceholder.
   * This must be a function where this will be bound by traverse.
   * @param {*} value for the key
   * @returns {undefined}
   */
  function stripTokenFromUrl(value) {
    if (/(referer|url)/.test(this.key)) {
      this.update(value.replace(queryStringMatcher, urlObfuscatePlaceholder));
    }
  }

  /**
   * Traverse all properties in meta and apply stripTokenFromUrl. Then the default behavior of
   * levelFn is executed. This is an unofficial use of a hook to have access at object that needs
   * obfuscation.
   * @param {number} status State to help decide the log level
   * @param {Error} [err] State to help decide the log level
   * @param {object} meta State to help decide the log level
   * @returns {string} level to log at
   */
  function levelFn(status, err, meta) {
    traverse(meta).forEach(stripTokenFromUrl);

    // This is copied from the expressBunyanLogger internals
    if (err || status >= 500) { // server internal error or error
      return 'error';
    } else if (status >= 400) { // client error
      return 'warn';
    }
    return 'info';
  }

  /**
   * Traverse all properties in meta and apply stripTokenFromUrl. Then the default behavior of
   * levelFn is executed. This is an unofficial use of a hook to have access at object that needs
   * obfuscation.
   * @param {object} req Express request object
   * @returns {object} things to include
   */
  function includesFn(req) {
    traverse(req).forEach(stripTokenFromUrl);

    return {};
  }

  return expressBunyanLogger({
    obfuscatePlaceholder,
    levelFn,
    includesFn,
    obfuscate: ['req-headers.authorization'],
    ...options,
  });
}
