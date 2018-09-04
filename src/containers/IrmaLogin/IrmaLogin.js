/**
 * IrmaLogin container.
 * @module containers/IrmaLogin
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QRCode from 'react-qr';
import { IDLE, SUCCESS, FAIL } from '../../constants/status';
import { irmaLogin, generateIrmaLoginRequest } from '../../actions';
import { NotFound } from '../';

import {
  PageTitle,
} from '../../components';


@connect(
  state => ({
    irmaSessionToken: state.irmaLogin.irmaSessionToken,
    irmaSessionTokenStatus: state.irmaLogin.irmaSessionTokenStatus,
    irmaLoginToken: state.irmaLogin.irmaLoginToken,
    irmaPollStatus: state.irmaLogin.irmaPollStatus,
    irmaPollInterval: 1000,
    irmaEnabled: state.appConfig.irmaEnabled,
  }),
  dispatch => bindActionCreators({ irmaLogin, generateIrmaLoginRequest }, dispatch),
)
/**
 * IrmaLogin component class.
 * @class IrmaLogin
 * @extends Component
 */
export default class IrmaLogin extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    irmaLogin: PropTypes.func.isRequired,
    generateIrmaLoginRequest: PropTypes.func.isRequired,
    irmaSessionToken: PropTypes.object,
    irmaLoginToken: PropTypes.object,
    irmaSessionTokenStatus: PropTypes.string,
    irmaPollStatus: PropTypes.string,
    irmaPollInterval: PropTypes.number,
    irmaEnabled: PropTypes.bool,
  }

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    if (__CLIENT__ && this.props.irmaEnabled) {
      this.props.generateIrmaLoginRequest();
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (!this.props.irmaEnabled) {
      return;
    }

    if (nextProps.irmaPollStatus === FAIL ||
      (nextProps.irmaLoginToken && nextProps.irmaLoginToken.token)) {
      this.stopPoll();
    }

    if (nextProps.irmaSessionTokenStatus === SUCCESS && nextProps.irmaPollStatus === IDLE) {
      // We have a session, start polling for login token
      this.startPoll(nextProps);
    }
  }

  /**
   * Check properties and return login message to be displayed
   * @returns Login message JSX
   */
  getLoginMessage = () => {
    if (this.props.irmaSessionTokenStatus === SUCCESS) {
      return <QRCode text={JSON.stringify(this.props.irmaSessionToken.qr)} />;
    }
    return 'Wachten op een QR-code...';
  }

  /**
   * Start polling for an IRMA proof
   * @method startPoll
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  startPoll = nextProps => {
    const pollId = setInterval(nextProps.irmaLogin,
      nextProps.irmaPollInterval, nextProps.irmaSessionToken.token);
    this.setState({ pollId });
  }

  /**
   * Stop polling for an IRMA proof
   * @method stopPoll
   * @returns {undefined}
   */
  stopPoll = () => {
    clearInterval(this.state.pollId);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (!this.props.irmaEnabled) {
      return <NotFound />;
    }

    let loginMessage = '';
    let successMessage = '';
    let errorMessage = '';

    if (this.props.irmaPollStatus === FAIL) {
      errorMessage = 'Inloggen mislukt!';
    } else if (this.props.irmaLoginToken && this.props.irmaLoginToken.token) {
      successMessage = <div id="success-message">Inloggen gelukt! Bearer Token: ${this.props.irmaLoginToken.token}</div>; // `Inloggen gelukt! Bearer Token:\n${this.props.irmaLoginToken.token}`;
    } else {
      loginMessage = this.getLoginMessage();
    }

    return (
      <div id="page-irma-login">
        <Helmet title="Inloggen bij Tippiq" />
        <Grid>
          <Row>
            <Col xs={12}>
              <PageTitle>
                Inloggen bij <span className="text-primary">Tippiq</span>
              </PageTitle>
            </Col>
            <Col xs={12} sm={6} lg={7}>
              <p>
                Laat je bewonersattribuut zien om je huisregels rond het gebruik van&#8203;
                jouw data te beheren.
              </p>
            </Col>
            <Col xs={12} sm={6} lg={7} className="register-form">
              IRMA Login status: <br /><br />
              <div id="login-message">{loginMessage}</div>
              {successMessage}
              <div id="error-message">{errorMessage}</div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
