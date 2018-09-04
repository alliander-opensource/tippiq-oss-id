/**
 * UserAttributes reducer.
 * @module reducers/userAttributes
 */
import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { USER_ATTRIBUTES_LOAD } from '../constants/ActionTypes';

const initialState = {
  list: null,
  status: IDLE,
  error: false,
};

const actionsMap = {
  [`${USER_ATTRIBUTES_LOAD}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    error: null,
  }),
  [`${USER_ATTRIBUTES_LOAD}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    list: action.result,
  }),
  [`${USER_ATTRIBUTES_LOAD}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    error: action.error,
  }),
};

/**
 * user-attributes reducer
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
