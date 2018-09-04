/**
 * Page title component.
 * @module components/PageTitle
 */

import React, { PropTypes } from 'react';
import { omitBy, isNil } from 'lodash';
import styles from './PageTitle.scss';
/**
 * Privacy label component class.
 * @function PageTitle
 * @returns {string} Markup of the component.
 */
const PageTitle = ({ children, id }) =>
  <h1 className={styles.title} {...omitBy({ id }, isNil)}>
    {children}
  </h1>;

PageTitle.propTypes = {
  children: PropTypes.any.isRequired,
  id: PropTypes.string,
};

export default PageTitle;
