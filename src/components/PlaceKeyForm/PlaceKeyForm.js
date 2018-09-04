/**
 * PlaceKey form component.
 * @module components/PlaceKeyForm
 */

import memoize from 'lru-memoize';
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { createValidator, isRequired } from '../../utils/validation';

/**
 * PlaceKey form component class.
 * @function PlaceKeyForm
 * @param {Object} props Component properties.
 * @param {Object} props.fields Fields for the form.
 * @param {Object} props.placeKeys PlaceKey options.
 * @param {Function} props.handleSubmit Submit form handler.
 * @param {String} props.errorMessage Error message.
 * @returns {String} Markup of the component.
 */
const PlaceKeyForm = ({ fields, placeKeys, handleSubmit, errorMessage }) => {
  const error = errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null;
  const placeKeyList = placeKeys ? (
    <div>
      <ul className="list-group" id="list-place-keys">
        {placeKeys.map(placeKey => (
          <li className="list-group-item" key={placeKey.id}>
            <div className="radio">
              <label htmlFor={placeKey.id}>
                <input
                  type="radio" {...fields.placekey} value={placeKey.placeId} id={placeKey.id}
                  checked={fields.placekey.value === placeKey.placeId}
                />
                {placeKey.label}
              </label>
            </div>
          </li>
        ))}
      </ul>
      {fields.placekey.error && fields.placekey.touched &&
        <div className="text-danger">{fields.placekey.error}</div>}
    </div>
  ) : <div>Je hebt nog geen huissleutels</div>;

  return (
    <div>
      {error}
      <form onSubmit={handleSubmit}>
        {placeKeyList}
        <button
          id="select-place-key-submit"
          type="submit"
          className="btn btn-primary btn-block"
          onClick={handleSubmit}
        >Verdergaan</button>
      </form>
    </div>);
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
PlaceKeyForm.propTypes = {
  fields: PropTypes.object.isRequired,
  placeKeys: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

export default reduxForm({
  form: 'placekeys',
  fields: ['placekey'],
  validate: memoize(10)(createValidator({
    placekey: [isRequired],
  })),
})(PlaceKeyForm);
