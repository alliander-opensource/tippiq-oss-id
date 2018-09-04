/**
 * Routes.
 * @module routes
 */

import React from 'react';
import { IndexRedirect, IndexRoute, Route } from 'react-router';
import isMobile from 'ismobilejs';

import {
  Account,
  App,
  Home,
  ChangeEmail,
  ChangePassword,
  ChangeUserName,
  RequestResetPassword,
  ResetPassword,
  GetSession,
  FeatureLinks,
  Login,
  IrmaLogin,
  IrmaIssue,
  Logout,
  NotFound,
  Register,
  SetPassword,
  SetupPasswordAndName,
  Start,
  Styleguide,
  VerifyEmailComplete,
  PlaceKeys,
  SavePlaceKey,
  PlaceKeysSelect,
  QuickRegistration,
} from './containers';
import { getUserToken, isUserTokenValid } from './helpers';

/**
 * Check if user has auth token
 * @function requireAuth
 * @returns {undefined}
 */
function requireAuth(nextState, replace) {
  if (__CLIENT__) {
    const token = getUserToken();
    if (!token || !isUserTokenValid(token)) {
      replace({
        pathname: token ? '/logout' : '/login',
        state: { nextPathname: nextState.location.pathname + nextState.location.search },
      });
    }
  }
}

const onChange = (prevState, nextState, replace) => requireAuth(nextState, replace);

/**
 * Routes function.
 * @function
 * @returns {Object} Routes.
 */
export default () => (
  <Route
    path="/"
    component={App}
    onChange={(prevState, nextState) => {
      if (isMobile.any && nextState.location.action === 'PUSH') {
        setTimeout(() => (window.scrollTo(0, 0)), 0);
      }
    }}
  >
    <IndexRoute component={Home} />

    { /* Login enforced */ }
    <Route path="mijn-account" component={Account} onEnter={requireAuth} onChange={onChange}>
      <IndexRedirect to="naam" />
      <Route path="naam" component={ChangeUserName} />
      <Route path="email" component={ChangeEmail} />
      <Route path="wachtwoord" component={ChangePassword} />
    </Route>
    <Route
      path="mijn-huissleutels" component={PlaceKeys} onEnter={requireAuth}
      onChange={onChange}
    />
    <Route
      path="selecteer-je-huis" component={PlaceKeysSelect} onEnter={requireAuth}
      onChange={onChange}
    />
    <Route
      path="huissleutel-opslaan" component={SavePlaceKey} onEnter={requireAuth}
      onChange={onChange}
    />

    { /* Login needed, but not enforced */ }
    <Route path="logout" component={Logout} />
    <Route path="get-session" component={GetSession} />

    { /* Login not required */ }
    <Route path="start" component={Start} />
    <Route path="registreren" component={Register} />
    <Route path="login" component={Login} />
    <Route path="snelle-registratie" component={QuickRegistration} />
    <Route path="wachtwoord-vergeten" component={RequestResetPassword} />

    { /* Token in querystring required */ }
    <Route path="wachtwoord-instellen" component={SetPassword} />
    <Route path="email-bevestigd" component={VerifyEmailComplete} />
    <Route path="voltooi-account" component={SetupPasswordAndName} />
    <Route path="nieuw-wachtwoord-instellen" component={ResetPassword} />

    { /* IRMA */ }
    <Route path="irma-login" component={IrmaLogin} />
    <Route path="irma-issue" component={IrmaIssue} />

    { /* Dev */ }
    <Route path="feature-links" component={FeatureLinks} />
    <Route path="styleguide" component={Styleguide} />

    { /* Other */ }
    <Route path="*" component={NotFound} status={404} />
  </Route>
);
