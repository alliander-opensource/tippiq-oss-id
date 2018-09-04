/**
 * Login form component.
 * @module components/LoginForm
 */

import memoize from 'lru-memoize';
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { AuthenticateBox, Field } from '../index';
import { createValidator, isRequired, isValidEmail, isValidPassword } from '../../utils/validation';

/**
 * Login form component class.
 * @function LoginForm
 * @param {Object} props Component properties.
 * @param {Object} props.fields Fields for the form.
 * @param {Function} props.handleSubmit Submit form handler.
 * @param {String} props.errorMessage Error message.
 * @param {String} props.resetPasswordUrl URL for the reset password page.
 * @param {String} props.registerUrl URL for the register page.
 *
 * @returns {string} Markup of the component.
 */
const LoginForm = ({ fields, handleSubmit, errorMessage, resetPasswordUrl, registerUrl }) => {
  const error = errorMessage ?
    <div className="alert alert-danger">{errorMessage}</div> :
    null;

  const links = [{
    id: 'passwordForgotLink',
    to: `${resetPasswordUrl}?email=${fields.email.value === undefined ? '' : encodeURIComponent(fields.email.value)}`,
    text: 'Wachtwoord vergeten',
  }, {
    id: 'registerLink',
    to: registerUrl,
    text: 'Nieuw account aanmaken',
  }];

  return (
    <AuthenticateBox title="Inloggen met je Tippiq Account" links={links}>
      <div>
        { error }

        <form onSubmit={handleSubmit}>
          <Field
            field={fields.email}
            placeholder="Jouw e-mailadres"
            type="email"
          />
          <Field
            field={fields.password}
            placeholder="Jouw wachtwoord"
            type="password"
          />
          <button
            type="submit"
            id="submit"
            className="btn btn-primary btn-block"
            onClick={handleSubmit}
          >
            Inloggen
          </button>
        </form>
      </div>
    </AuthenticateBox>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
LoginForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetPasswordUrl: PropTypes.string.isRequired,
  registerUrl: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

export default reduxForm({
  form: 'login',
  fields: ['email', 'password'],
  validate: memoize(10)(createValidator({
    email: [isRequired, isValidEmail],
    password: [isRequired, isValidPassword],
  })),
})(LoginForm);
