/**
 * Custom Errors for use in the IRMA API. They can help clarify promise chains by catching specific
 * irma Errors.
 * @module irma/errors
 */
import ExtendableError from 'es6-error';

/**
 * Custom irma error class for irma session token errors.
 */
class IrmaConfigurationError extends ExtendableError {
}

/**
 * Custom error class for irma session token errors.
 */
export default class UnknownIrmaSessionTokenError extends ExtendableError {
}

export {
  UnknownIrmaSessionTokenError,
  IrmaConfigurationError,
};
