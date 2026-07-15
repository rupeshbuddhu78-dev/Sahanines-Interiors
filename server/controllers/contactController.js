const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/apiFeatures');
const logActivity = require('../utils/logActivity');
const { deleteFromCloudinary } = require('../config/cloudinary');

// PUBLIC
exports.create = asyncHandler(async (req, res, next) => {
  const { name, phone, email, city, service, budget, message, propertyType } = req.body;
  if (!name || !phone || !email || !message) {
    return next(new AppError('Name, phone, email, and message are required', 400));
  }

  let referenceImage;
  if (req.file) {
    referenceImage = {
      url: req.file.path,
      publicId: req.file.filename,
      folder: req.file.folder,
      width: req.file.width,
      height: req.file.height,
      format: req.file.format,
      createdTime: new Date(),
    };
  }

  const doc = await ContactMessage.create({
    name, phone, email, city, service, budget, propertyType, message, referenceImage,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  await Notification.create({
    type: 'contact',
    title: 'New Contact Message',
    message: `${doc.name}: ${doc.message.slice(0, 60)}${doc.message.length > 60 ? '…' : ''}`,
    link: `/admin/dashboard.html#messages/${doc._id}`,
    icon: 'mail',
    priority: 'normal',
    relatedId: doc._id,
    relatedModel: 'ContactMessage',
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out. We will respond within one business day.',
  });
});

// ADMIN
exports.list = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(ContactMessage.find(), req.query)
    .filter()
    .search(['name', 'email', 'phone', 'message'])
    .sort()
    .paginate();
  const items = await features.query;
  const total = await ContactMessage.countDocuments();
  const unread = await ContactMessage.countDocuments({ status: 'unread' });
  res.json({
    success: true,
    total,
    unread,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    items,
  });
});

exports.get = asyncHandler(async (req, res, next) => {
  const item = await ContactMessage.findById(req.params.id);
  if (!item) return next(new AppError('Message not found', 404));
  if (item.status === 'unread') {
    item.status = 'read';
    await item.save({ validateBeforeSave: false });
  }
  res.json({ success: true, item });
});

exports.updateStatus = asyncHandler(async (req, res, next) => {
  const { status, isStarred } = req.body;
  const update = {};
  if (status) update.status = status;
  if (typeof isStarred === 'boolean') update.isStarred = isStarred;

  const item = await ContactMessage.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!item) return next(new AppError('Message not found', 404));
  res.json({ success: true, item });
});

exports.reply = asyncHandler(async (req, res, next) => {
  const { message } = req.body;
  if (!message) return next(new AppError('Reply message required', 400));

  const item = await ContactMessage.findById(req.params.id);
  if (!item) return next(new AppError('Message not found', 404));

  item.replies.push({ message, repliedBy: req.admin._id });
  item.replyStatus = 'replied';
  item.status = 'replied';
  await item.save();

  await logActivity({
    admin: req.admin,
    action: 'contact_reply',
    entity: 'ContactMessage',
    entityId: item._id,
    ipAddress: req.ip,
  });

  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('Message not found', 404));
  if (item.referenceImage?.publicId) await deleteFromCloudinary(item.referenceImage.publicId);
  res.json({ success: true, message: 'Message deleted' });
});

exports.exportCsv = asyncHandler(async (req, res) => {
  const items = await ContactMessage.find().sort('-createdAt').limit(1000).lean();
  const headers = ['name', 'email', 'phone', 'city', 'service', 'budget', 'message', 'status', 'createdAt'];
  const rows = items.map((i) =>
    headers.map((h) => `"${String(i[h] ?? '').replace(/"/g, '""')}"`).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="messages.csv"');
  res.send(csv);
});
