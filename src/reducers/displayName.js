/**
 * DisplayName reducer.
 * @module reducers/displayName
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  DISPLAY_NAME,
  LOGOUT,
} from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  result: null,
  error: null,
};

const actionsMap = {
  [`${DISPLAY_NAME}_PENDING`]: state => ({
    ...state,
    status: PENDING,
  }),
  [`${DISPLAY_NAME}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    result: action.result.displayName,
    error: null,
  }),
  [`${DISPLAY_NAME}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    result: null,
    error: action.error,
  }),
  [LOGOUT]: () => ({ ...initialState }),
};

/**
 * DisplayName reducer
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
