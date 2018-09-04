/**
 * Register form component.
 * @module components/RegisterForm
 */

import memoize from 'lru-memoize';
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { Field, AuthenticateBox } from '../../components';
import { createValidator, isRequired, isValidEmail, isValidPassword } from '../../utils/validation';

/**
 * Register form component class.
 * @function RegisterForm
 * @param {Object} props Component properties.
 * @param {Object} props.fields Fields for the form.
 * @param {Function} props.handleSubmit Submit form handler.
 * @param {string} props.loginUrl Url to the login page.
 * @param {string} props.errorMessage Error message.
 * @returns {string} Markup of the not found page.
 */
const RegisterForm = ({ fields, handleSubmit, loginUrl, errorMessage }) => {
  const error = errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null;

  const links = [{
    id: 'loginLink',
    to: loginUrl,
    text: 'Ik heb al een account',
  }];

  return (
    <AuthenticateBox title="Maak je Tippiq Account aan" links={links} >
      <div>
        { error }
        <form onSubmit={handleSubmit}>
          <Field
            field={fields.email}
            placeholder="Jouw e-mailadres"
            type="email"
            id="email"
          />
          <Field
            field={fields.password}
            placeholder="Jouw wachtwoord"
            type="password"
            id="password"
          />
          <button
            id="registerSubmitButton"
            type="submit"
            className="btn btn-primary btn-block"
            onClick={handleSubmit}
          >Registreren</button>
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
RegisterForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loginUrl: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

export default reduxForm({
  form: 'register',
  fields: ['email', 'password'],
  validate: memoize(10)(createValidator({
    email: [isRequired, isValidEmail],
    password: [isRequired, isValidPassword],
  })),
})(RegisterForm);
