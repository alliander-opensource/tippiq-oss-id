/**
 * Reset password container.
 * @module components/ResetPassword
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { get } from 'lodash';

import { ChangePasswordForm, PageTitle } from '../../components';
import { changePassword, tokenLogin } from '../../actions';

/**
 * Reset password container class.
 * @class ResetPassword
 * @extends Component
 */
export class ResetPassword extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    changePassword: PropTypes.func,
    location: PropTypes.object,
    password: PropTypes.object.isRequired,
    tokenLogin: PropTypes.func.isRequired,
  }

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    const token = get(this.props, 'location.query.token');
    if (token) {
      this.setState({ token });
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { password } = nextProps;
    if (password.token) {
      this.props.tokenLogin(password.token);
    }
  }

  /**
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit = (data) => {
    this.props.changePassword(data.password, get(this.state, 'token'));
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { password } = this.props;
    const errorMessage = password.error ? password.error.message : null;
    const successView = password.save && password.save.success ? (
      <Grid fluid>
        <Row>
          <Col xs={9}>
            <PageTitle>
              <span id="successMessage">Gelukt! Je nieuwe wachtwoord is opgeslagen.</span>
            </PageTitle>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <br />
            <p>
              Vanaf nu kun je inloggen met je nieuwe wachtwoord.
            </p>
            <Button
              onClick={() => browserHistory.push('/')}
              bsStyle="primary"
            >Ga naar mijn gegevens</Button>
          </Col>
        </Row>
      </Grid>) : null;

    return (
      <div id="page-reset-password">
        <Helmet title="Mijn Account | Wachtwoord wijzigen" />
        { successView ||
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <PageTitle>Nieuw wachtwoord instellen</PageTitle>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p>
                  Kies een nieuw wachtwoord voor je Tippiq <span className="text-primary">Account</span>.
                </p>
                <br />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <ChangePasswordForm
                  onSubmit={this.handleSubmit}
                  errorMessage={errorMessage}
                />
              </Col>
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
  }), dispatch => bindActionCreators({ changePassword, tokenLogin }, dispatch)
)(ResetPassword);
