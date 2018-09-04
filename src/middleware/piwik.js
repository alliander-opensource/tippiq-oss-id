import piwik from '../piwik';

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
const END_GLOBAL_LOAD = '@redux-conn/END_GLOBAL_LOAD';

let firstPageLoadTracked = false;

/**
 * Piwik middleware.
 * @function
 * @returns {Promise} Action promise.
 */
export default () => next => action => {
  const result = next(action);

  if (action.type === LOCATION_CHANGE && !firstPageLoadTracked) {
    piwik.track();
    firstPageLoadTracked = true;
  } else if (action.type === END_GLOBAL_LOAD) {
    piwik.track();
  }

  return result;
};
