const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { protect } = require('../middleware/auth');

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    
    // If Cloudinary is configured, upload to Cloudinary
    if (isCloudinaryConfigured()) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'sahanines-interiors',
        resource_type: 'image'
      });
      
      // Delete local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
      
      res.json({ 
        success: true, 
        url: result.secure_url, 
        filename: result.public_id,
        storage: 'cloudinary'
      });
    } else {
      // Fallback to local storage if Cloudinary not configured
      const url = `/uploads/${req.file.filename}`;
      res.json({ success: true, url, filename: req.file.filename, storage: 'local' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload error: ' + error.message });
  }
});

router.post('/multiple', protect, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No files uploaded' });
    
    if (isCloudinaryConfigured()) {
      const uploadPromises = req.files.map(file => 
        cloudinary.uploader.upload(file.path, {
          folder: 'sahanines-interiors',
          resource_type: 'image'
        }).then(result => {
          fs.unlinkSync(file.path);
          return result.secure_url;
        })
      );
      
      const urls = await Promise.all(uploadPromises);
      res.json({ success: true, urls, storage: 'cloudinary' });
    } else {
      const urls = req.files.map(f => `/uploads/${f.filename}`);
      res.json({ success: true, urls, storage: 'local' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload error: ' + error.message });
  }
});

router.delete('/:filename', protect, async (req, res) => {
  try {
    // If it's a Cloudinary URL (contains cloudinary.com)
    if (req.params.filename.includes('cloudinary.com') || req.params.filename.startsWith('sahanines-interiors/')) {
      const publicId = req.params.filename.includes('cloudinary.com') 
        ? req.params.filename.split('/').pop().split('.')[0]
        : req.params.filename;
      
      await cloudinary.uploader.destroy(`sahanines-interiors/${publicId}`);
      res.json({ success: true, message: 'File deleted from Cloudinary' });
    } else {
      // Local file deletion
      const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.json({ success: true, message: 'File deleted' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Delete error' });
  }
});

module.exports = router;
