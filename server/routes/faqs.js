const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isPublished: true }).sort({ sortOrder: 1 });
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ sortOrder: 1 });
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
