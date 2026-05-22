const AppError = require('../utils/AppError');

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new AppError('Unauthorized', 401));
  if (!roles.includes(req.user.role)) {
    return next(new AppError(`Access restricted to: ${roles.join(', ')}`, 403));
  }
  next();
};

module.exports = requireRole;