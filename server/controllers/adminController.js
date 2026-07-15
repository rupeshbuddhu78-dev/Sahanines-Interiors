const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const publicAdminFields = 'name email role phone avatar isActive lastLogin createdAt updatedAt';

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.search) {
    const regex = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }
  const items = await Admin.find(filter).select(publicAdminFields).sort('-createdAt');
  res.json({ success: true, items });
});

exports.create = asyncHandler(async (req, res, next) => {
  const { name, email, password, role = 'admin', phone, isActive = true } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('Name, email and password are required', 400));
  }
  if (password.length < 8) return next(new AppError('Password must be at least 8 characters', 400));

  const item = await Admin.create({ name, email, password, role, phone, isActive });
  await logActivity({
    admin: req.admin,
    action: 'admin_create',
    entity: 'Admin',
    entityId: item._id,
    ipAddress: req.ip,
  });
  item.password = undefined;
  res.status(201).json({ success: true, item });
});

exports.update = asyncHandler(async (req, res, next) => {
  const { name, role, phone, isActive, password } = req.body;
  const item = await Admin.findById(req.params.id).select('+password');
  if (!item) return next(new AppError('Admin not found', 404));

  if (name !== undefined) item.name = name;
  if (role !== undefined) item.role = role;
  if (phone !== undefined) item.phone = phone;
  if (isActive !== undefined) item.isActive = isActive;
  if (password) {
    if (password.length < 8) return next(new AppError('Password must be at least 8 characters', 400));
    item.password = password;
  }

  await item.save();
  await logActivity({
    admin: req.admin,
    action: 'admin_update',
    entity: 'Admin',
    entityId: item._id,
    ipAddress: req.ip,
  });
  item.password = undefined;
  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res, next) => {
  if (String(req.params.id) === String(req.admin._id)) {
    return next(new AppError('You cannot delete your own account while logged in.', 400));
  }
  const totalActive = await Admin.countDocuments({ isActive: true });
  const item = await Admin.findById(req.params.id);
  if (!item) return next(new AppError('Admin not found', 404));
  if (item.isActive && totalActive <= 1) {
    return next(new AppError('At least one active admin is required.', 400));
  }

  await item.deleteOne();
  await logActivity({
    admin: req.admin,
    action: 'admin_delete',
    entity: 'Admin',
    entityId: item._id,
    ipAddress: req.ip,
  });
  res.json({ success: true, message: 'Admin deleted' });
});
