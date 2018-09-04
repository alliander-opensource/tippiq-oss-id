/**
 * Start container.
 * @module containers/Start
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import { IDLE, PENDING, SUCCESS } from '../../constants/status';
import { getProfile, simpleRegister, checkEmailExists, logout } from '../../actions';
import {
  AutoRegisterForm,
  AutoRegisterPrefilled,
  PageTitle,
} from '../../components';
import { setQueryParams } from '../../utils/url';

/**
 * Start component class.
 * @function Start
 * @param {Object} props Component properties.
 * @param {Object} props.location Location properties.
 * @returns {string} Markup of the not found page.
 */
export class Start extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getProfile: PropTypes.func.isRequired,
    simpleRegister: PropTypes.func.isRequired,
    checkEmailExists: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    simpleRegistration: PropTypes.object.isRequired,
    emailExists: PropTypes.object.isRequired,
    config: PropTypes.shape({
      tippiqPlacesBaseUrl: PropTypes.string,
    }),
  }

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties object
   * @constructs PlaceKeys
   */
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    this.props.getProfile();
    this.props.checkEmailExists(this.props.location.query.email);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.simpleRegistration.status === SUCCESS) {
      const { tippiqPlacesBaseUrl } = this.props.config;
      const { redirect_uri: redirectUri = tippiqPlacesBaseUrl, clientId } =
        nextProps.location.query;
      window.location.href = setQueryParams('/selecteer-je-huis', {
        redirect_uri: redirectUri,
        clientId,
      });
    }

    if (nextProps.profile.status !== PENDING && !nextProps.profile.email &&
      nextProps.emailExists.success) {
      const {
        email,
        clientId,
        redirect_uri: redirectUri,
        failure_uri: failureUri,
      } = this.props.location.query;

      browserHistory
        .replace({
          pathname: '/login',
          search: `?redirect_uri=${redirectUri}` +
          `&failure_uri=${failureUri}` +
          `&clientId=${clientId}` +
          `&email=${email}`,
        });
    }
  }

  /**
   * Should component update
   * @method shouldComponentUpdate
   * @param {Object} nextProps Next properties
   * @returns {Boolean} flag whether to re-render this component or not
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.profile.status !== PENDING && nextProps.emailExists !== PENDING;
  }

  /**
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit(data) {
    this.props.simpleRegister(data.email);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { simpleRegistration, profile, emailExists } = this.props;
    const {
      email,
      clientId,
      redirect_uri: redirectUri,
      failure_uri: failureUri,
    } = this.props.location.query;

    const selectPlaceRedirectUrl = `/selecteer-je-huis?redirect_uri=${redirectUri}` +
      `&failure_uri=${failureUri}&clientId=${clientId}`;
    const registerUrl = `/start?redirect_uri=${redirectUri}` +
      `&failure_uri=${failureUri}&clientId=${clientId}`;
    const loginUrl = `/login?email=${email ? encodeURIComponent(email) : ''}&redirect_uri=${encodeURIComponent(registerUrl)}`;

    const registerForm = redirectUri && profile.email ?
      <AutoRegisterPrefilled
        email={profile.email}
        redirectUri={encodeURIComponent(selectPlaceRedirectUrl)}
        loginUrl={loginUrl}
        registerUrl={registerUrl}
        onRegisterClick={this.props.logout}
      /> :
      <AutoRegisterForm
        initialValues={{ email }}
        loginUrl={loginUrl}
        onSubmit={this.handleSubmit}
        errorMessage={simpleRegistration.error ? simpleRegistration.error.message : ''}
      />;

    return profile.status !== IDLE && emailExists.status !== PENDING ? (
      <div id="page-start">
        <Helmet title="Tippiq Account aanmaken" />
        <Grid>
          <Row>
            <Col xs={12}>
              <PageTitle>
                Tippiq <span className="text-primary">Account</span> aanmaken
              </PageTitle>
            </Col>
            <Col xs={12} sm={6} lg={7}>
              <p>
                Hiermee sluit je eenvoudig diensten aan op je Tippiq <span className="text-primary">Huis</span>.
                Bovendien kun je hiermee gemakkelijk de toegang tot je digitale huis beheren.
              </p>
            </Col>
            <Col xs={12} sm={6} lg={5} className="register-form">
              { registerForm }
            </Col>
          </Row>
        </Grid>
      </div>) : null;
  }
}

export default connect(
  state => ({
    profile: state.profile,
    simpleRegistration: state.simpleRegistration,
    emailExists: state.emailExists,
    config: state.appConfig,
  }), dispatch => bindActionCreators({
    getProfile,
    simpleRegister,
    checkEmailExists,
    logout,
  }, dispatch)
)(Start);
