const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimit');
const { uploadFactory } = require('../config/cloudinary');
const ctrl = require('../controllers/contactController');

const router = express.Router();
const upload = uploadFactory('contact');

router.post(
  '/',
  formLimiter,
  upload.single('referenceImage'),
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('phone').trim().isLength({ min: 6, max: 20 }),
  body('email').isEmail(),
  body('message').trim().isLength({ min: 5, max: 5000 }),
  validate,
  ctrl.create
);

router.use(protect);
router.get('/', ctrl.list);
router.get('/export.csv', ctrl.exportCsv);
router.get('/:id', ctrl.get);
router.patch('/:id/status', ctrl.updateStatus);
router.post('/:id/reply', ctrl.reply);
router.delete('/:id', ctrl.remove);

module.exports = router;
