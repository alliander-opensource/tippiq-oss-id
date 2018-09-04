/**
 * Validation util.
 * @module util/validation
 */

import BPromise from 'bluebird';

import { isValidEmail, isValidPassword } from '../../common/validation-utils';
import { User } from './models';
import { UserRepository } from './repositories';
import { ValidationError, EmailExistsError } from '../../common/errors';

/**
 * Email address in use validator.
 * @function emailAddressIsNotInUse
 * @param {string} value Input value.
 * @returns {Promise} Validator promise
 */
function emailAddressIsNotInUse(value) {
  return UserRepository
    .findByEmail(value)
    .thenThrow(new EmailExistsError('E-mailadres is al in gebruik'))
    .catch(User.NotFoundError, () => value);
}

/**
 * Email validator.
 * @function validateEmail
 * @param {string} value Input value.
 * @returns {Promise} Validator promise
 */
export function validateEmail(value) {
  return BPromise
    .resolve(value)
    .tap(isValidEmail)
    .tap(emailAddressIsNotInUse);
}

/**
 * Password validator.
 * @function validatePassword
 * @param {string} value Input value.
 * @returns {Promise} Validator promise
 */
export function validatePassword(value) {
  return BPromise
    .try(() => {
      isValidPassword(value);
    })
    .catchThrow(ValidationError,
      new ValidationError('Wachtwoord moet uit minimaal 8 karakters bestaan'));
}

/**
 * User validator.
 * @function validateUser
 * @param {Object} value Input value.
 * @returns {Promise} Validator promise
 */
export function validateUser(value) {
  return BPromise
    .resolve(value)
    .tap(user => validatePassword(user.password))
    .tap(user => validateEmail(user.email));
}

/**
 * Validate that the user is new.
 * @function validateUserIsNew
 * @param {Object} user UserModel object.
 * @returns {Promise} Validator promise
 */
export function validateUserIsNew(user) {
  return BPromise
    .try(() => {
      if (user.get('passwordHash')) {
        throw new ValidationError('Wachtwoord is al ingesteld');
      }
    });
}
