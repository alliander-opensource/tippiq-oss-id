/**
 * Request reset password form component.
 * @module components/RequestResetPasswordForm
 */

import memoize from 'lru-memoize';
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { Field } from '../';
import { createValidator, isRequired, isValidEmail } from '../../utils/validation';

 /**
 * RequestResetPasswordForm container.
 * @class RequestResetPasswordForm
 */
export class RequestResetPasswordForm extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const error = this.props.errorMessage ? <div className="alert alert-danger">{this.props.errorMessage}</div> : null;
    return (
      <div>
        { error }
        <form onSubmit={this.props.handleSubmit}>
          <div className="col-xs-12 col-sm-6 col-lg-5">
            <Field field={this.props.fields.email} placeholder="Jouw e-mailadres" type="email" id="email" />
          </div>
          <div className="col-xs-12 col-sm-3 col-lg-2">
            <button
              id="requestResetPasswordSubmitButton"
              type="submit"
              className="btn btn-primary btn-block"
              onClick={this.props.handleSubmit}
            >
              Versturen
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'request-reset-password',
  fields: ['email'],
  validate: memoize(10)(createValidator({
    email: [isRequired, isValidEmail],
  })),
})(RequestResetPasswordForm);
