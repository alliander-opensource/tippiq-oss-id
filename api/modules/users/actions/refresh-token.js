/**
 * Response handler for refresh token
 * @module users/actions/refresh-token
 */

import { getJwtForUserId } from '../../auth';

/**
 * Response handler for refresh token
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default (req, res) => {
  if (req.user) {
    getJwtForUserId(req.user.get('id')).then((token) => {
      res
        .cacheControl('no-store')
        .status(200)
        .send({ token, success: true });
    });
  } else {
    res.json({
      success: false,
      message: 'Geen authenticatie.',
    });
  }
};
