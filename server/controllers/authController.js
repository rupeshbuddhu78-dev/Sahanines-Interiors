const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken, sendTokenCookie } = require('../utils/jwt');
const logActivity = require('../utils/logActivity');

const MAX_LOGIN_ATTEMPTS = 6;
const LOCK_TIME_MS = 15 * 60 * 1000;

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, remember } = req.body;
  if (!email || !password) return next(new AppError('Email and password are required', 400));

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  if (!admin) return next(new AppError('Invalid email or password', 401));

  if (admin.isLocked()) {
    return next(new AppError('Account temporarily locked. Try again later.', 423));
  }
  if (!admin.isActive) return next(new AppError('Account disabled', 403));

  const ok = await admin.comparePassword(password);
  if (!ok) {
    admin.loginAttempts = (admin.loginAttempts || 0) + 1;
    if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      admin.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
    }
    await admin.save({ validateBeforeSave: false });
    return next(new AppError('Invalid email or password', 401));
  }

  admin.loginAttempts = 0;
  admin.lockUntil = undefined;
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = signToken(admin._id, admin.role);
  if (remember) sendTokenCookie(res, token);

  admin.password = undefined;
  await logActivity({
    admin,
    action: 'login',
    entity: 'Admin',
    entityId: admin._id,
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    token,
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
    },
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new AppError('Both passwords are required', 400));
  }
  if (newPassword.length < 8) {
    return next(new AppError('New password must be at least 8 characters', 400));
  }

  const admin = await Admin.findById(req.admin._id).select('+password');
  const ok = await admin.comparePassword(currentPassword);
  if (!ok) return next(new AppError('Current password is incorrect', 401));

  admin.password = newPassword;
  await admin.save();

  await logActivity({
    admin,
    action: 'change_password',
    entity: 'Admin',
    entityId: admin._id,
    ipAddress: req.ip,
  });

  res.json({ success: true, message: 'Password changed successfully' });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Email is required', 400));

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  // Always return success to avoid user enumeration
  if (!admin) {
    return res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
  }

  const resetToken = admin.createPasswordResetToken();
  await admin.save({ validateBeforeSave: false });

  // In production, email this. For now, return in response only in dev.
  const payload = { success: true, message: 'Reset link generated.' };
  if (process.env.NODE_ENV !== 'production') payload.resetToken = resetToken;
  res.json(payload);
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const crypto = require('crypto');
  const { token, password } = req.body;
  if (!token || !password) return next(new AppError('Token and password required', 400));

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const admin = await Admin.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!admin) return next(new AppError('Token invalid or expired', 400));

  admin.password = password;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();

  res.json({ success: true, message: 'Password reset successfully' });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, phone } = req.body;
  const admin = await Admin.findByIdAndUpdate(
    req.admin._id,
    { name, phone },
    { new: true, runValidators: true }
  );
  res.json({ success: true, admin });
});
