const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/apiFeatures');
const logActivity = require('../utils/logActivity');
const { deleteFromCloudinary } = require('../config/cloudinary');

// PUBLIC — user submits
exports.create = asyncHandler(async (req, res, next) => {
  const {
    name, phone, email, address, preferredDate, preferredTime,
    service, budget, message, propertyType,
  } = req.body;

  if (!name || !phone || !email || !service) {
    return next(new AppError('Name, phone, email, and service are required', 400));
  }

  const referenceImages = (req.files || []).map((f) => ({
    url: f.path,
    publicId: f.filename,
    folder: f.folder,
    width: f.width,
    height: f.height,
    format: f.format,
    createdTime: new Date(),
  }));

  const booking = await Booking.create({
    name, phone, email, address,
    preferredDate: preferredDate || undefined,
    preferredTime, service, budget, message, propertyType,
    referenceImages,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  await Notification.create({
    type: 'booking',
    title: 'New Booking Request',
    message: `${booking.name} requested ${booking.service}`,
    link: `/admin/dashboard.html#bookings/${booking._id}`,
    icon: 'calendar',
    priority: 'high',
    relatedId: booking._id,
    relatedModel: 'Booking',
  });

  res.status(201).json({
    success: true,
    message: 'Your booking has been received. Our team will contact you soon.',
    bookingId: booking._id,
  });
});

// ADMIN
exports.list = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Booking.find(), req.query)
    .filter()
    .search(['name', 'email', 'phone', 'message'])
    .sort()
    .paginate();
  const items = await features.query;
  const total = await Booking.countDocuments();
  res.json({
    success: true,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    items,
  });
});

exports.get = asyncHandler(async (req, res, next) => {
  const item = await Booking.findById(req.params.id);
  if (!item) return next(new AppError('Booking not found', 404));
  res.json({ success: true, item });
});

exports.updateStatus = asyncHandler(async (req, res, next) => {
  const { status, adminNotes } = req.body;
  const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) return next(new AppError('Invalid status', 400));

  const item = await Booking.findByIdAndUpdate(
    req.params.id,
    { status, ...(adminNotes !== undefined && { adminNotes }) },
    { new: true, runValidators: true }
  );
  if (!item) return next(new AppError('Booking not found', 404));

  await logActivity({
    admin: req.admin,
    action: 'booking_status',
    entity: 'Booking',
    entityId: item._id,
    details: { status },
    ipAddress: req.ip,
  });

  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await Booking.findById(req.params.id);
  if (!item) return next(new AppError('Booking not found', 404));
  await Promise.all((item.referenceImages || []).map((i) => deleteFromCloudinary(i.publicId)));
  await item.deleteOne();
  res.json({ success: true, message: 'Booking deleted' });
});
