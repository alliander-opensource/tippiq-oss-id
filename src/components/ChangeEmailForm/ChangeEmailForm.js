/**
 * Change email component.
 * @module components/ChangeEmailForm
 */

import memoize from 'lru-memoize';
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-bootstrap';

import { Field } from '../index';
import { createValidator, isRequired, isValidEmail } from '../../utils/validation';

/**
 * Change email form component class.
 * @function ChangeEmailForm
 * @param {Object} props Component properties.
 * @param {Object} props.fields Fields for the form.
 * @param {Function} props.handleSubmit Submit form handler.
 * @param {Function} props.resetForm Reset form handler.
 * @returns {string} Markup of the not found page.
 */
const ChangeEmailForm = ({ fields, handleSubmit, errorMessage }) => {
  const error = errorMessage ? <Col className="alert alert-danger" xs={12}>{errorMessage}</Col> :
    null;

  return (
    <Row>
      { error }
      <form onSubmit={handleSubmit}>
        <Col xs={12} sm={6} lg={5}>
          <Field field={fields.email} placeholder="Jouw e-mailadres" type="email" />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <button
            id="emailSubmitButton"
            type="submit"
            className="btn btn-primary btn-block"
            onClick={handleSubmit}
          >Opslaan
          </button>
        </Col>
      </form>
    </Row>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ChangeEmailForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

export default reduxForm({
  form: 'changeEmail',
  fields: ['email'],
  validate: memoize(10)(createValidator({
    email: [isRequired, isValidEmail],
  })),
})(ChangeEmailForm);
