/**
 * Change user_name component.
 * @module components/ChangeUserNameForm
 */

import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-bootstrap';

import { Field } from '../index';

/**
 * Change user_name form component class.
 * @function ChangeUserNameForm
 * @param {Object} props Component properties.
 * @param {Object} props.fields Fields for the form.
 * @param {Function} props.handleSubmit Submit form handler.
 * @param {Function} props.resetForm Reset form handler.
 * @returns {string} Markup of the not found page.
 */
export const ChangeUserNameForm = ({ fields, handleSubmit, errorMessage }) => {
  const error = errorMessage && <Col className="alert alert-danger" xs={12}>{errorMessage}</Col>;

  return (
    <Row>
      { error }
      <form onSubmit={handleSubmit}>
        <Col xs={12} sm={6} lg={5}>
          <Field field={fields.userName} placeholder="Jouw naam" type="text" />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <button
            id="userNameSubmitButton"
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
ChangeUserNameForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

export default reduxForm({
  form: 'changeUserName',
  fields: ['userName'],
})(ChangeUserNameForm);
