const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All') filter.category = category;
    const images = await Gallery.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    const images = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const image = await Gallery.create(req.body);
    res.json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
