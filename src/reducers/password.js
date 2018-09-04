/**
 * Password reducer.
 * @module reducers/password
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  PASSWORD_SAVE,
  PASSWORD_RESET_REQUEST,
} from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  save: null,
  reset: null,
  error: null,
  token: null,
};

const actionsMap = {
  [`${PASSWORD_SAVE}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    save: null,
    error: null,
  }),
  [`${PASSWORD_SAVE}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    save: action.result,
    token: action.result.token,
    error: null,
  }),
  [`${PASSWORD_SAVE}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    save: null,
    error: action.error,
  }),
  [`${PASSWORD_RESET_REQUEST}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    reset: null,
    error: null,
  }),
  [`${PASSWORD_RESET_REQUEST}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    reset: action.result,
    error: null,
  }),
  [`${PASSWORD_RESET_REQUEST}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    reset: null,
    error: action.error,
  }),
};

/**
 * password reducer
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
