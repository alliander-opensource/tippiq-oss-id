/**
 * Cookie wall.
 * @module components/CookieWall
 */

import React, { PropTypes } from 'react';
import styles from './CookieWall.css';

/**
 * CookieWallComponent
 * @function CookieWallComponent
 * @param {Function} props.action Set Cookie.
 * @param {string} props.privacyUrl Url to privacy statement.
 * @returns {string} Markup of the not found page.
 */
const CookieWallComponent = ({ action, privacyUrl }) =>
  <div className={styles.cookieWrapper}>
    <p className={styles.text}>Tippiq gebruikt Cookies.
      { ' ' }
      <a
        href={privacyUrl}
        rel="noopener noreferrer"
        target="_blank"
        className={styles.highLight}
      >
         Lees hier waarom.
      </a>
      { ' ' }
      Als je doorgaat, accepteer je het gebruik van deze cookies.
    </p>
    <button id="btnAgree" className={styles.button} onClick={action}>Ik ga akkoord</button>
  </div>;

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
CookieWallComponent.propTypes = {
  action: PropTypes.func.isRequired,
  privacyUrl: PropTypes.string.isRequired,
};

export default CookieWallComponent;
