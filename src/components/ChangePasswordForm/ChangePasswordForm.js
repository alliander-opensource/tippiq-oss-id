/**
 * Change password form component.
 * @module components/ChangePasswordForm
 */

import memoize from 'lru-memoize';
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-bootstrap';

import Field from '../Field/Field';
import { createValidator, isRequired, isValidPassword } from '../../utils/validation';

 /**
 * ChangePasswordForm component.
 * @class ChangePasswordForm
 */
export class ChangePasswordForm extends Component {
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
 * render
 * @function render
 * @returns {string} Markup of the ChangePassword component.
 */
  render() {
    const error = this.props.errorMessage ?
      <Col className="alert alert-danger">{this.props.errorMessage}</Col> : null;
    return (
      <Row>
        { error }
        <form onSubmit={this.props.handleSubmit}>
          <Col xs={12} sm={6} lg={5}>
            <Field
              field={this.props.fields.password}
              placeholder="Jouw nieuwe wachtwoord"
              type="password"
              id="password"
            />
          </Col>
          <Col xs={12} sm={6} lg={5}>
            <button
              id="passwordSubmitButton"
              type="submit"
              className="btn btn-primary btn-block"
              onClick={this.props.handleSubmit}
            >Opslaan</button>
          </Col>
        </form>
      </Row>
    );
  }
}


export default reduxForm({
  form: 'change-password',
  fields: ['password'],
  validate: memoize(10)(createValidator({
    password: [isRequired, isValidPassword],
  })),
})(ChangePasswordForm);
