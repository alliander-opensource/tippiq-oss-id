/**
 * Check if email exists reducer.
 * @module reducers/emailExists
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { EMAIL_EXISTS } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  result: null,
  error: null,
};

const actionsMap = {
  [`${EMAIL_EXISTS}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    result: null,
    error: null,
  }),
  [`${EMAIL_EXISTS}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    result: action.result,
    error: null,
  }),
  [`${EMAIL_EXISTS}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    result: null,
    error: action.error,
  }),
};

/**
 * emailExists reducer
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
