/**
 * Footer component.
 * @module components/Footer
 */

import React from 'react';
import { Navbar, Dropdown, MenuItem } from 'react-bootstrap';
import styles from './Footer.css';

/**
 * Footer component class.
 * @function Footer
 * @returns {string} Markup of the component.
 */
const Footer = () =>
  <div className={`container-fluid footer ${styles.footer}`}>
    <div className="hidden-xs">
      <a href="https://www.tippiq.nl/over-tippiq" target="_blank" rel="noopener noreferrer" className={styles.link}>Over Tippiq Huis</a>
      <a href="https://www.tippiq.nl/diensten" target="_blank" rel="noopener noreferrer" className={styles.link}>Diensten</a>
      <a href="https://www.tippiq.nl/privacy-disclaimer" target="_blank" rel="noopener noreferrer" className={styles.link}>Privacy &amp; Disclaimer</a>
      <a href="https://www.tippiq.nl/contact" target="_blank" rel="noopener noreferrer" className={styles.link}>Contact</a>
    </div>

    <div className={styles.socialLinks}>
      <a href="https://www.facebook.com/Tippiq-1430219107214646" className={styles.social}><i className="fa fa-facebook" /></a>
      <a href="https://twitter.com/tippiq" className={styles.social}><i className="fa fa-twitter" /></a>
    </div>
    <div className={styles.copyright}>Copyright &copy; 2017 Alliander N.V.</div>

    <Navbar className={`visible-xs ${styles.footerMenu}`}>
      <div className="nav navbar-nav">
        <Dropdown
          className="visible-xs"
          componentClass="li"
          id="footer"
        >
          <Dropdown.Toggle
            onClick={() => (setTimeout(() => (window.scrollTo(0, document.body.scrollHeight)), 0))}
            useAnchor
          >
            Meer over Tippiq
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem eventKey="5.1" href="https://www.tippiq.nl/over-tippiq">Over Tippiq Huis</MenuItem>
            <MenuItem eventKey="5.2" href="https://www.tippiq.nl/diensten">Diensten</MenuItem>
            <MenuItem eventKey="5.3" href="https://www.tippiq.nl/privacy-disclaimer">Privacy &amp; Disclaimer</MenuItem>
            <MenuItem eventKey="5.4" href="https://www.tippiq.nl/contact">Contact</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  </div>;

export default Footer;
