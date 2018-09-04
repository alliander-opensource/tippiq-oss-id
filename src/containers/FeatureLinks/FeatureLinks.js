/**
 * FeatureLinks container.
 * @module components/FeatureLinks
 */

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

/**
 * FeatureLinks component.
 * @function FeatureLinks
 * @returns {string} Markup of the feature links page.
 */
const FeatureLinks = () => (
  <div id="page-feature-links">
    <Helmet title="Feature links" />
    <div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h1>Feature links</h1>
            <div className="list-group">
              <Link className="list-group-item" to="/styleguide">Styleguide</Link>
              <Link className="list-group-item" to="/start">Start</Link>
              <Link className="list-group-item" to="/registreren">Register</Link>
              <Link className="list-group-item" to="/login">Login</Link>
              <Link className="list-group-item" to="/get-session">Get session</Link>
              <Link className="list-group-item" to="/wachtwoord-vergeten">Reset password</Link>
              <Link className="list-group-item" to="/email-bevestigd">
                Verify email complete
              </Link>
              <Link className="list-group-item" to="/selecteer-je-huis">Select Place Key</Link>
              <Link className="list-group-item" to="/mijn-account">Mijn account</Link>
              <Link className="list-group-item" to="/mijn-huissleutels">Mijn huissleutels</Link>
              <Link className="list-group-item" to="/irma-login">IRMA login</Link>
              <Link className="list-group-item" to="/irma-issue">IRMA issue attributes</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FeatureLinks;
