const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth');

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update settings (admin)
router.put('/', protect, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();
    const update = (obj, data) => {
      for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
          if (!obj[key]) obj[key] = {};
          update(obj[key], data[key]);
        } else {
          obj[key] = data[key];
        }
      }
    };
    update(settings, req.body);
    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
