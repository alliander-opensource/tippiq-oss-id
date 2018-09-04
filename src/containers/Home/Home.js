/**
 * Home container.
 * @module components/Home
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';

import { getUserPlaceSession } from '../../actions';
import { IDLE, PENDING, SUCCESS, FAIL } from '../../constants/status';

@connect(
  state => ({
    appConfig: state.appConfig,
    user: state.userPlaceSession,
  }),
  dispatch => bindActionCreators({
    getUserPlaceSession,
  }, dispatch),
  null,
  { pure: false },
)
/**
 * Home class.
 * @class Home
 */
export default class Home extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    appConfig: PropTypes.shape({
      landingBaseUrl: PropTypes.string,
    }),
    user: PropTypes.shape({
      token: PropTypes.string,
      status: PropTypes.string,
    }),
    getUserPlaceSession: PropTypes.func.isRequired,
    location: PropTypes.object,
  };

  /**
   * On component will mount
   * @function componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    if (!this.props.user.token) {
      this.props.getUserPlaceSession();
    } else {
      this.redirect(true);
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.user.status === IDLE || this.props.user.status === PENDING) {
      if (nextProps.user.status === SUCCESS) {
        this.redirect(true);
      }
      if (nextProps.user.status === FAIL) {
        this.redirect(false, get(nextProps, 'location.query.redirect_uri'));
      }
    }
  }

  /**
   * Redirect method
   * @method redirect
   * @param {boolean} session True if session available
   * @param {string} redirectUri Redirect URI
   */
  redirect(session, redirectUri) {
    const { landingBaseUrl } = this.props.appConfig;
    if (session) {
      browserHistory.push('/mijn-account/naam');
    } else if (redirectUri) {
      browserHistory.push({
        pathname: '/login',
        query: { redirect_uri: redirectUri },
      });
    } else {
      window.location = landingBaseUrl;
    }
  }

  /**
   * render.
   * @function render
   * @returns {string} Markup of the component.
   */
  render() {
    return (
      <div id="page-home">
        <Helmet title="Home" />
        <h1>Een moment geduld aub</h1>
        <p>Je wordt doorgeleid.</p>
      </div>
    );
  }
}
