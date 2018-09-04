/**
 * AppState reducer.
 * @module reducers/AppState
 */
import { APP_MENU_HIDE, APP_MENU_SHOW } from '../constants/ActionTypes';

const initialState = {
  hideMenu: false,
};

const actionsMap = {
  [APP_MENU_HIDE]: () => ({ hideMenu: true }),
  [APP_MENU_SHOW]: () => ({ hideMenu: false }),
};

/**
 * AppState reducer
 * @function
 * @param {Object} state initial state.
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
