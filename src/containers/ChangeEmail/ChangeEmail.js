/**
 * Change email container.
 * @module components/ChangeEmail
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';

import { ChangeEmailForm, PageTitle } from '../../components';
import { changeEmail, getProfile, getUserDisplayName, verifyEmailStart } from '../../actions';

import styles from './ChangeEmail.css';

/**
 * Change email container class.
 * @class ChangeEmail
 * @extends Component
 */
class ChangeEmail extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    changeEmail: PropTypes.func.isRequired,
    getProfile: PropTypes.func.isRequired,
    verifyEmailStart: PropTypes.func.isRequired,
    getUserDisplayName: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    emailVerification: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
  }

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      emailSaved: false,
    };
    this.verifyEmail = this.verifyEmail.bind(this);
    this.pollVerification = this.pollVerification.bind(this);
  }

  /**
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (!this.props.profile.email) {
      this.props.getProfile();
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.saved && !this.state.emailSaved) {
      this.setState({ emailSaved: true });
      this.props.getUserDisplayName(this.props.login.id);
      this.props.getProfile();
    }
    if (nextProps.emailVerification.started && !this.verificationInterval) {
      this.verificationInterval = setInterval(this.pollVerification, 3000);
    }
    if (nextProps.profile.emailIsVerified && !!this.verificationInterval) {
      clearInterval(this.verificationInterval);
      this.verificationInterval = null;
    }
  }

  /**
   * On component will unmount
   * @function componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval);
    }
  }

  /**
   * poll verification status
   * @function pollVerification
   * @returns {undefined}
   */
  pollVerification() {
    this.props.getProfile();
  }

  /**
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit = (data) => {
    this.setState({ emailSaved: false }, () => this.props.changeEmail(data.email));
  };

  /**
   * Request verify email.
   * @method verifyEmail
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  verifyEmail() {
    this.props.verifyEmailStart();
  }

  /**
   * RenderEmailVerification method.
   * @method renderEmailVerification
   * @returns {string} Markup for the component.
   */
  renderEmailVerification() {
    const { emailVerification } = this.props;
    return emailVerification.started ? (
      <p id="verify-email-success">
        We hebben je zojuist een verificatiemail gestuurd.<br />
        Klik op de link in deze mail om je e-mailadres te verifiëren.
        <br /><br />
        Heb je geen e-mail ontvangen ?
        <button className={`${styles.link} btn-link`} onClick={this.verifyEmail}>
          Vraag opnieuw de verificatiemail aan.
        </button>
      </p>
    ) : (
      <p>
        {emailVerification.error ?
          <span className="text-danger">{emailVerification.error.message}</span>
        :
          <span>
            <mark><i className={`${styles.bigIcon} fa fa-times`} /></mark>
            <span className={styles.strong}>Je e-mailadres is nog niet geverifieerd. </span>
          </span>
        }
        <button
          id="email-verification-button"
          className={`${styles.link} btn-link`}
          onClick={this.verifyEmail}
        >
          Mijn e-mailadres verifiëren
        </button>
      </p>
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { profile } = this.props;
    const { emailSaved } = this.state;
    return (
      <div id="page-change-email">
        <Helmet title="Mijn Account | E-mailadres wijzigen" />
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <PageTitle>E-mailadres wijzigen</PageTitle>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              { profile.email !== null &&
                <ChangeEmailForm
                  initialValues={{ email: profile.email }}
                  onSubmit={this.handleSubmit}
                  errorMessage={profile.error ? profile.error.message : ''}
                />
              }
            </Col>
          </Row>
          { emailSaved &&
            <Row>
              <Col xs={12}>
                <span id="successMessage" className="text-primary">
                  Gelukt! Je e-mailadres is opgeslagen.
                </span>
              </Col>
            </Row>
          }
          <Row>
            <Col xs={12}>
              {!profile.emailIsVerified ? this.renderEmailVerification() :
                <p>Je e-mailadres is geverifieerd.</p>
              }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default connect(
  state => ({
    profile: state.profile,
    emailVerification: state.emailVerification,
    login: state.login,
  }),
  ({ getProfile, changeEmail, getUserDisplayName, verifyEmailStart })
)(ChangeEmail);
