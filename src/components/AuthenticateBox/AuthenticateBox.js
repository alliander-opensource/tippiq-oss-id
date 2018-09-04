/**
 * Authenticate box component.
 * @module components/AuthenticateBox
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Panel } from 'react-bootstrap';
import styles from './AuthenticateBox.scss';


/**
 * Authenticate box component class.
 * @function AuthenticateBox
 * @param {Object} props Component properties.
 * @param {Object} props.title Title of the box.
 * @param {Array} props.links Array of links to show.
 * @returns {string} Markup of the component.
 */
const AuthenticateBox = ({ title, links, children }) => {
  let linkList = null;
  if (links) {
    const linkItems = links.map(link => (
      <li key={link.id}>
        <Link to={link.to} id={link.id} onClick={link.onClick}>{link.text}</Link>
      </li>
    ));
    const listClass = links.length === 1 ? 'links-single' : '';
    const listClasses = links.length === 1 ? 'text-xs-left text-md-center' : '';

    linkList = (
      <ul
        className={
        `list-links
         ${styles.links}
         ${listClasses}
         ${listClass ? styles[listClass] : null
         }`}
      >
        {linkItems}
      </ul>
    );
  }

  return (
    <div className={styles.box}>
      <Panel header={title} className={styles.panel}>
        {children}
        {linkList}
      </Panel>
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
AuthenticateBox.propTypes = {
  title: PropTypes.string,
  links: PropTypes.array,
  children: PropTypes.object,
};

export default AuthenticateBox;
