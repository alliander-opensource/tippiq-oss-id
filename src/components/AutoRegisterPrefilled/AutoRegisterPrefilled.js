/**
 * Auto register prefilled component.
 * @module components/AutoRegisterPrefilled
 */

import React, { PropTypes } from 'react';

import { AuthenticateBox } from '../index';
import styles from './AutoRegisterPrefilled.scss';

/**
 * Auto register prefilled form component.
 * @class AutoRegisterPrefilled
 * @extends Component
 */

const AutoRegisterPrefilled = ({ email, redirectUri, loginUrl, registerUrl, onRegisterClick }) => {
  const links = [{
    id: 'loginLink',
    to: loginUrl,
    text: 'Inloggen met een ander account',
  }, {
    id: 'registerLink',
    to: registerUrl,
    text: 'Nieuw account aanmaken',
    onClick: onRegisterClick,
  }];

  return (
    <AuthenticateBox title="Je bent al ingelogd" links={links}>
      <div>
        <p>Je bent ingelogd met:<br />
          <strong id="email" className={styles.emailLabel}>{email}</strong></p>
        <p>
          <a
            className="btn btn-primary btn-block"
            href={decodeURIComponent(redirectUri)}
          >Doorgaan</a>
        </p>
      </div>
    </AuthenticateBox>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
AutoRegisterPrefilled.propTypes = {
  email: PropTypes.string.isRequired,
  redirectUri: PropTypes.string,
  loginUrl: PropTypes.string.isRequired,
  registerUrl: PropTypes.string.isRequired,
  onRegisterClick: PropTypes.func,
};

export default AutoRegisterPrefilled;
