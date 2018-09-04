/**
 * App container.
 * @module containers/App
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { getAppConfig } from '../../actions';

import constants from '../../constants/app';
import { Footer } from '../../components';
import { Header, CookieWall } from '../../containers';

import styles from './App.scss';

/**
 * Application container class.
 * @class Application
 * @extends Component
 */
export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    appConfig: PropTypes.object.isRequired,
    location: PropTypes.object,
    router: PropTypes.object,
  };

  /* eslint-disable complexity */
  /**
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { location, router } = this.props;
    if (location && router) {
      const query = location.query;
      if (query.token || query.accessToken || query.placeToken || query.trackingCode) {
        delete query.token;
        delete query.accessToken;
        delete query.placeToken;
        delete query.trackingCode;
        router.replace({ pathname: location.pathname, query });
      }
    }
  }
  /* eslint-enable complexity */

  /**
   * Render
   * @function render
   * @returns the rendered elements
   */
  render() {
    const { children } = this.props;
    return (
      <div>
        <Helmet {...constants.head} />
        <CookieWall />
        <Header />
        <div className="content-wrapper">
          <div className={`container ${styles.content}`}>
            {children}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default asyncConnect([{
  key: 'appConfig',
  promise: ({ store: { dispatch } }) => dispatch(getAppConfig()),
}])(App);
