/**
 * Change password container.
 * @module components/ChangePassword
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';

import { ChangePasswordForm, PageTitle } from '../../components';
import { changePassword } from '../../actions';

/**
 * Change password container class.
 * @class ChangePassword
 * @extends Component
 */
export class ChangePassword extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    changePassword: PropTypes.func.isRequired,
    password: PropTypes.object.isRequired,
  }

  state = {
    passwordSaved: false,
  };

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.password.save && nextProps.password.save.success) {
      this.setState({ passwordSaved: true });
    }
  }

  /**
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit = (data) => {
    this.setState({ passwordSaved: false }, () => this.props.changePassword(data.password));
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { password } = this.props;
    const { passwordSaved } = this.state;

    return (
      <div id="page-change-password">
        <Helmet title="Mijn Account | Wachtwoord wijzigen" />
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <PageTitle>Wachtwoord wijzigen</PageTitle>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <p>
                Je kunt hier je wachtwoord voor je Tippiq Account wijzigen.
              </p>
              <br />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ChangePasswordForm
                onSubmit={this.handleSubmit}
                errorMessage={password.error ? password.error.message : ''}
              />
            </Col>
          </Row>
          { passwordSaved &&
            <Row>
              <Col xs={12}>
                <span id="successMessage" className="text-primary">
                  Gelukt! Je wachtwoord is gewijzigd.
                </span>
              </Col>
            </Row>
          }
        </Grid>
      </div>
    );
  }
}

export default connect(
  state => ({
    password: state.password,
  }), dispatch => bindActionCreators({ changePassword }, dispatch)
)(ChangePassword);
