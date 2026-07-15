const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadFactory } = require('../config/cloudinary');
const ctrl = require('../controllers/testimonialController');

const router = express.Router();
const upload = uploadFactory('testimonials');

router.get('/', ctrl.listPublic);

router.use(protect);
router.get('/admin/all', ctrl.listAll);
router.post(
  '/admin',
  upload.fields([
    { name: 'customerImage', maxCount: 1 },
    { name: 'projectImage', maxCount: 1 },
  ]),
  ctrl.create
);
router.patch('/admin/:id', ctrl.update);
router.delete('/admin/:id', ctrl.remove);

module.exports = router;
