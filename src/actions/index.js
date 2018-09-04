/**
 * Actions.
 * @module actions
 */

import {
  REGISTER,
  LOGIN,
  LOGOUT, APP_CONFIG,
  GET_PROFILE,
  USER_PLACE_SESSION,
  PASSWORD_SAVE,
  EMAIL_SAVE,
  EMAIL_EXISTS,
  SIMPLE_REGISTRATION,
  PASSWORD_RESET_REQUEST,
  VERIFY_EMAIL_START,
  VERIFY_EMAIL_COMPLETE,
  GET_SERVICE_PROVIDER,
  USER_ATTRIBUTES_LOAD,
  USER_ATTRIBUTE_RESET,
  USER_ATTRIBUTE_CREATE,
  USER_ATTRIBUTE_SAVE,
  QUICK_REGISTRATION,
  DISPLAY_NAME,
  APP_MENU_HIDE,
  APP_MENU_SHOW,
  REQUEST_IRMA_SESSIONTOKEN,
  POLL_IRMA_LOGIN,
  REQUEST_IRMA_ISSUETOKEN,
  POLL_IRMA_ISSUE,
} from '../constants/ActionTypes';

import { setQueryParams } from '../utils/url';
/**
 * Register function.
 * @function register
 * @param {string} email Email address.
 * @param {string} password Password.
 * @returns {Object} Register action.
 */
export function register(email, password) {
  return {
    types: [REGISTER],
    promise: api => api.post('/users/registration', { data: { email, password } }),
  };
}


/**
 * getAppConfig function.
 * @function getAppConfig
 * @returns {Object} getAppConfig.
 */
export function getAppConfig() {
  return {
    types: [APP_CONFIG],
    promise: api => api.get('/app-config'),
  };
}

/**
 * Change password function.
 * @function changePassword
 * @param {string} newPassword New password.
 * @param {string} resetPasswordToken Reset password token (optional).
 * @returns {Object} Change password action.
 */
export function changePassword(newPassword, resetPasswordToken) {
  return {
    types: [PASSWORD_SAVE],
    promise: api => api.post('/users/password', { data: { newPassword, resetPasswordToken } }),
  };
}

/**
 * Change email function.
 * @function changeEmail
 * @param {string} email Email.
 * @returns {Object} Change email action.
 */
export function changeEmail(email) {
  return {
    types: [EMAIL_SAVE],
    payload: { email },
    promise: api => api.post('/users/email', { data: { email } }),
  };
}

/**
 * Check if email exists function.
 * @function checkEmailExists
 * @param {string} email Email.
 * @returns {Object} Change email action.
 */
export function checkEmailExists(email) {
  return {
    types: [EMAIL_EXISTS],
    promise: api => api.post('/users/check-email', { data: { email } }),
  };
}

/**
 * Login function.
 * @function login
 * @param {string} email Email address.
 * @param {string} password Password.
 * @returns {Object} Login action.
 */
export function login(email, password) {
  return {
    types: [LOGIN],
    promise: api => api.post('/users/login', { data: { email, password } }),
  };
}

/**
 * Token login function.
 * @function tokenLogin
 * @param {string} token Login token.
 * @returns {Object} tokenLogin action.
 */
export function tokenLogin(token) {
  return {
    types: [LOGIN],
    promise: api => api.post('/users/login', { data: { token } }),
  };
}

/**
 *
 * @function generateIrmaLoginRequest
 * @returns {Object} Irma login action.
 */
export function generateIrmaLoginRequest() {
  return {
    types: [REQUEST_IRMA_SESSIONTOKEN],
    promise: api => api.get('/irma/generate-login-request'),
  };
}

/**
 *
 * @function generateIrmaIssueRequest
 * @returns {Object} Irma issue action.
 */
export function generateIrmaIssueRequest() {
  return {
    types: [REQUEST_IRMA_ISSUETOKEN],
    promise: api => api.get('/irma/generate-tippiqid-issue-request'),
  };
}

/**
 * Irma login function.
 * @function irmaLogin
 * @param {object} sessionToken Irma session token
 * @returns {Object} Irma login action.
 */
export function irmaLogin(sessionToken) {
  return {
    types: [POLL_IRMA_LOGIN],
    promise: api => api.get(`/irma/generate-login-token/${sessionToken}`),
  };
}

/**
 * Irma issue status function
 * @function irmaIssueStatus
 * @param {object} sessionToken Irma issue session token
 * @returns {Object} Irma login action.
 */
export function irmaIssueStatus(sessionToken) {
  return {
    types: [POLL_IRMA_ISSUE],
    promise: api => api.get(`/irma/tippiqid-issue-status/${sessionToken}`),
  };
}

/**
 * Logout function.
 * @function logout
 * @returns {Object} logout action.
 */
export function logout() {
  return { type: LOGOUT };
}

/**
 * Menu hide function.
 * @function hideAppMenu
 * @returns {Object} hideAppMenu action.
 */
export function hideAppMenu() {
  return { type: APP_MENU_HIDE };
}

/**
 * Menu show function.
 * @function showAppMenu
 * @returns {Object} showAppMenu action.
 */
