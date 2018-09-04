/**
 * Validation util.
 * @module util/validation
 */

const join = rules => (value, data) => rules.map(
  rule => rule(value, data)).filter(error => !!error)[0];

/**
 * Required validator.
 * @function requiredValidator
 * @param {string} value Input value.
 * @returns {bool} True if validates.
 */
export function requiredValidator(value) {
  return value !== undefined && value !== null && value !== '';
}

/**
 * Email validator.
 * @function emailValidator
 * @param {string} value Input value.
 * @returns {bool} True if validates.
 */
export function emailValidator(value) {
  return requiredValidator(value) && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
}

/**
 * Minumum length validator.
 * @function minLengthValidator
 * @param {string} value Input value.
 * @param {number} min Minimum length.
 * @returns {bool} True if validates.
 */
export function minLengthValidator(value, min) {
  return requiredValidator(value) && value.length >= min;
}

/**
 * Password validator.
 * @function passwordValidator
 * @param {string} value Input value.
 * @returns {bool} True if validates.
 */
export function passwordValidator(value) {
  return minLengthValidator(value, 8);
}

/**
 * Valid email validator.
 * @function isValidEmail
 * @param {string} value Input value.
 * @returns {string} Error message.
 */
export function isValidEmail(value) {
  if (!emailValidator(value)) {
    return 'Incorrect e-mailadres';
  }
  return '';
}

/**
 * Valid password validator.
 * @function isValidPassword
 * @param {string} value Input value.
 * @returns {string} Error message.
 */
export function isValidPassword(value) {
  if (!passwordValidator(value)) {
    return 'Wachtwoord moet uit minimaal 8 karakters bestaan';
  }
  return '';
}

/**
 * Required validator.
 * @function isRequired
 * @param {string} value Input value.
 * @returns {string} Error message.
 */
export function isRequired(value) {
  if (!requiredValidator(value)) {
    return 'Verplicht';
  }
  return '';
}

/**
 * Min length validator.
 * @function isMinLength
 * @param {number} min Minimum value.
 * @returns {Function} Min length validator.
 */
export function isMinLength(min) {
  return (value) => {
    if (!minLengthValidator(value, min)) {
      return `Voer minimaal ${min} karakters in`;
    }
    return '';
  };
}

/**
 * Create validator.
 * @function createValidator
 * @param {Object} rules Object with rules.
 * @returns {Function} Validator function.
 */
export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key]));
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}
