/**
 * Custom Errors for use in the API. They can help clarify promise chains by catching specific
 * Errors.
 * @module common/errors
 */
import ExtendableError from 'es6-error';
import UnauthorizedError from './unauthorized-error';

/**
 * Custom error class for email address exists errors.
 */
class EmailExistsError extends ExtendableError {
}

/**
 * Custom error class for authentication errors.
 */
class AuthenticationError extends ExtendableError {
}

/**
 * Custom error class for token errors.
 */
class TokenDecodeError extends ExtendableError {
}

/**
 * Custom error class for validation errors.
 */
class ValidationError extends ExtendableError {
}

/**
 * Custom error class for verification errors.
 */
class VerificationError extends ExtendableError {
}

export {
  AuthenticationError,
  UnauthorizedError,
  ValidationError,
  VerificationError,
  TokenDecodeError,
  EmailExistsError,
};
