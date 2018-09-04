/**
 * Account container.
 * @module containers/Account
 */

import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { Grid, Row, Col } from 'react-bootstrap';

import { getAppConfig } from '../../actions';
import { AccountMenu } from '../../components';
import styles from './Account.scss';

/**
 * This class defines the Account container.
 * @function Account
 * @param {Object} props Component properties.
 * @param {Object} props.children Child nodes.
 * @returns {string} Markup for the component.
 */
export const Account = ({ children }) =>
  <div className={styles.container}>
    <Helmet title="Mijn Account" />
    <Grid>
      <Row>
        <Col xs={12} sm={3}>
          <AccountMenu />
        </Col>
        <Col xs={12} sm={9} className={styles.mainContent}>
          {children}
        </Col>
      </Row>
    </Grid>
  </div>;

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Account.propTypes = {
  children: PropTypes.object.isRequired,
};

export default
asyncConnect([{
  key: 'appConfig',
  promise: ({ store: { dispatch } }) => dispatch(getAppConfig()),
}])(Account);
