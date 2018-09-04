/**
 * Response handler for check email.
 * @module users/actions/check-email
 */

import { UserRepository } from '../repositories';

/**
 * Response handler for check email.
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  UserRepository
    .findByEmail(req.body.email)
    .then(() => res.json({ success: true }))
    .catch(() => res.json({ success: false }));
}
