/**
 * irmaIssue reducer.
 * @module reducers/irmaIssue
 */
import { REQUEST_IRMA_ISSUETOKEN, POLL_IRMA_ISSUE } from '../constants/ActionTypes';
import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';

const initialState = {
  irmaIssueTokenStatus: IDLE,
  irmaPollStatus: IDLE,
  irmaIssueToken: null,
  irmaIssueState: null,
  irmaError: null,
};

const actionsMap = {
  [`${REQUEST_IRMA_ISSUETOKEN}_PENDING`]: state => ({
    ...state,
    irmaIssueTokenStatus: PENDING,
  }),
  [`${REQUEST_IRMA_ISSUETOKEN}_SUCCESS`]: (state, action) => ({
    ...state,
    irmaIssueTokenStatus: SUCCESS,
    irmaIssueToken: action.result,
  }),
  [`${REQUEST_IRMA_ISSUETOKEN}_FAIL`]: (state, action) => ({
    ...state,
    irmaIssueTokenStatus: FAIL,
    irmaError: action.error,
  }),
  [`${POLL_IRMA_ISSUE}_PENDING`]: state => ({
    ...state,
    irmaPollStatus: PENDING,
  }),
  [`${POLL_IRMA_ISSUE}_SUCCESS`]: (state, action) => ({
    ...state,
    irmaPollStatus: SUCCESS,
    irmaIssueState: action.result,
  }),
  [`${POLL_IRMA_ISSUE}_FAIL`]: (state, action) => ({
    ...state,
    irmaPollStatus: FAIL,
    irmaError: action.error,
  }),
};

/**
 * irmaIssue reducer
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
