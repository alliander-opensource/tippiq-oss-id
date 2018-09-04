/**
 * Error for when not authorized
 * @module common/errors/unauthorized-error
 */
import ExtendableError from 'es6-error';

const createMessage = rest => {
  if (rest.length === 1) {
    return rest[0];
  }

  const user = rest[0];
  const permission = rest[1];
  return `User ${user} does not have permission ${permission}`;
};

/**
 * Custom error class for unauthorized errors.
 */
export default class UnauthorizedError extends ExtendableError {

  /**
   * Use createMessage to create a custom message when 2 arguments are detected.
   * @constructor
   * @param {array} rest All arguments
   */
  constructor(...rest) {
    super(createMessage(rest));
  }
}
