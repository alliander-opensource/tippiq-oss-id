/**
 * Email verification reducer.
 * @module reducers/emailVerification
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { VERIFY_EMAIL_START, VERIFY_EMAIL_COMPLETE } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  emailVerifiedToken: null,
  started: false,
  complete: false,
  error: null,
};

/**
 * Translate error
 * @function translateError
 * @param {Object} error Error object
 * @returns {Object} Translated error.
 */
function translateError(error) {
  const mapErrors = {
    'Validatiefout: ongeldig token.': 'Ongeldig token, vraag e-mail verificatie opnieuw aan.',
    'Email is already verified.': 'Je email adres is al geverifieerd',
  };
  return { ...error, message: mapErrors[error.message] || error.message };
}

const actionsMap = {
  [`${VERIFY_EMAIL_START}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    started: false,
    complete: false,
    error: null,
  }),
  [`${VERIFY_EMAIL_START}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    started: action.result.success,
    error: null,
  }),
  [`${VERIFY_EMAIL_START}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    started: false,
    error: action.error,
  }),
  [`${VERIFY_EMAIL_COMPLETE}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    complete: false,
    error: null,
  }),
  [`${VERIFY_EMAIL_COMPLETE}_SUCCESS`]: (state, action) => ({
    ...state,
    status: SUCCESS,
    complete: action.result.success,
    emailVerifiedToken: action.result.emailVerifiedToken,
    error: null,
  }),
  [`${VERIFY_EMAIL_COMPLETE}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    complete: false,
    error: translateError(action.error),
  }),
};

/**
 * emailVerification reducer
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
