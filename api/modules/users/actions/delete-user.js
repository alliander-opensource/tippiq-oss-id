/**
 * Response handler for delete user.
 * @module users/actions/delete-user
 */

import debugLogger from 'debugnyan';

import { validatePermissions, verifyPassword, ROLES } from '../../auth/auth';
import { UserRepository } from '../repositories';
import { UnauthorizedError } from '../../../common/errors';
import { DELETE_USER } from '../../auth/permissions';

const debug = debugLogger('tippiq-id:users:actions:delete-user');

/**
 * Response handler for deleting (active) user.
 * Handles multiple scenario's:
 * 1. User without password (through the simple registration flow, so no password is set) can
 * delete himself and an Admin user can delete a user without a password.
 * 2. User can delete himself.
 * 3. User can be deleted by admin by logging in as admin, and call this endpoint with the user
 * id of the user to delete, and supply the admin password.
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  validatePermissions(req, res, DELETE_USER)
    .then(() => {
      if (req.body.password === '' && req.user.get('passwordHash') === null) {
        return true;
      }
      return verifyPassword(req.body.password, req.user.get('passwordHash'));
    })
    .tap((passwordMatched) => {
      const allowedToDeleteUser = req.user.hasRole(ROLES.ADMINISTRATOR) ||
        req.body.id === req.user.get('id');
      if (!passwordMatched || !allowedToDeleteUser) {
        throw new UnauthorizedError('Invalid credentials');
      }
    })
    .then(() => req.body.id)
    .then(UserRepository.deleteById)
    .then(() => {
      debug.debug(`User with id: ${req.body.id} deleted`);
      res.status(204).send();
    })
    .catch(UnauthorizedError, (err) => {
      debug.debug(`Failed to delete: ${err.message}`);
      res
        .status(403)
        .json({
          success: false,
          message: `Verwijderen mislukt: ${err.message}.`,
        });
    })
    .catch((err) => {
      debug.debug(`Failed to delete: ${err.message}`);
      res
        .status(400)
        .json({
          success: false,
          message: `Verwijderen mislukt: ${err.message}.`,
        });
    });
}
