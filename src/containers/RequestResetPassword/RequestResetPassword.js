/**
 * Request reset password container.
 * @module containers/RequestResetPassword
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getQueryParam } from '../../utils/url';
import { RequestResetPasswordForm, PageTitle } from '../../components';
import { requestResetPassword } from '../../actions';
import MailBoxIcon from '../../static/images/mailbox.svg';

import styles from './RequestResetPassword.scss';

@connect(
  state => ({ passwordResetRequest: state.passwordResetRequest }),
  dispatch => bindActionCreators({ requestResetPassword }, dispatch),
)
/**
 * Request reset password component class.
 * @class RequestResetPassword
 * @extends Component
 */
export default class RequestResetPassword extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    requestResetPassword: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    passwordResetRequest: PropTypes.object.isRequired,
  }

  /**
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit = (data) => {
    const { returnParams } = this.props.location.query;
    const clientId = getQueryParam(`?${decodeURIComponent(returnParams)}`, 'clientId') || null;
    this.props.requestResetPassword(data.email, clientId, returnParams);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { email } = this.props.location.query;
    const { passwordResetRequest } = this.props;
    const errorMessage = passwordResetRequest.error ? passwordResetRequest.error.message : null;
    const successView = passwordResetRequest.success ? (
      <Grid>
        <Row>
          <PageTitle>
            <Col xs={1} className={styles.icon}>
              <img src={MailBoxIcon} alt="mailboxicon" />
            </Col>
            <Col xs={6} className={styles.title}>
              <span id="successMessage" className="text-primary">Gelukt!</span><br />Check je mail.
            </Col>
          </PageTitle>
        </Row>
        <Row>
          <Col xs={12}>
            <br />
            <p>
              We hebben je een e-mail gestuurd waarmee je jouw wachtwoord kan wijzigen.<br />
              Je kunt deze pagina sluiten.
            </p>
          </Col>
        </Row>
      </Grid>) : null;

    return (
      <div id="page-request-reset-password">
        <Helmet title="Wachtwoord vergeten" />
        { successView ||
          <Grid>
            <Row>
              <Col xs={12}>
                <PageTitle>
                  <span className="text-primary">Wachtwoord</span> vergeten
                </PageTitle>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p>
                  Vul je e-mailadres in om een nieuw wachtwoord aan te vragen.
                </p>
                <br />
              </Col>
            </Row>
            <Row>
              <RequestResetPasswordForm
                initialValues={{ email }}
                onSubmit={this.handleSubmit}
                error={errorMessage}
              />
            </Row>
          </Grid>
        }
      </div>
    );
  }
}
