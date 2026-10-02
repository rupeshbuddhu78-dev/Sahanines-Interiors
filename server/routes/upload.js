const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middleware/upload');
const { videoUpload } = require('../middleware/upload');
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

router.post('/video', protect, videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No video file uploaded' });
    
    const fileSizeMB = req.file.size / (1024 * 1024);
    
    if (isCloudinaryConfigured()) {
      // Always upload to Cloudinary - use larger chunks for bigger files
      const chunkSize = fileSizeMB > 300 ? 100000000 : fileSizeMB > 100 ? 50000000 : 20000000;
      const timeout = fileSizeMB > 300 ? 1800000 : fileSizeMB > 100 ? 1200000 : 600000;
      
      console.log(`📹 Uploading video to Cloudinary (${fileSizeMB.toFixed(1)}MB, chunk: ${chunkSize/1000000}MB)...`);
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'sahanines-interiors/videos',
        resource_type: 'video',
        chunk_size: chunkSize,
        timeout: timeout
      });
      
      try { fs.unlinkSync(req.file.path); } catch(e) {}
      console.log(`✅ Video uploaded to Cloudinary: ${result.secure_url}`);
      res.json({ success: true, url: result.secure_url, filename: result.public_id, storage: 'cloudinary' });
    } else {
      const url = `/uploads/${req.file.filename}`;
      console.log(`⚠️ Cloudinary NOT configured. Video stored locally.`);
      res.json({ success: true, url, filename: req.file.filename, storage: 'local', warning: 'Cloudinary not configured. Videos stored locally will be lost on server restart.' });
    }
  } catch (error) {
    console.error('Video upload error:', error);
    try { fs.unlinkSync(req.file.path); } catch(e) {}
    res.status(500).json({ success: false, message: 'Video upload to Cloudinary failed: ' + error.message + '. Please try again or use a smaller file.' });
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
      
      await cloudinary.uploader.destroy(`sahanines-interiors/${publicId}`, { resource_type: 'video' });
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
