/**
 * Logout container.
 * @module containers/Logout
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import { logout } from '../../actions';

@connect(
  state => ({
    loggedIn: state.login.token,
  }),
  dispatch => bindActionCreators({ logout }, dispatch),
)
/**
 * Logout component class.
 * @class Logout
 * @extends Component
 */
export default class Logout extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    logout: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool,
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.logout();
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (!nextProps.loggedIn) {
      browserHistory.push('/');
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (<div id="page-logout" />);
  }
}
