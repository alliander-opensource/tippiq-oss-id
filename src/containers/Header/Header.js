/**
 * Header container.
 * @module containers/Header
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import {
  getUserDisplayName,
  logout,
} from '../../actions';
import { NavBar } from '../../components';
import { SUCCESS } from '../../constants/status';

@connect(
  state => ({
    displayName: state.displayName.result,
    hideMenu: state.appState.hideMenu,
    login: state.login,
  }),
  dispatch => bindActionCreators({
    getUserDisplayName,
    logout,
  }, dispatch),
  null,
  { pure: false },
)

/**
 * Header container.
 * @class Header
 */
export default class Header extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    displayName: PropTypes.string,
    login: PropTypes.object.isRequired,
    getUserDisplayName: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    hideMenu: PropTypes.bool,
  }

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  /**
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.props.login.id && !this.props.displayName) {
      this.props.getUserDisplayName(this.props.login.id);
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.login.status === SUCCESS && this.props.login.status !== SUCCESS) {
      this.props.getUserDisplayName(nextProps.login.id);
    }
  }

  /**
   * Logout
   * @method logout
   * @returns {undefined}
   */
  logout() {
    this.props.logout();
    browserHistory.push('/');
  }

  /**
   * render
   * @function render
   * @returns {string} Markup of the component.
   */
  render() {
    const { login, displayName, hideMenu } = this.props;
    return (
      <NavBar
        loggedIn={!!login.token}
        title={displayName}
        logout={this.logout}
        hideMenu={hideMenu}
      />
    );
  }
}
