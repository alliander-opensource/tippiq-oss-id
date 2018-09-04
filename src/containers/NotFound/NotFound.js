/**
 * Not found container.
 * @module components/NotFound
 */

import React from 'react';
import Helmet from 'react-helmet';

/**
 * Not found function.
 * @function NotFound
 * @returns {string} Markup of the not found page.
 */
const NotFound = () =>
  <div className="container">
    <Helmet title="Deze pagina kon niet worden gevonden" />
    <h1>Sorry!</h1>
    <p>De opgevraagde pagina kon niet worden gevonden.</p>
  </div>;

export default NotFound;
