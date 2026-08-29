const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/auth');

// Submit enquiry (public)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone are required' });
    const enquiry = await Enquiry.create({ name, phone, email, service, message });
    res.json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all enquiries (admin)
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Enquiry.countDocuments(filter);
    res.json({ success: true, enquiries, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update enquiry status
router.put('/:id', protect, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete enquiry
router.delete('/:id', protect, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
