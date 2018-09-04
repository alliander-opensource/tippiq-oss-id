/**
 * Password reset request reducer.
 * @module reducers/passwordResetRequest
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { PASSWORD_RESET_REQUEST }
  from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  success: false,
  error: null,
};

const actionsMap = {
  [`${PASSWORD_RESET_REQUEST}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    success: false,
    error: null,
  }),
  [`${PASSWORD_RESET_REQUEST}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    success: action.result.success,
    error: null,
  }),
  [`${PASSWORD_RESET_REQUEST}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    error: action.error,
  }),
};

/**
 * passwordResetRequest reducer
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
