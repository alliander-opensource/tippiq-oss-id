/**
 * NavBar component.
 * @module components/NavBar
 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Nav, Navbar, Dropdown, MenuItem, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { truncate } from 'lodash';

import styles from './NavBar.css';
import tippiqLogo from '../../static/images/account.svg';
import userIcon from '../../static/svgIcons/user.svg';

/**
 * NavBar Container component.
 * @Class NavBar
 * @returns {string} Markup of the component.
 */
export default class NavBarContainer extends Component {
  static propTypes = {
    logout: PropTypes.func,
    loggedIn: PropTypes.bool,
    title: PropTypes.string,
    hideMenu: PropTypes.bool,
  };

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.renderDropdownContent = this.renderDropdownContent.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.renderDropDownItems = this.renderDropDownItems.bind(this);
    this.renderMenuItems = this.renderMenuItems.bind(this);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  /**
   * ComponentWillMount
   * @function componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    if (__CLIENT__) {
      this.updateDimensions();
      window.addEventListener('resize', this.updateDimensions);
    }
  }

  /**
   * ComponentWillUnmount
   * @function componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    if (__CLIENT__) {
      window.removeEventListener('resize', this.updateDimensions);
    }
  }

  /**
   * UpdateDimensions
   * @function UpdateDimensions
   * @returns {undefined}
   */
  updateDimensions() {
    this.setState({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  }

  /**
   * CheckDimensions
   * @function CheckDimensions
   * @returns {undefined}
   */
  checkDimensions() {
    return ({
      width: this.state.width,
      height: this.state.height,
    });
  }

  /**
   * RenderDropdownContent
   * @function renderDropdownContent
   * @returns {string} Markup of the dropdown content.
   */
  renderDropdownContent(visible) {
    const { title } = this.props;

    return (
      <div className={`${styles.contentWrapper}${(!visible) && ' hidden-xs hidden-sm'} `}>
        <div className={styles.buttonTextHolder}>
          <span className={`resident-title ${styles.resident}`}>
            {title && truncate(title, { length: 20, separator: '...' }) }
          </span>
        </div>
      </div>
    );
  }

  /**
   * RenderMenuItems
   * @function renderMenuItems
   * @returns {string} Markup of the menuItems
   */
  renderMenuItems() {
    return (
      <Nav className={[styles.navBarBlock, styles.navBarNavigation]}>
        <LinkContainer to="/mijn-account">
          <NavItem className={styles.navBarItem} eventKey={1}>
            <span className="hidden-sm hidden-xs">Mijn gegevens</span>
            <span className="visible-xs visible-sm"><span className={styles.iconAccount} /></span>
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/mijn-huissleutels">
          <NavItem className={styles.navBarItem} eventKey={2}>
            <span className="hidden-sm hidden-xs">Gekoppelde huizen</span>
            <span className="visible-xs visible-sm"><span className={styles.iconHuis} /></span>
          </NavItem>
        </LinkContainer>
      </Nav>
    );
  }

  /**
   * RenderDropDownItems
   * @function renderDropDownItems
   * @returns {string} Markup of the dropdownItems
   */
  renderDropDownItems() {
    const { logout } = this.props;

    return (
      <Dropdown
        className={styles.navBarDropdown}
        componentClass="li"
        id="basic-nav-dropdown"
      >
        <Dropdown.Toggle className={styles.headerButtonBlock}>
          <div className={styles.horizontal}>
            <img className={styles.houseImage} src={userIcon} alt="Huis" width="32" height="30" />
            {this.renderDropdownContent()}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {(__CLIENT__ && this.checkDimensions().width < 768) &&
            <div className={styles.dropdownContent}>{this.renderDropdownContent(true)}</div>
          }
          <MenuItem eventKey={3} onClick={logout}>Uitloggen</MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  /**
   * Render
   * @function render
   * @returns {string} Markup of component.
   */
  render() {
    const { loggedIn, hideMenu } = this.props;
    return (
      <Navbar inverse className={styles.navBar}>
        <Navbar.Header className={styles.navBarHeader}>
          <Navbar.Brand className={styles.navBarBrand}>
            <Link to="/"><img src={tippiqLogo} alt="Tippiq" className={styles.headerImage} /></Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <div className={styles.navBarBlock}>
          {loggedIn && !hideMenu && this.renderDropDownItems()}
        </div>
        {loggedIn && !hideMenu && this.renderMenuItems()}
      </Navbar>
    );
  }
}
