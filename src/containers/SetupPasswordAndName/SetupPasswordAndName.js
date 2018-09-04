/**
 * Set password container.
 * @module components/SetPassword
 */
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { get } from 'lodash';
import jwtDecode from 'jwt-decode';

import { SetupPasswordAndNameForm, PageTitle } from '../../components';
import {
  tokenLogin,
  getUserAttributes,
  changePassword,
  createUserAttribute,
} from '../../actions';
import { SUCCESS } from '../../constants/status';
import { getFirstOfType } from '../../helpers';
import { USER_NAME_ATTRIBUTE_TYPE } from '../../constants/AttributeTypes';
import styles from './SetupPasswordAndName.scss';

/**
 * Setup password and name container class.
 * @class SetupPasswordAndName
 * @extends Component
 */
export class SetupPasswordAndName extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    tokenLogin: PropTypes.func.isRequired,
    getUserAttributes: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    createUserAttribute: PropTypes.func.isRequired,
    login: PropTypes.object,
    userAttributes: PropTypes.object,
    location: PropTypes.object,
    password: PropTypes.object.isRequired,
  }

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.state = { userName: null };
  }

  /**
   * On component did mount
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    // login with token
    this.props.tokenLogin(get(this.props, 'location.query.token'));
    if (!this.state.userName) {
      this.props.getUserAttributes();
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.userAttributes.status === SUCCESS) {
      const attribute = getFirstOfType(nextProps.userAttributes.list, USER_NAME_ATTRIBUTE_TYPE);
      const userName = attribute && attribute.data ? attribute.data.name : null;
      this.setState({ userName });
    }
  }

  /**
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit = data => {
    this.props.changePassword(data.password);
    if (data.name) {
      this.props.createUserAttribute({
        data: {
          type: 'user_name',
          name: data.name,
        },
        userId: jwtDecode(this.props.login.token).sub,
        label: 'Mijn naam',
      });
      this.setState({ userName: data.name });
    }
  }

  /**
   * Render token expired method.
   * @method renderTokenExpired
   * @returns {string} Markup for the component.
   */
  renderTokenExpired() {
    return this.props.login.error ?
      <Col xs={12}>
        <div className="alert alert-danger">De verificatiecode is verlopen. </div>
        <p>Als je je wachtwoord opnieuw wilt instellen,
          gebruik dan <Link to="/wachtwoord-vergeten">wachtwoord vergeten</Link>

        </p>
        <br /><br />
      </Col> : null;
  }

  /**
   * Render setup complete method.
   * @method renderSetupComplete
   * @returns {string} Markup for the component.
   */
  renderSetupComplete() {
    const { password } = this.props;
    return password.save && password.save.success ? (
      <Grid className={styles.successContainer}>
        <Row>
          <PageTitle>
            <Col xs={1} className={styles.icon}>
              <i className="fa fa-save fa-3x" />
            </Col>
            <Col xs={7} className={styles.title}>
              <span id="successMessage" className="text-primary">Gelukt!</span>
              <br />Wachtwoord {this.state.userName ? 'en naam' : ''} ingesteld.
            </Col>
          </PageTitle>
        </Row>
      </Grid>) : null;
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { userName } = this.state;
    const { password } = this.props;
    const error = get(password, 'error.message');
    const userNameText = userName === null ?
      'Je kunt hier ook je voornaam invullen zodat we je netjes aan kunnen spreken.' : null;

    return (
      <div id="page-setup-password-and-name">
        <Helmet title="Wachtwoord en naam kiezen" />
        { this.renderSetupComplete() ||
          <Grid>
            <Row>
              <Col xs={12}>
                <PageTitle>Voltooi je account</PageTitle>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p>
                  Om je account te voltooien heb je een wachtwoord nodig, deze kun je hieronder
                  invullen.<br />
                  { userNameText }
                </p>
                <br />
              </Col>
            </Row>
            <Row>
              { this.renderTokenExpired() ||
                <Col xs={12} sm={6}>
                  <SetupPasswordAndNameForm
                    showUserName={userName === null}
                    onSubmit={this.handleSubmit}
                    errorMessage={error}
                  />
                </Col>
              }
            </Row>
          </Grid>
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    password: state.password,
    login: state.login,
    userAttributes: state.userAttributes,
  }), dispatch => bindActionCreators({
    tokenLogin,
    getUserAttributes,
    changePassword,
    createUserAttribute,
  }, dispatch)
)(SetupPasswordAndName);
