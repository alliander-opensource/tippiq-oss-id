/**
 * Simple registration reducer.
 * @module reducers/simple-registration
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { SIMPLE_REGISTRATION, LOGOUT } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  token: null,
  error: null,
};

const actionsMap = {
  [`${SIMPLE_REGISTRATION}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    token: null,
    error: null,
  }),
  [`${SIMPLE_REGISTRATION}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    token: action.result.token,
    error: null,
  }),
  [`${SIMPLE_REGISTRATION}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    token: null,
    error: action.error,
  }),
  [LOGOUT]: () => ({ ...initialState }),
};

/**
 * simple-registration reducer
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
