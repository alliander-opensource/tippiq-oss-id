/**
 * CookieWall container.
 * @module containers/CookieWall
 */

import React, { Component, PropTypes } from 'react';
import cookie from 'react-cookie';
import { asyncConnect } from 'redux-connect';

import { getAppConfig } from '../../actions';
import { CookieWall as CookieWallComponent } from '../../components';

/**
 * CookieWall class.
 * @class CookieWall
 * @extends Component
 */
export class CookieWall extends Component {
  static propTypes = {
    appConfig: PropTypes.shape({
      privacyUrl: PropTypes.string.isRequired,
    }),
  };

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.state = {
      cookieWallVisible: true,
    };
    this.shouldShowCookieWall = this.shouldShowCookieWall.bind(this);
    this.setCookie = this.setCookie.bind(this);
  }

  /**
   * SetCookie
   * @function setCookie
   * @returns {undefined}
   */
  setCookie() {
    if (__CLIENT__) {
      this.setState({
        cookieWallVisible: false,
      }, () => {
        const date = new Date();
        const domain = window.location.hostname === 'localhost' ? window.location.hostname :
          `${window.location.hostname.substring(
            window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1)
            .split(':')[0]}`;
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); // one year
        cookie.save('viewed_cookie_policy', 'yes',
          {
            expires: date,
            domain,
          });
      });
    }
  }

  /**
   * ShouldShowCookieWall
   * @function shouldShowCookieWall
   * @returns true or false bool
   */
  shouldShowCookieWall() {
    return typeof (cookie.load('viewed_cookie_policy')) === 'undefined';
  }

  /**
   * Render
   * @function render
   * @returns the rendered elements
   */
  render() {
    const { appConfig } = this.props;
    return (
      this.shouldShowCookieWall() &&
      this.state.cookieWallVisible &&
      appConfig &&
      appConfig.privacyUrl &&
      (
        <CookieWallComponent action={this.setCookie} privacyUrl={appConfig.privacyUrl} />
      )
    );
  }
}

export default asyncConnect(
  [{
    promise: ({ store: { dispatch } }) => dispatch(getAppConfig()),
  }],
  state => ({
    appConfig: state.appConfig,
  })
)(CookieWall);
