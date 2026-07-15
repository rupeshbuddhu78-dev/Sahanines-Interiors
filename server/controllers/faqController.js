const Faq = require('../models/Faq');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.listPublic = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$or = [
      { question: new RegExp(req.query.search, 'i') },
      { answer: new RegExp(req.query.search, 'i') },
    ];
  }
  const items = await Faq.find(filter).sort('order -createdAt');
  res.json({ success: true, items });
});

exports.listAll = asyncHandler(async (req, res) => {
  const items = await Faq.find().sort('order -createdAt');
  res.json({ success: true, items });
});

exports.create = asyncHandler(async (req, res) => {
  const item = await Faq.create(req.body);
  res.status(201).json({ success: true, item });
});

exports.update = asyncHandler(async (req, res, next) => {
  const item = await Faq.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return next(new AppError('FAQ not found', 404));
  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await Faq.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('FAQ not found', 404));
  res.json({ success: true, message: 'FAQ deleted' });
});
