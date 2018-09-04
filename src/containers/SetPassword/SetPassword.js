/**
 * Set password container.
 * @module components/SetPassword
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';

import { ChangePasswordForm, PageTitle } from '../../components';
import { setPassword } from '../../actions';

import styles from './SetPassword.scss';


/**
 * Set password container class.
 * @class SetPassword
 * @extends Component
 */
export class SetPassword extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    setPassword: PropTypes.func.isRequired,
    location: PropTypes.object,
    password: PropTypes.object.isRequired,
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
   * Handler for submit action.
   * @method handleSubmit
   * @param {Object} data Form data.
   * @returns {undefined}
   */
  handleSubmit = (data) => {
    this.props.setPassword(data.password, get(this.state, 'token'));
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
      <div>
        <div className="row">
          <PageTitle>
            <div className={`col-xs-1 ${styles.icon}`}>
              <i className="fa fa-save fa-3x" />
            </div>
            <div className={`col-xs-6 ${styles.title}`}>
              <span id="successMessage" className="text-primary">Gelukt!</span>
              <br />Wachtwoord opgeslagen.
            </div>
          </PageTitle>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <br />
            <p>
              Vanaf nu kan je inloggen met je nieuwe wachtwoord om je huisregels te beheren.
            </p>
          </div>
        </div>
      </div>) : null;

    return (
      <div id="page-set-password">
        <Helmet title="Wachtwoord kiezen" />
        { successView ||
          <div>
            <div className="row">
              <div className="col-xs-12">
                <PageTitle>
                  <span className="text-primary">Wachtwoord</span> kiezen
                </PageTitle>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <p>
                  Kies een wachtwoord voor je bewonersaccount.
                </p>
                <br />
              </div>
            </div>
            <div className="row">
              <ChangePasswordForm
                onSubmit={this.handleSubmit}
                errorMessage={errorMessage}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    password: state.password,
  }), dispatch => bindActionCreators({ setPassword }, dispatch)
)(SetPassword);
