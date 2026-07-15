const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimit');
const { uploadFactory } = require('../config/cloudinary');
const ctrl = require('../controllers/bookingController');

const router = express.Router();
const upload = uploadFactory('bookings');

// public
router.post(
  '/',
  formLimiter,
  upload.array('referenceImages', 5),
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('phone').trim().isLength({ min: 6, max: 20 }),
  body('email').isEmail(),
  body('service').trim().notEmpty(),
  validate,
  ctrl.create
);

// admin
router.use(protect);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.patch('/:id/status', ctrl.updateStatus);
router.delete('/:id', ctrl.remove);

module.exports = router;
