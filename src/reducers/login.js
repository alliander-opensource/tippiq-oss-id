/**
 * Login reducer.
 * @module reducers/login
 */

import jwtDecode from 'jwt-decode';

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  SIMPLE_REGISTRATION,
} from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  token: null,
  id: null,
  error: null,
};

const pending = () => ({ ...initialState, status: PENDING });
const success = (state, action) => ({
  ...state,
  status: SUCCESS,
  token: action.result.token,
  id: jwtDecode(action.result.token).sub,
  error: null,
});
const fail = (state, action) => ({
  ...state,
  status: FAIL,
  token: null,
  id: null,
  error: action.error,
});

const actionsMap = {
  [`${LOGIN}_PENDING`]: pending,
  [`${LOGIN}_SUCCESS`]: success,
  [`${LOGIN}_FAIL`]: fail,
  [`${SIMPLE_REGISTRATION}_PENDING`]: pending,
  [`${SIMPLE_REGISTRATION}_SUCCESS`]: success,
  [`${SIMPLE_REGISTRATION}_FAIL`]: fail,
  [`${REGISTER}_PENDING`]: pending,
  [`${REGISTER}_SUCCESS`]: success,
  [`${REGISTER}_FAIL`]: fail,
  [LOGOUT]: () => ({ ...initialState }),
};

/**
 * login reducer
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
