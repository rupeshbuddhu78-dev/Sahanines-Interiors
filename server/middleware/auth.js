const { verifyToken } = require('../utils/jwt');
const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const extractToken = (req) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies?.token) return req.cookies.token;
  return null;
};

// Protects routes: requires valid JWT and active admin
exports.protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next(new AppError('You are not logged in.', 401));

  const decoded = verifyToken(token);
  const admin = await Admin.findById(decoded.id).select('+password');
  if (!admin) return next(new AppError('Admin no longer exists.', 401));
  if (!admin.isActive) return next(new AppError('Account is disabled.', 403));
  if (admin.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password recently changed. Please log in again.', 401));
  }

  admin.password = undefined;
  req.admin = admin;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin?.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};
