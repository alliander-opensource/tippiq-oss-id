/**
 * Validation util.
 * @module common/validation-utils
 */

import { emailValidator, passwordValidator } from '../../src/utils/validation';
import { ValidationError } from './errors';

const uuidFormat = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

/**
 * Valid email validator.
 * @function isValidEmail
 * @param {string} value Input value.
 * @returns {undefined}
 */
export function isValidEmail(value) {
  if (!emailValidator(value)) {
    throw new ValidationError('Invalid email');
  }
}

/**
 * Valid password validator.
 * @function isValidPassword
 * @param {string} value Input value.
 * @returns {undefined}
 */
export function isValidPassword(value) {
  if (!passwordValidator(value)) {
    throw new ValidationError('Invalid password');
  }
}

/**
 * Check valid UUID.
 * @function isValidUUID
 * @param {string} input Input to check.
 * @returns {Bool} True if valid UUID.
 */
export function isValidUUID(input) {
  return uuidFormat.test(input);
}
