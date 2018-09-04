/**
 * Auto register component.
 * @module components/AutoRegisterForm
 */

import memoize from 'lru-memoize';
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { createValidator, isRequired, isValidEmail } from '../../utils/validation';
import { Field, AuthenticateBox } from '../index';

/**
 * Auto register form component class.
 * @function AutoRegisterForm
 * @param {Array} props.fields Form fields.
 * @param {Object} props Component properties.
 * @param {Function} props.handleSubmit Submit form handler.
 * @param {String} props.loginUrl Url to the login page.
 * @param {String} props.errorMessage Error message to display.
 * @returns {string} Markup of the not found page.
 */
const AutoRegisterForm = ({ fields, handleSubmit, loginUrl, errorMessage }) => {
  const links = [{
    id: 'loginLink',
    to: loginUrl,
    text: 'Ik heb al een account',
  }];

  const error = errorMessage ?
    <div className="alert alert-danger">{errorMessage}</div> :
    null;

  return (
    <div className="auto-register-form-component">
      <AuthenticateBox title="Maak je Tippiq Account aan" links={links}>
        <form onSubmit={handleSubmit}>
          {error}
          <Field
            field={fields.email}
            type="email"
            placeholder="E-mailadres"
          />
          <button id="register" className="btn btn-primary btn-block" onClick={handleSubmit}>
            Account aanmaken
          </button>
        </form>
      </AuthenticateBox>
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
AutoRegisterForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loginUrl: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

export default reduxForm({
  form: 'autoRegister',
  fields: ['email'],
  validate: memoize(10)(createValidator({
    email: [isRequired, isValidEmail],
  })),
})(AutoRegisterForm);
