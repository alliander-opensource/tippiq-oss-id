/**
 * Profile reducer.
 * @module reducers/profile
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  GET_PROFILE,
  LOGOUT,
  EMAIL_SAVE,
} from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  email: null,
  emailIsVerified: false,
  error: null,
};

const actionsMap = {
  [`${GET_PROFILE}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    error: null,
  }),
  [`${GET_PROFILE}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    email: action.result.email,
    emailIsVerified: action.result.emailIsVerified,
    error: null,
  }),
  [`${GET_PROFILE}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    email: null,
    emailIsVerified: false,
    error: action.error,
  }),
  [LOGOUT]: state => ({
    ...state,
    email: null,
  }),
  [`${EMAIL_SAVE}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    saved: false,
    error: null,
  }),
  [`${EMAIL_SAVE}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    email: action.payload.email,
    saved: action.result.success,
    error: null,
  }),
  [`${EMAIL_SAVE}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    saved: false,
    error: action.error,
  }),
};

/**
 * profile reducer
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
