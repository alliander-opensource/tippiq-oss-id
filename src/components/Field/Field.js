/**
 * Field component.
 * @module components/Field
 */

import React, { PropTypes } from 'react';
import { pickHTMLProps } from 'pick-react-known-prop';

/**
 * Register form component class.
 * @function Field
 * @param {Object} props Component properties.
 * @param {Object} props.field Field data.
 * @param {string} props.label Lavel of the field.
 * @param {string} props.type Type of the field.
 * @param {string} props.placeholder Placeholder of the field.
 * @param {string} props.disabled Disabled state of the field.
 * @returns {string} Markup of the field component.
 */
const Field = ({ field, label, type, placeholder, disabled }) =>
  <div className={`form-group ${field.error && field.touched ? ' has-error' : ''}`}>
    {
      label ?
        <label
          htmlFor={field.name}
        >
          {label}
        </label> :
      null
    }
    <input
      type={type}
      className="form-control"
      id={field.name}
      placeholder={placeholder}
      disabled={disabled}
      {...pickHTMLProps(field)}
    />
    {field.error && field.touched && <div className="text-danger">{field.error}</div>}
  </div>;

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Field.propTypes = {
  field: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.any,
};

export default Field;
