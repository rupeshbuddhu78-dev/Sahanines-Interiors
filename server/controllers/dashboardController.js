const Gallery = require('../models/Gallery');
const BeforeAfterProject = require('../models/BeforeAfterProject');
const Booking = require('../models/Booking');
const ContactMessage = require('../models/ContactMessage');
const Visitor = require('../models/Visitor');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const asyncHandler = require('../utils/asyncHandler');

exports.overview = asyncHandler(async (req, res) => {
  const [
    totalImages,
    totalProjects,
    totalBookings,
    totalContacts,
    unreadMessages,
    totalVisitors,
    pendingBookings,
  ] = await Promise.all([
    Gallery.countDocuments(),
    BeforeAfterProject.countDocuments(),
    Booking.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: 'unread' }),
    Visitor.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
  ]);

  res.json({
    success: true,
    stats: {
      totalImages,
      totalProjects,
      totalBookings,
      totalContacts,
      unreadMessages,
      totalVisitors,
      pendingBookings,
    },
  });
});

exports.charts = asyncHandler(async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthly = async (Model) =>
    Model.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]);

  const [bookings, visitors, contacts] = await Promise.all([
    monthly(Booking),
    Visitor.aggregate([
      { $match: { date: { $gte: start } } },
      {
        $group: {
          _id: { y: { $year: '$date' }, m: { $month: '$date' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]),
    monthly(ContactMessage),
  ]);

  const labels = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    labels.push(d.toLocaleString('en', { month: 'short', year: '2-digit' }));
  }

  const shape = (arr) => {
    const map = new Map();
    arr.forEach((r) => map.set(`${r._id.y}-${r._id.m}`, r.count));
    const data = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      data.push(map.get(`${d.getFullYear()}-${d.getMonth() + 1}`) || 0);
    }
    return data;
  };

  const bookingByStatus = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    labels,
    bookings: shape(bookings),
    visitors: shape(visitors),
    contacts: shape(contacts),
    bookingByStatus,
  });
});

exports.recentActivity = asyncHandler(async (req, res) => {
  const items = await ActivityLog.find().sort('-createdAt').limit(20);
  res.json({ success: true, items });
});

exports.notifications = asyncHandler(async (req, res) => {
  const items = await Notification.find().sort('-createdAt').limit(50);
  const unread = await Notification.countDocuments({ isRead: false });
  res.json({ success: true, unread, items });
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.json({ success: true });
});
