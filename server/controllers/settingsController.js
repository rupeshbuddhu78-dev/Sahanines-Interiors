const WebsiteSettings = require('../models/WebsiteSettings');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFromCloudinary } = require('../config/cloudinary');
const logActivity = require('../utils/logActivity');

exports.getPublicSettings = asyncHandler(async (req, res) => {
  const s = await WebsiteSettings.getSingleton();
  const {
    websiteName, companyName, tagline, logo, favicon,
    hero, about, contact, social, footer, seo, maintenanceMode, maintenanceMessage,
  } = s.toObject();
  res.json({
    success: true,
    settings: {
      websiteName, companyName, tagline, logo, favicon,
      hero, about, contact, social, footer, seo, maintenanceMode, maintenanceMessage,
    },
  });
});

exports.getSettings = asyncHandler(async (req, res) => {
  const s = await WebsiteSettings.getSingleton();
  res.json({ success: true, settings: s });
});

exports.updateSettings = asyncHandler(async (req, res) => {
  const s = await WebsiteSettings.getSingleton();
  // Merge nested objects
  Object.entries(req.body).forEach(([k, v]) => {
    if (typeof v === 'object' && v !== null && !Array.isArray(v) && s[k]?.toObject) {
      s[k] = { ...s[k].toObject(), ...v };
    } else {
      s[k] = v;
    }
  });
  await s.save();
  await logActivity({
    admin: req.admin,
    action: 'update_settings',
    entity: 'WebsiteSettings',
    entityId: s._id,
    ipAddress: req.ip,
  });
  res.json({ success: true, settings: s });
});

exports.uploadBranding = asyncHandler(async (req, res) => {
  const s = await WebsiteSettings.getSingleton();
  const field = req.params.field; // 'logo' | 'favicon' | 'heroBg' | 'ogImage'
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const image = {
    url: req.file.path,
    publicId: req.file.filename,
    folder: req.file.folder,
    width: req.file.width,
    height: req.file.height,
    format: req.file.format,
    createdTime: new Date(),
  };

  if (field === 'logo') {
    if (s.logo?.publicId) await deleteFromCloudinary(s.logo.publicId);
    s.logo = image;
  } else if (field === 'favicon') {
    if (s.favicon?.publicId) await deleteFromCloudinary(s.favicon.publicId);
    s.favicon = image;
  } else if (field === 'heroBg') {
    if (s.hero?.background?.publicId) await deleteFromCloudinary(s.hero.background.publicId);
    s.hero.background = image;
  } else if (field === 'ogImage') {
    if (s.seo?.ogImage?.publicId) await deleteFromCloudinary(s.seo.ogImage.publicId);
    s.seo.ogImage = image;
  }
  await s.save();
  res.json({ success: true, settings: s });
});
