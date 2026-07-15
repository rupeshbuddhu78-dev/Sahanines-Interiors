const Gallery = require('../models/Gallery');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/apiFeatures');
const { deleteFromCloudinary } = require('../config/cloudinary');
const logActivity = require('../utils/logActivity');

// PUBLIC
exports.listPublic = asyncHandler(async (req, res) => {
  const filter = { isHidden: false };
  if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
  if (req.query.featured === 'true') filter.isFeatured = true;

  const features = new ApiFeatures(Gallery.find(filter), req.query)
    .search(['title', 'description', 'projectName', 'location'])
    .sort()
    .paginate();

  const items = await features.query;
  const total = await Gallery.countDocuments(filter);
  res.json({
    success: true,
    total,
    page: features.pagination.page,
    limit: features.pagination.limit,
    pages: Math.ceil(total / features.pagination.limit),
    items,
  });
});

exports.getPublic = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findOne({ _id: req.params.id, isHidden: false });
  if (!item) return next(new AppError('Image not found', 404));
  item.views += 1;
  await item.save({ validateBeforeSave: false });
  res.json({ success: true, item });
});

// ADMIN
exports.listAll = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Gallery.find(), req.query)
    .filter()
    .search(['title', 'description', 'projectName', 'location'])
    .sort()
    .paginate();
  const items = await features.query;
  const total = await Gallery.countDocuments();
  res.json({
    success: true,
    total,
    page: features.pagination.page,
    limit: features.pagination.limit,
    pages: Math.ceil(total / features.pagination.limit),
    items,
  });
});

exports.upload = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.length) {
    return next(new AppError('No images uploaded', 400));
  }
  const { title, description, category, projectName, location, completionDate, tags, isFeatured } =
    req.body;

  const created = [];
  for (const file of req.files) {
    const doc = await Gallery.create({
      title: title || file.originalname,
      description,
      category: category || 'custom',
      projectName,
      location,
      completionDate: completionDate || undefined,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
      isFeatured: isFeatured === 'true' || isFeatured === true,
      image: {
        url: file.path,
        publicId: file.filename,
        folder: file.folder || undefined,
        width: file.width,
        height: file.height,
        format: file.format,
        bytes: file.bytes,
        createdTime: new Date(),
      },
    });
    created.push(doc);
  }

  await logActivity({
    admin: req.admin,
    action: 'gallery_upload',
    entity: 'Gallery',
    details: { count: created.length },
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, items: created });
});

exports.update = asyncHandler(async (req, res, next) => {
  const allowed = [
    'title',
    'description',
    'category',
    'projectName',
    'location',
    'completionDate',
    'tags',
    'isFeatured',
    'isHidden',
    'order',
  ];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  if (typeof updates.tags === 'string') {
    updates.tags = updates.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }
  const item = await Gallery.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!item) return next(new AppError('Image not found', 404));
  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) return next(new AppError('Image not found', 404));
  if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId);
  await item.deleteOne();

  await logActivity({
    admin: req.admin,
    action: 'gallery_delete',
    entity: 'Gallery',
    entityId: item._id,
    ipAddress: req.ip,
  });

  res.json({ success: true, message: 'Image deleted' });
});

exports.toggleFeatured = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) return next(new AppError('Image not found', 404));
  item.isFeatured = !item.isFeatured;
  await item.save();
  res.json({ success: true, item });
});

exports.toggleHidden = asyncHandler(async (req, res, next) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) return next(new AppError('Image not found', 404));
  item.isHidden = !item.isHidden;
  await item.save();
  res.json({ success: true, item });
});
