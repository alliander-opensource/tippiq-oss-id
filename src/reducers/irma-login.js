/**
 * irmaLogin reducer.
 * @module reducers/irmaLogin
 */
import { REQUEST_IRMA_SESSIONTOKEN, POLL_IRMA_LOGIN } from '../constants/ActionTypes';
import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';

const initialState = {
  irmaSessionTokenStatus: IDLE,
  irmaPollStatus: IDLE,
  irmaSessionToken: null,
  irmaLoginToken: null,
  irmaError: null,
};

const actionsMap = {
  [`${REQUEST_IRMA_SESSIONTOKEN}_PENDING`]: state => ({
    ...state,
    irmaSessionTokenStatus: PENDING,
  }),
  [`${REQUEST_IRMA_SESSIONTOKEN}_SUCCESS`]: (state, action) => ({
    ...state,
    irmaSessionTokenStatus: SUCCESS,
    irmaSessionToken: action.result,
  }),
  [`${REQUEST_IRMA_SESSIONTOKEN}_FAIL`]: (state, action) => ({
    ...state,
    irmaSessionTokenStatus: FAIL,
    irmaError: action.error,
  }),
  [`${POLL_IRMA_LOGIN}_PENDING`]: state => ({
    ...state,
    irmaPollStatus: PENDING,
  }),
  [`${POLL_IRMA_LOGIN}_SUCCESS`]: (state, action) => ({
    ...state,
    irmaPollStatus: SUCCESS,
    irmaLoginToken: action.result,
  }),
  [`${POLL_IRMA_LOGIN}_FAIL`]: (state, action) => ({
    ...state,
    irmaPollStatus: FAIL,
    irmaError: action.error,
  }),
};

/**
 * irmaLogin reducer
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
