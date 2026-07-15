const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { deleteFromCloudinary } = require('../config/cloudinary');

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

exports.listPublic = asyncHandler(async (req, res) => {
  const items = await Service.find({ isActive: true }).sort('order title');
  res.json({ success: true, items });
});

exports.getPublicBySlug = asyncHandler(async (req, res, next) => {
  const item = await Service.findOne({ slug: req.params.slug, isActive: true });
  if (!item) return next(new AppError('Service not found', 404));
  res.json({ success: true, item });
});

exports.listAll = asyncHandler(async (req, res) => {
  const items = await Service.find().sort('order title');
  res.json({ success: true, items });
});

exports.get = asyncHandler(async (req, res, next) => {
  const item = await Service.findById(req.params.id);
  if (!item) return next(new AppError('Service not found', 404));
  res.json({ success: true, item });
});

exports.create = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (!data.slug && data.title) data.slug = slugify(data.title);
  const item = await Service.create(data);
  res.status(201).json({ success: true, item });
});

exports.update = asyncHandler(async (req, res, next) => {
  const data = { ...req.body };
  if (data.title && !data.slug) data.slug = slugify(data.title);
  const item = await Service.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!item) return next(new AppError('Service not found', 404));
  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await Service.findById(req.params.id);
  if (!item) return next(new AppError('Service not found', 404));
  if (item.banner?.publicId) await deleteFromCloudinary(item.banner.publicId);
  for (const g of item.gallery || []) {
    if (g.publicId) await deleteFromCloudinary(g.publicId);
  }
  await item.deleteOne();
  res.json({ success: true, message: 'Service deleted' });
});

exports.uploadBanner = asyncHandler(async (req, res, next) => {
  const item = await Service.findById(req.params.id);
  if (!item) return next(new AppError('Service not found', 404));
  if (!req.file) return next(new AppError('No file uploaded', 400));
  if (item.banner?.publicId) await deleteFromCloudinary(item.banner.publicId);
  item.banner = {
    url: req.file.path,
    publicId: req.file.filename,
    folder: req.file.folder,
    width: req.file.width,
    height: req.file.height,
    format: req.file.format,
    createdTime: new Date(),
  };
  await item.save();
  res.json({ success: true, item });
});

exports.uploadGallery = asyncHandler(async (req, res, next) => {
  const item = await Service.findById(req.params.id);
  if (!item) return next(new AppError('Service not found', 404));
  if (!req.files?.length) return next(new AppError('No images uploaded', 400));
  item.gallery.push(
    ...req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      folder: file.folder,
      width: file.width,
      height: file.height,
      format: file.format,
      createdTime: new Date(),
    }))
  );
  await item.save();
  res.json({ success: true, item });
});

exports.removeGalleryImage = asyncHandler(async (req, res, next) => {
  const item = await Service.findById(req.params.id);
  if (!item) return next(new AppError('Service not found', 404));
  const index = Number(req.params.index);
  if (!Number.isInteger(index) || index < 0 || index >= item.gallery.length) {
    return next(new AppError('Gallery image not found', 404));
  }
  const [removed] = item.gallery.splice(index, 1);
  if (removed?.publicId) await deleteFromCloudinary(removed.publicId);
  await item.save();
  res.json({ success: true, item });
});
