const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');

// Get all active services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all services (admin)
router.get('/all', protect, async (req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single service by slug
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create service
router.post('/', protect, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update service
router.put('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete service
router.delete('/:id', protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
