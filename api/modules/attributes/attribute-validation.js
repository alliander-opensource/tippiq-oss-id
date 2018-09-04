/**
 * Place validation.
 * @module places/place-validation
 */

import BPromise from 'bluebird';

import { ValidationError } from '../../common/errors';
import { isValidUUID } from '../../common/validation-utils';
import { UserRepository } from '../../modules/users/repositories';

/**
 * Validate id.
 * @function validateUserId
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
function validateUserId(attribute) {
  if (!isValidUUID(attribute.userId)) {
    throw new ValidationError(`Invalid userId: ${attribute.userId} is not a valid UUID.`);
  }
  return BPromise.resolve(attribute);
}

/**
 * Validate user exists.
 * @function validateUserExists
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
function validateUserExists(attribute) {
  return UserRepository.findById(attribute.userId)
    .then(() => BPromise.resolve(attribute))
    .catch(() => {
      throw new ValidationError(`Invalid userId: ${attribute.userId} does not exist.`);
    });
}

/**
 * Validate data.
 * @function validateData
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
function validateData(attribute) {
  if (!attribute.data) {
    throw new ValidationError(`Invalid data: ${attribute.data} is not valid data.`);
  }
  return BPromise.resolve(attribute);
}

/**
 * Validate label.
 * @function validateLabel
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
function validateLabel(attribute) {
  if (attribute.label === undefined || attribute.label === '') {
    throw new ValidationError(`Invalid label: ${attribute.label} is not a valid value.`);
  }
  return BPromise.resolve(attribute);
}

/**
 * Validate attribute.
 * @function validateAttribute
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
export default function validateAttribute(attribute) {
  return BPromise.resolve(attribute)
    .tap(validateUserId)
    .tap(validateUserExists)
    .tap(validateData)
    .tap(validateLabel);
}
