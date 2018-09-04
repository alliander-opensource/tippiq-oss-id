/**
 * Setup password and name form component.
 * @module components/SetupPasswordAndNameForm
 */

import memoize from 'lru-memoize';
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import Field from '../Field/Field';
import { createValidator, isRequired, isValidPassword } from '../../utils/validation';
import styles from './SetupPasswordAndNameForm.css';

/**
 * SetupPasswordAndNameForm component.
 * @class SetupPasswordAndNameForm
 */
export class SetupPasswordAndNameForm extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    showUserName: PropTypes.bool,
  }

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
    this.state = {
      showPassword: false,
    };
  }

  /**
   * Toggle show password characters
   * @function toggleShowPassword
   * @returns {undefined}
   */
  toggleShowPassword(event) {
    this.setState({ showPassword: !this.state.showPassword });
    event.preventDefault();
  }

  /**
   * render
   * @function render
   * @returns {string} Markup of the component.
   */
  render() {
    const { showUserName, errorMessage } = this.props;
    const error = errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null;

    return (
      <div className={styles.content}>
        { error }
        <form onSubmit={this.props.handleSubmit}>
          { showUserName ? <Field
            field={this.props.fields.name}
            placeholder="Jouw naam (optioneel)"
            type="text"
            id="name"
          /> : null }
          <Field
            field={this.props.fields.password}
            placeholder="Jouw nieuwe wachtwoord"
            type={this.state.showPassword ? 'text' : 'password'}
            id="password"
          />
          <button
            className={`btn-link ${styles.togglePassword}`}
            onClick={this.toggleShowPassword}
          >{this.state.showPassword ? 'Verberg' : 'Toon'} wachtwoord
          </button>
          <button
            id="passwordSubmitButton"
            type="submit"
            className="btn btn-primary btn-block"
            onClick={this.props.handleSubmit}
          >Opslaan
          </button>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'setup-password-and-nam',
  fields: ['name', 'password'],
  validate: memoize(10)(createValidator({
    password: [isRequired, isValidPassword],
  })),
})(SetupPasswordAndNameForm);
