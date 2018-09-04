/**
 * AccountMenu component.
 * @module components/AccountMenu
 */

import React from 'react';
import { MenuItem, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * AccountMenu component class.
 * @function AccountMenu
 * @returns {string} Markup of the component.
 */
const AccountMenu = () =>
  <div>
    <Nav stacked className="hidden-xs">
      <LinkContainer to="/mijn-account/naam">
        <NavItem eventKey={1.1}>Naam</NavItem>
      </LinkContainer>
      <LinkContainer to="/mijn-account/email">
        <NavItem eventKey={1.2}>E-mailadres</NavItem>
      </LinkContainer>
      <LinkContainer to="/mijn-account/wachtwoord">
        <NavItem eventKey={1.3}>Wachtwoord</NavItem>
      </LinkContainer>
    </Nav>

    <NavDropdown
      className="visible-xs nav-dropdown"
      componentClass="li"
      title="Mijn Account"
      id="account-nav-dropdown"
    >
      <LinkContainer to="/mijn-account/naam">
        <MenuItem eventKey={1.1}>Naam</MenuItem>
      </LinkContainer>
      <LinkContainer to="/mijn-account/email">
        <MenuItem eventKey={1.2}>E-mailadres</MenuItem>
      </LinkContainer>
      <LinkContainer to="/mijn-account/wachtwoord">
        <MenuItem eventKey={1.3}>Wachtwoord</MenuItem>
      </LinkContainer>
    </NavDropdown>
  </div>;

export default AccountMenu;
