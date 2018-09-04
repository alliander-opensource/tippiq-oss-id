/**
 * AppConfig reducer.
 * @module reducers/appConfig
 */
import { APP_CONFIG } from '../constants/ActionTypes';

const initialState = {
  frontendBaseUrl: null,
  tippiqPlacesBaseUrl: null,
  privacyUrl: null,
  landingBaseUrl: null,
  enableIrma: null,
  irmaEnabled: null,
};

const actionsMap = {
  [`${APP_CONFIG}_PENDING`]: () => ({ pending: true, error: null }),
  [`${APP_CONFIG}_SUCCESS`]: (state, action) => ({
    ...action.result,
    ...{ pending: false, error: null },
  }),
  [`${APP_CONFIG}_ERROR`]: (state, action) => ({ pending: false, error: action.error }),
};

/**
 * AppConfig reducer
 * @function
 * @param {Object} state initialstate.
 * @param {Object} action result.
 * @returns {Promise} Action promise.
 */
export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) {
    return state;
  }

  return { ...state, ...reduceFn(state, action) };
}
