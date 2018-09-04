/**
 * Get service provider reducer.
 * @module reducers/getServiceProvider
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { GET_SERVICE_PROVIDER } from '../constants/ActionTypes';

const initialState = {
  id: null,
  status: IDLE,
  name: null,
  brandColor: null,
  logo: null,
  error: null,
};

const actionsMap = {
  [`${GET_SERVICE_PROVIDER}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    name: null,
    brandColor: null,
    logo: null,
    error: null,
  }),
  [`${GET_SERVICE_PROVIDER}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    name: action.result.name,
    brandColor: action.result.brandColor,
    logo: action.result.logo,
  }),
  [`${GET_SERVICE_PROVIDER}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    error: action.error,
  }),
};

/**
 * serviceProvider reducer
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
