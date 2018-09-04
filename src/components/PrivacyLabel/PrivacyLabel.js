/**
 * Privacy label component.
 * @module components/PrivacyLabel
 */

import React from 'react';
import styles from './PrivacyLabel.scss';

/**
 * Privacy label component class.
 * @function PrivacyLabel
 * @returns {string} Markup of the component.
 */
const PrivacyLabel = () =>
  <div className="row">
    <div className={`col-xs-12 text-primary ${styles.logo}`} />
  </div>;

export default PrivacyLabel;
