/**
 * UserAttribute reducer.
 * @module reducers/userAttribute
 */
import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  USER_ATTRIBUTE_RESET,
  USER_ATTRIBUTE_CREATE,
  USER_ATTRIBUTE_SAVE,
} from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  error: false,
  result: null,
};

const actionsMap = {
  [USER_ATTRIBUTE_RESET]: () => ({ ...initialState }),
  [`${USER_ATTRIBUTE_CREATE}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    error: null,
  }),
  [`${USER_ATTRIBUTE_CREATE}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    result: action.result,
  }),
  [`${USER_ATTRIBUTE_CREATE}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    error: action.error,
  }),
  [`${USER_ATTRIBUTE_SAVE}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    error: null,
  }),
  [`${USER_ATTRIBUTE_SAVE}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    result: action.result,
  }),
  [`${USER_ATTRIBUTE_SAVE}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    error: action.error,
  }),
};

/**
 * user-attribute reducer
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
