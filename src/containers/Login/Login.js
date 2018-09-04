/**
 * Login container.
 * @module containers/Login
 */

import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { get } from 'lodash';

import {
  LoginForm,
  PageTitle,
} from '../../components';
import { login, logout } from '../../actions';
import redirect from '../../utils/redirect';

@connect(
  state => ({
    error: state.login.error,
    token: state.login.token,
  }),
  dispatch => bindActionCreators({ login, logout }, dispatch),
)
/**
 * Login component class.
 * @class Login
 * @extends Component
 */
export default class Login extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.object,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    error: PropTypes.object,
    token: PropTypes.string,
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
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.token) {
      const navigateToRoute = get(nextProps, 'location.state.nextPathname');
      if (navigateToRoute) {
        browserHistory.push(navigateToRoute);
      } else if (get(nextProps, 'location.query.redirect_uri')) {
        redirect(nextProps.location.query.redirect_uri);
      } else {
        browserHistory.push('/');
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
    this.props.login(data.email, data.password);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { email, redirect_uri: redirectUri } = this.props.location.query;
    let registerQuery;

    if (this.props.location.state) {
      registerQuery = `?redirect_uri=${encodeURIComponent(this.props.location.state.nextPathname)}`;
    } else {
      registerQuery = redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : '';
    }

    const { error } = this.props;
    const errorMessage = error ? 'E-mailadres of wachtwoord is onjuist.' : null;

    return (
      <div id="page-login">
        <Helmet title="Inloggen bij Tippiq" />
        <Grid>
          <Row>
            <Col xs={12}>
              <PageTitle>
                Inloggen met je Tippiq <span className="text-primary">Account</span>
              </PageTitle>
            </Col>
            <Col xs={12} sm={6} lg={7}>
              <p>
                Log hier in met je Tippiq <span className="text-primary">Account</span> om
                toegang te krijgen tot je Tippiq <span className="text-primary">Huis</span> en
                aangesloten dienst(en).
              </p>
            </Col>
            <Col xs={12} sm={6} lg={5} className="register-form">
              <LoginForm
                initialValues={{ email }}
                registerUrl={`/registreren${registerQuery}`}
                resetPasswordUrl="/wachtwoord-vergeten"
                onSubmit={this.handleSubmit}
                errorMessage={errorMessage}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
