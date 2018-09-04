/**
 * QuickRegistration container.
 * @module containers/QuickRegistration
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';

import { Spinner } from '../../components';
import { SUCCESS, FAIL } from '../../constants/status';
import { tokenLogin, logout, quickRegister } from '../../actions';
import { setQueryParams } from '../../utils/url';
import redirect from '../../utils/redirect';

@connect(
  state => ({
    quickRegistration: state.quickRegistration,
  }),
  dispatch => bindActionCreators({
    tokenLogin,
    logout,
    quickRegister,
  }, dispatch),
)
/**
 * QuickRegistration container class.
 * @class QuickRegistration
 * @extends Component
 */
export default class QuickRegistration extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.object,
    tokenLogin: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    quickRegistration: PropTypes.object,
    quickRegister: PropTypes.func.isRequired,
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { email, trackingCode, placeAddress, placeAddressForEmail, policies, clientId }
      = this.props.location.query;
    this.props.logout();
    this.props.quickRegister({
      email,
      trackingCode,
      placeAddressForEmail: decodeURIComponent(placeAddressForEmail),
      placeAddress: JSON.parse(decodeURIComponent(placeAddress)),
      policies: JSON.parse(decodeURIComponent(policies)),
      clientId: decodeURIComponent(clientId),
    });
  }


  /**
   * componentWillReceiveProps
   * @param {Object} nextProps The next props
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.quickRegistration.status === SUCCESS) {
      setTimeout(() => {
        this.props.tokenLogin(nextProps.quickRegistration.idToken);
        const returnUrl = setQueryParams(nextProps.location.query.redirect_uri, {
          token: nextProps.quickRegistration.hoodToken,
          accessToken: nextProps.quickRegistration.accessToken,
        });
        const clientId = get(nextProps, 'location.query.clientId');
        redirect(returnUrl, clientId);
      }, 13000);
    }
    if (nextProps.quickRegistration.status === FAIL
      && nextProps.quickRegistration.error.emailAddress) {
      const parser = document.createElement('a');
      parser.href = nextProps.location.query.redirect_uri;
      const redirectUri = encodeURIComponent(`${parser.protocol}//${parser.host}/mijn-buurt`);
      browserHistory.push({
        pathname: '/login',
        query: {
          redirect_uri: `/selecteer-je-huis?audience=hood&redirect_uri=${redirectUri}`,
          email: nextProps.quickRegistration.error.emailAddress,
        },
      });
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div id="page-quick-registration">
        <Helmet title="Snelle registratie" />
        <Spinner type={'house'} />
      </div>);
  }
}
