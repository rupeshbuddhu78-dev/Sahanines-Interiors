const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload error' });
  }
});

router.post('/multiple', protect, upload.array('images', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No files uploaded' });
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload error' });
  }
});

router.delete('/:filename', protect, (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete error' });
  }
});

module.exports = router;
