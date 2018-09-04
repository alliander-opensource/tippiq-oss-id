/**
 * User place session reducer.
 * @module reducers/userPlaceSession
 */

import jwtDecode from 'jwt-decode';
import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { USER_PLACE_SESSION } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  error: null,
  token: null,
  email: null,
  placeId: null,
};

const actionsMap = {
  [`${USER_PLACE_SESSION}_PENDING`]: () => ({
    ...initialState,
    status: PENDING,
  }),
  [`${USER_PLACE_SESSION}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    token: action.result.token,
    email: action.result.email,
    error: null,
    placeId: jwtDecode(action.result.token).placeId,
  }),
  [`${USER_PLACE_SESSION}_FAIL`]: (state, action) => ({
    ...initialState,
    status: FAIL,
    error: action.error,
  }),
};

/**
 * userPlaceSession reducer
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
