/**
 * IrmaIssue container.
 * @module containers/IrmaIssue
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QRCode from 'react-qr';
import { IDLE, SUCCESS, FAIL } from '../../constants/status';
import { irmaIssueStatus, generateIrmaIssueRequest } from '../../actions';
import { NotFound } from '../';

import {
  PageTitle,
} from '../../components';

@connect(
  state => ({
    irmaIssueToken: state.irmaIssue.irmaIssueToken,
    irmaIssueTokenStatus: state.irmaIssue.irmaIssueTokenStatus,
    irmaIssueState: state.irmaIssue.irmaIssueState,
    irmaPollStatus: state.irmaIssue.irmaPollStatus,
    irmaPollInterval: 1000,
    irmaEnabled: state.appConfig.irmaEnabled,
  }),
  dispatch => bindActionCreators({ irmaIssueStatus, generateIrmaIssueRequest }, dispatch),
)
/**
 * IrmaIssue component class.
 * @class IrmaIssue
 * @extends Component
 */
export default class IrmaIssue extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    irmaIssueStatus: PropTypes.func.isRequired,
    generateIrmaIssueRequest: PropTypes.func.isRequired,
    irmaIssueToken: PropTypes.object,
    irmaIssueState: PropTypes.object,
    irmaIssueTokenStatus: PropTypes.string,
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
      this.props.generateIrmaIssueRequest();
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
      (nextProps.irmaIssueState && nextProps.irmaIssueState.status !== null)) {
      this.stopPoll();
    }

    if (nextProps.irmaIssueTokenStatus === SUCCESS && nextProps.irmaPollStatus === IDLE) {
      // We have a session, start polling for login token
      this.startPoll(nextProps);
    }
  }

  /**
   * Check properties and return issue message to be displayed
   * @returns Issue message JSX
   */
  getIssueMessage = () => {
    if (this.props.irmaIssueTokenStatus === SUCCESS) {
      return <QRCode text={JSON.stringify(this.props.irmaIssueToken.qr)} />;
    }
    return 'Wachten op een QR code...';
  }

  /**
   * Start polling for an IRMA proof
   * @method startPoll
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  startPoll = nextProps => {
    const pollId = setInterval(nextProps.irmaIssueStatus,
      nextProps.irmaPollInterval, nextProps.irmaIssueToken.token);
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

    let issueMessage = '';
    let successMessage = '';
    let errorMessage = '';

    if (this.props.irmaPollStatus === FAIL) {
      errorMessage = 'Attributen uitgeven mislukt!';
    } else if (this.props.irmaIssueState && this.props.irmaIssueState.status === 'DONE') {
      successMessage = <div id="success-message">Attributen succesvol uitgegeven!</div>;
    } else if (this.props.irmaIssueTokenStatus === FAIL) {
      errorMessage =
        'Kon geen QR-code ontvangen. Ben je wel ingelogd en is je e-mailadres al geverifieerd?';
    } else {
      issueMessage = this.getIssueMessage();
    }

    return (
      <div id="page-irma-issue">
        <Helmet title="Bewonersattribuut uitgeven" />
        <Grid>
          <Row>
            <Col xs={12}>
              <PageTitle>
                IRMA bij <span className="text-primary">Tippiq</span>
              </PageTitle>
            </Col>
            <Col xs={12} sm={6} lg={7}>
              <p>
                Scan de QR-code om je eigen bewonersattributen te ontvangen.
              </p>
            </Col>
            <Col xs={12} sm={6} lg={5} className="register-form">
              IRMA issue status: <br /><br />
              <div id="issue-message">{issueMessage}</div>
              {successMessage}
              <div id="error-message">{errorMessage}</div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
