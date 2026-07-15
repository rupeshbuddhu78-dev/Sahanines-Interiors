const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadFactory } = require('../config/cloudinary');
const ctrl = require('../controllers/settingsController');

const router = express.Router();
const upload = uploadFactory('branding');

router.get('/public', ctrl.getPublicSettings);

router.use(protect);
router.get('/', ctrl.getSettings);
router.patch('/', ctrl.updateSettings);
router.post('/branding/:field', upload.single('image'), ctrl.uploadBranding);

module.exports = router;