export function showAppMenu() {
  return { type: APP_MENU_SHOW };
}


/**
 * Get profile function.
 * @function getProfile
 * @returns {Object} Get profile action.
 */
export function getProfile() {
  return {
    types: [GET_PROFILE],
    promise: api => api.get('/users/profile'),
  };
}

/**
 * get UserPlaceSession function.
 * @function getUserPlaceSession
 * @param {string} audience Requested session audience
 * @param {string} placeId Place Id for session
 * @returns {Object} Get session action.
 */
export function getUserPlaceSession(audience = 'id', placeId = '') {
  return {
    types: [USER_PLACE_SESSION],
    promise: api => api.get(setQueryParams('/users/get-session', { audience, place_id: placeId })),
  };
}

/**
 * Get user display name function.
 * @function getUserDisplayName
 * @returns {Object} Get getUserDisplayName action.
 */
export function getUserDisplayName(id) {
  return {
    types: [DISPLAY_NAME],
    promise: api => api.get(`/users/${id}/display-name`),
  };
}

/**
 * simpleRegister function.
 * @function simpleRegister
 * @param {string} email Email address.
 * @returns {Object} simpleRegister action.
 */
export function simpleRegister(email) {
  if (!email) {
    return ({
      type: `${SIMPLE_REGISTRATION}_FAIL`,
      error: { message: 'Email address is mandatory' },
    });
  }
  return {
    types: [SIMPLE_REGISTRATION],
    promise: api => api.post('/users/simple-registration', { data: { email } }),
  };
}

/**
 * Request reset password function.
 * @function requestResetPassword
 * @param {string} email Email address.
 * @param {string} clientId Client id.
 * @param {string} returnParams Return url.
 * @returns {Object} requestResetPassword action.
 */
export function requestResetPassword(email, clientId, returnParams) {
  return {
    types: [PASSWORD_RESET_REQUEST],
    promise: api => api.post('/users/request-reset-password',
      { data: { email, clientId, returnParams } }),
  };
}

/**
 * VerifyEmailStart function.
 * @function verifyEmailStart
 * @returns {Object} VerifyEmailStart action.
 */
export function verifyEmailStart() {
  return {
    types: [VERIFY_EMAIL_START],
    promise: api => api.get('/users/email-verification/start'),
  };
}

/**
 * VerifyEmailComplete function.
 * @function verifyEmailComplete
 * @param {string} token To identify the email verification action with.
 * @returns {Object} VerifyEmailComplete action.
 */
export function verifyEmailComplete(token) {
  return {
    types: [VERIFY_EMAIL_COMPLETE],
    promise: api => api.get('/users/email-verification/complete', { params: { token } }),
  };
}

/**
 * Get service provider function.
 * @function getServiceProvider
 * @param {string} id Service provider id
 * @returns {Object} Get service provider action.
 */
export function getServiceProvider(id) {
  return {
    types: [GET_SERVICE_PROVIDER],
    promise: api => api.get(`/service-provider/${id}`),
  };
}

/**
 * Set password function.
 * @function setPassword
 * @param {string} password New password.
 * @param {string} resetPasswordToken Reset password token.
 * @returns {Object} Change password action.
 */
export function setPassword(password, resetPasswordToken) {
  return {
    types: [PASSWORD_SAVE],
    promise: api => api.post('/users/set-password', { data: { password, resetPasswordToken } }),
  };
}

/**
 * Get user attributes function.
 * @function getUserAttributes
 * @returns {Object} Get user attributes action.
 */
export function getUserAttributes() {
  return {
    types: [USER_ATTRIBUTES_LOAD],
    promise: api => api.get('/attributes'),
  };
}

/**
 * Reset user attribute function.
 * @function resetUserAttribute
 * @returns {Object} Reset user attribute action.
 */
export function resetUserAttribute() {
  return { type: USER_ATTRIBUTE_RESET };
}

/**
 * Create user attribute function.
 * @function createUserAttribute
 * @param {Object} attribute User Attribute data.
 * @returns {Object} Create user attribute action.
 */
export function createUserAttribute(attribute) {
  return {
    types: [USER_ATTRIBUTE_CREATE],
    promise: api => api.post('/attributes', { data: attribute }),
  };
}

/**
 * Save user attribute function.
 * @function saveUserAttribute
 * @param {Object} attribute User attribute.
 * @returns {Object} Save user attribute action.
 */
export function saveUserAttribute(attribute) {
  return {
    types: [USER_ATTRIBUTE_SAVE],
    promise: api => api.put(`/attributes/${attribute.id}`, { data: attribute }),
  };
}

/**
 * Quick register function.
 * @function quickRegister
 * @param {Object} data Register data.
 * @returns {Object} Create user attribute action.
 */
export function quickRegister(data) {
  return {
    types: [QUICK_REGISTRATION],
    promise: api => api.post('/users/quick-registration', {
      data: {
        email: data.email,
        trackingCode: data.trackingCode,
        placeAddress: data.placeAddress,
        placeAddressForEmail: data.placeAddressForEmail,
        policies: data.policies,
        clientId: data.clientId,
      },
    }),
  };
}
