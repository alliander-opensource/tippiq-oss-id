/**
 * Root reducer.
 * @module reducers/root
 */

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import appConfig from './appConfig';
import appState from './appState';
import emailExists from './emailExists';
import emailVerification from './emailVerification';
import irmaLogin from './irma-login';
import irmaIssue from './irma-issue';
import login from './login';
import password from './password';
import passwordResetRequest from './passwordResetRequest';
import profile from './profile';
import quickRegistration from './quick-registration';
import registration from './registration';
import serviceProvider from './serviceProvider';
import simpleRegistration from './simple-registration';
import userPlaceSession from './userPlaceSession';
import userAttributes from './userAttributes';
import userAttribute from './userAttribute';
import displayName from './displayName';

/**
 * Root reducer.
 * @function
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default combineReducers({
  reduxAsyncConnect,
  routing: routerReducer,
  appConfig,
  appState,
  emailExists,
  emailVerification,
  form,
  login,
  irmaLogin,
  irmaIssue,
  password,
  passwordResetRequest,
  profile,
  quickRegistration,
  registration,
  serviceProvider,
  simpleRegistration,
  userPlaceSession,
  userAttributes,
  userAttribute,
  displayName,
});

