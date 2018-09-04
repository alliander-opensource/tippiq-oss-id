/**
 * Quick registration reducer.
 * @module reducers/quick-registration
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { QUICK_REGISTRATION, LOGOUT } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  idToken: null,
  hoodToken: null,
  accessToken: null,
  placeId: null,
  error: null,
};

const actionsMap = {
  [`${QUICK_REGISTRATION}_PENDING`]: state => ({
    ...state,
    status: PENDING,
  }),
  [`${QUICK_REGISTRATION}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    idToken: action.result.idToken,
    hoodToken: action.result.hoodToken,
    accessToken: action.result.accessToken,
    placeId: action.result.placeId,
    error: null,
  }),
  [`${QUICK_REGISTRATION}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    idToken: null,
    hoodToken: null,
    accessToken: null,
    placeId: null,
    error: action.error,
  }),
  [LOGOUT]: () => ({ ...initialState }),
};

/**
 * quickRegistration reducer
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
