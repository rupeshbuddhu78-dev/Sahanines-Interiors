const BeforeAfterProject = require('../models/BeforeAfterProject');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/apiFeatures');
const { deleteFromCloudinary } = require('../config/cloudinary');
const logActivity = require('../utils/logActivity');

exports.listPublic = asyncHandler(async (req, res) => {
  const filter = { isHidden: false };
  if (req.query.projectType && req.query.projectType !== 'all') {
    filter.projectType = req.query.projectType;
  }
  const features = new ApiFeatures(BeforeAfterProject.find(filter), req.query)
    .search(['title', 'customerName', 'location', 'description'])
    .sort()
    .paginate();
  const items = await features.query;
  const total = await BeforeAfterProject.countDocuments(filter);
  res.json({
    success: true,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    items,
  });
});

exports.getPublic = asyncHandler(async (req, res, next) => {
  const item = await BeforeAfterProject.findOne({ _id: req.params.id, isHidden: false });
  if (!item) return next(new AppError('Project not found', 404));
  res.json({ success: true, item });
});

// ADMIN
exports.listAll = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(BeforeAfterProject.find(), req.query)
    .filter()
    .search(['title', 'customerName', 'location', 'description'])
    .sort()
    .paginate();
  const items = await features.query;
  const total = await BeforeAfterProject.countDocuments();
  res.json({
    success: true,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    items,
  });
});

exports.create = asyncHandler(async (req, res, next) => {
  const files = req.files || {};
  if (!files.beforeImage?.[0] || !files.afterImage?.[0]) {
    return next(new AppError('Both before and after images are required', 400));
  }

  const mapFile = (f) => ({
    url: f.path,
    publicId: f.filename,
    folder: f.folder,
    width: f.width,
    height: f.height,
    format: f.format,
    createdTime: new Date(),
  });

  const additional = (files.additionalImages || []).map(mapFile);

  const doc = await BeforeAfterProject.create({
    title: req.body.title,
    customerName: req.body.customerName,
    location: req.body.location,
    description: req.body.description,
    projectType: req.body.projectType,
    completionDate: req.body.completionDate || undefined,
    beforeImage: mapFile(files.beforeImage[0]),
    afterImage: mapFile(files.afterImage[0]),
    additionalImages: additional,
    tags: req.body.tags
      ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map((t) => t.trim()))
      : [],
    isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
  });

  await logActivity({
    admin: req.admin,
    action: 'ba_create',
    entity: 'BeforeAfterProject',
    entityId: doc._id,
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, item: doc });
});

exports.update = asyncHandler(async (req, res, next) => {
  const allowed = [
    'title',
    'customerName',
    'location',
    'description',
    'projectType',
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
  const item = await BeforeAfterProject.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!item) return next(new AppError('Project not found', 404));
  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await BeforeAfterProject.findById(req.params.id);
  if (!item) return next(new AppError('Project not found', 404));

  const publicIds = [
    item.beforeImage?.publicId,
    item.afterImage?.publicId,
    ...(item.additionalImages || []).map((i) => i.publicId),
  ].filter(Boolean);

  await Promise.all(publicIds.map((id) => deleteFromCloudinary(id)));
  await item.deleteOne();

  await logActivity({
    admin: req.admin,
    action: 'ba_delete',
    entity: 'BeforeAfterProject',
    entityId: item._id,
    ipAddress: req.ip,
  });

  res.json({ success: true, message: 'Project deleted' });
});
