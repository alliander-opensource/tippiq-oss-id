/**
 * Register reducer.
 * @module reducers/register
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { REGISTER, LOGOUT } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  result: null,
  error: null,
};

const actionsMap = {
  [`${REGISTER}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    result: null,
    error: null,
  }),
  [`${REGISTER}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    result: { ...action.result, message: 'Ok' },
    error: null,
  }),
  [`${REGISTER}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    result: null,
    error: action.error,
  }),
  [LOGOUT]: () => ({ ...initialState }),
};

/**
 * register reducer
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
