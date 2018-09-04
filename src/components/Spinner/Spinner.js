/**
 * Spinner component.
 * @module components/Spinner
 */

import React, { PropTypes } from 'react';
import styles from './Spinner.scss';
import house from '../../static/images/buildhouse.gif';

/**
 * Spinner component class.
 * @function Spinner
 * @returns {string} Markup of the component.
 */
const Spinner = ({ type }) => {
  if (type === 'house') {
    return (
      <div className={styles.animationWrapper}>
        <img src={house} className={styles.house} alt="huis" />
      </div>
    );
  }
  return (
    <svg
      className={styles.spinner}
      width="30px"
      height="30px"
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={styles.path}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      />
    </svg>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Spinner.propTypes = {
  type: PropTypes.string,
};
export default Spinner;
