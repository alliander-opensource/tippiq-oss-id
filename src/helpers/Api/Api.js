/**
 * Api helper.
 * @module helpers/Api
 */
import storage from 'store2';
import superagent from 'superagent';
import config from '../../client-config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

/**
 * Format the url.
 * @function formatUrl
 * @param {string} path Path to be formatted.
 * @returns {string} Formatted path.
 */
function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  if (__SERVER__) {
    return `http://${config.apiHost}:${config.apiPort}/api${adjustedPath}`;
  }
  return `/api${adjustedPath}`;
}

/**
 * Api class.
 * This underscore is here to avoid a mysterious "ReferenceError: Api is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 * @class _Api
 */
class _Api {

  /**
   * Constructor
   * @method constructor
   * @param {Object} req Request object
   * @constructs _Api
   */
  constructor(req) {
    methods.forEach((method) => {
      this[method] = (path, { params, data, type } = {}) =>
        new Promise((resolve, reject) => { // eslint-disable-line complexity
          const request = superagent[method](formatUrl(path));
          const authToken = storage.get('authToken');

          if (params) {
            request.query(params);
          }

          if (__SERVER__ && req && req.get('cookie')) {
            request.set('cookie', req.get('cookie'));
          }

          if (authToken) {
            request.set('Authorization', `Bearer ${authToken}`);
          }

          if (type) {
            request.type(type);
          }

          if (data) {
            request.send(data);
          }

          request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)));
        });
    });
  }
}

const Api = _Api;

export default Api;
