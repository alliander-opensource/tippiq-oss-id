/**
 * Response handler for get profile.
 * @module users/actions/get-profile
 */

/**
 * Response handler for get profile
 * @function responseHandler
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {undefined}
 */
export default (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      email: req.user.get('email'),
      emailIsVerified: req.user.get('emailIsVerified'),
    });
  } else {
    res.json({
      success: false,
      message: 'Geen authenticatie.',
    });
  }
};
