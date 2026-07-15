const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadFactory } = require('../config/cloudinary');
const ctrl = require('../controllers/serviceController');

const router = express.Router();
const upload = uploadFactory('services');

router.get('/', ctrl.listPublic);
router.get('/slug/:slug', ctrl.getPublicBySlug);

router.use(protect);
router.get('/admin/all', ctrl.listAll);
router.get('/admin/:id', ctrl.get);
router.post('/admin', ctrl.create);
router.patch('/admin/:id', ctrl.update);
router.delete('/admin/:id', ctrl.remove);
router.post('/admin/:id/banner', upload.single('banner'), ctrl.uploadBanner);
router.post('/admin/:id/gallery', upload.array('images', 10), ctrl.uploadGallery);
router.delete('/admin/:id/gallery/:index', ctrl.removeGalleryImage);

module.exports = router;
