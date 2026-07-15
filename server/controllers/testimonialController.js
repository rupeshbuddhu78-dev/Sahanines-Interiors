const Testimonial = require('../models/Testimonial');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { deleteFromCloudinary } = require('../config/cloudinary');

exports.listPublic = asyncHandler(async (req, res) => {
  const items = await Testimonial.find({ isApproved: true }).sort('order -createdAt');
  res.json({ success: true, items });
});

exports.listAll = asyncHandler(async (req, res) => {
  const items = await Testimonial.find().sort('order -createdAt');
  res.json({ success: true, items });
});

exports.create = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.files?.customerImage?.[0]) {
    data.customerImage = {
      url: req.files.customerImage[0].path,
      publicId: req.files.customerImage[0].filename,
      folder: req.files.customerImage[0].folder,
      width: req.files.customerImage[0].width,
      height: req.files.customerImage[0].height,
      format: req.files.customerImage[0].format,
      createdTime: new Date(),
    };
  }
  if (req.files?.projectImage?.[0]) {
    data.projectImage = {
      url: req.files.projectImage[0].path,
      publicId: req.files.projectImage[0].filename,
      folder: req.files.projectImage[0].folder,
      width: req.files.projectImage[0].width,
      height: req.files.projectImage[0].height,
      format: req.files.projectImage[0].format,
      createdTime: new Date(),
    };
  }
  const item = await Testimonial.create(data);
  res.status(201).json({ success: true, item });
});

exports.update = asyncHandler(async (req, res, next) => {
  const data = { ...req.body };
  const item = await Testimonial.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!item) return next(new AppError('Testimonial not found', 404));
  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await Testimonial.findById(req.params.id);
  if (!item) return next(new AppError('Testimonial not found', 404));
  if (item.customerImage?.publicId) await deleteFromCloudinary(item.customerImage.publicId);
  if (item.projectImage?.publicId) await deleteFromCloudinary(item.projectImage.publicId);
  await item.deleteOne();
  res.json({ success: true, message: 'Testimonial deleted' });
});
