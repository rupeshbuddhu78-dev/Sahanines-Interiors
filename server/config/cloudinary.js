const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER = 'sahanines',
} = process.env;

const isConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('[Cloudinary] Configured');
} else {
  console.warn('[Cloudinary] Not configured - image uploads will fail');
}

const buildStorage = (subfolder = 'gallery') =>
  new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: `${CLOUDINARY_FOLDER}/${subfolder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'],
      transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
      public_id: `${Date.now()}-${file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()}`,
    }),
  });

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp|avif|svg/;
  const mime = allowed.test(file.mimetype);
  const ext = allowed.test(file.originalname.split('.').pop().toLowerCase());
  if (mime && ext) return cb(null, true);
  cb(new Error('Only image files (jpg, jpeg, png, webp, avif, svg) are allowed'));
};

const uploadFactory = (subfolder = 'gallery', limits = { fileSize: 5 * 1024 * 1024 }) => {
  if (!isConfigured) {
    // In non-configured mode, return a middleware that rejects uploads cleanly.
    return {
      single: () => (req, res) =>
        res.status(503).json({
          success: false,
          message: 'Cloudinary is not configured. Set CLOUDINARY_* env vars.',
        }),
      array: () => (req, res) =>
        res.status(503).json({
          success: false,
          message: 'Cloudinary is not configured. Set CLOUDINARY_* env vars.',
        }),
      fields: () => (req, res) =>
        res.status(503).json({
          success: false,
          message: 'Cloudinary is not configured. Set CLOUDINARY_* env vars.',
        }),
    };
  }
  return multer({ storage: buildStorage(subfolder), fileFilter, limits });
};

const deleteFromCloudinary = async (publicId) => {
  if (!isConfigured || !publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('[Cloudinary] Delete error:', err.message);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadFactory,
  deleteFromCloudinary,
  isConfigured,
};
