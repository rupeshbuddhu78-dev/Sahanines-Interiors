const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/settings', require('./settingsRoutes'));
router.use('/gallery', require('./galleryRoutes'));
router.use('/before-after', require('./beforeAfterRoutes'));
router.use('/bookings', require('./bookingRoutes'));
router.use('/contact', require('./contactRoutes'));
router.use('/services', require('./serviceRoutes'));
router.use('/testimonials', require('./testimonialRoutes'));
router.use('/faqs', require('./faqRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/admins', require('./adminRoutes'));

router.get('/health', (req, res) =>
  res.json({ success: true, status: 'ok', time: new Date().toISOString() })
);

module.exports = router;
