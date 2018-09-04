/**
 * @author Tippiq
 */
export default (req, res, next) => {
  res.cacheControl = function cacheControl(pattern) { // eslint-disable-line no-param-reassign
    if (pattern === 'no-store') {
      this.set('Cache-Control', 'no-store, no-cache');
    }
    return this;
  };
  next();
};
