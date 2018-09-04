/**
 * Register container.
 * @module components/Register
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';

import { IDLE, SUCCESS } from '../../constants/status';
import { RegisterForm, PageTitle } from '../../components';
import { register, getUserPlaceSession } from '../../actions';
import { setQueryParams, setQueryParam } from '../../utils/url';
import redirect from '../../utils/redirect';
import styles from './Register.css';

@connect(
  state => ({
    registration: state.registration,
    userPlaceSession: state.userPlaceSession,
    user: state.registration,
    config: state.appConfig,
  }),
  dispatch => bindActionCreators({ register, getUserPlaceSession }, dispatch),
)
/**
 * Register component class.
 * @class Register
 * @extends Component
 */
export default class Register extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.object,
    register: PropTypes.func.isRequired,
    getUserPlaceSession: PropTypes.func.isRequired,
    registration: PropTypes.object,
    userPlaceSession: PropTypes.object,
    config: PropTypes.object,
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.registration.status === SUCCESS) {
      if (nextProps.userPlaceSession.status === IDLE) {
        this.props.getUserPlaceSession('places');
      }
      if (nextProps.userPlaceSession.status === SUCCESS) {
        redirect(get(nextProps, 'location.query.redirect_uri'));
      }
    }
  }

  /**
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit = (data) => {
    this.props.register(data.email, data.password);
  }

  /**
   * Create add place url
   * @method createAddPlaceUrl
   * @returns {string} Add place url
   */
  createAddPlaceUrl() {
    const { frontendBaseUrl, tippiqPlacesBaseUrl } = this.props.config;
    const { redirect_uri: redirectUri, clientId } = this.props.location.query;
    const { token } = this.props.userPlaceSession;
    let returnRoute = '/selecteer-je-huis';
    if (clientId) {
      returnRoute = setQueryParam(returnRoute, 'clientId', clientId);
    }

    if (redirectUri) {
      returnRoute = setQueryParam(returnRoute, 'redirect_uri', redirectUri);
    }

    const returnUrl = `${frontendBaseUrl}/huissleutel-opslaan?return_route=${returnRoute}`;

    const addPlaceUrl = setQueryParams(`${tippiqPlacesBaseUrl}/nieuw-huis`,
      {
        return_url: encodeURIComponent(returnUrl),
        clientId,
        token,
      });
    return addPlaceUrl;
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { redirect_uri: redirectUri } =
      this.props.location ? this.props.location.query : {};
    const { registration, userPlaceSession } = this.props;
    const errorMessage = registration.error ? registration.error.message : null;
    const isSuccess = registration.status === SUCCESS && userPlaceSession.status === SUCCESS;

    return (
      <div id="page-register">
        <Helmet title="Tippiq Account aanmaken" />
        <Grid>
          { isSuccess ? (
            <Row>
              <Col xs={12}>
                <PageTitle id="successMessage">
                  Je Tippiq <span className="text-primary">Account</span> is aangemaakt
                </PageTitle>
              </Col>
              <Col xs={12}>
                <p>
                  Met je Tippiq Account kun je eenvoudig de toegang tot je digitale huis beheren,
                  en gemakkelijk diensten aansluiten op je Tippiq
                  <span className="text-primary"> Huis</span>.
                </p>
              </Col>
              <Col xs={12} className={`${styles.addPlace}`}>
                <Button bsStyle="primary" block href={this.createAddPlaceUrl()}>
                  Voeg huis toe
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col xs={12}>
                <PageTitle>
                  Tippiq <span className="text-primary">Account</span> aanmaken
                </PageTitle>
              </Col>
              <Col xs={12} sm={6} lg={7}>
                <p>
                  Hiermee sluit je eenvoudig diensten aan op je Tippiq
                  <span className="text-primary"> Huis</span>. Bovendien kun je hiermee
                  gemakkelijk de toegang tot je digitale huis beheren.
                </p>
              </Col>
              <Col xs={12} sm={6} lg={5} className="register-form">
                <RegisterForm
                  onSubmit={this.handleSubmit}
                  errorMessage={errorMessage}
                  loginUrl={`/login?redirect_uri=${encodeURIComponent(redirectUri)}`}
                />
              </Col>
            </Row>
          )}
        </Grid>
      </div>
    );
  }
}
