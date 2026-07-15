const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadFactory } = require('../config/cloudinary');
const ctrl = require('../controllers/galleryController');

const router = express.Router();
const upload = uploadFactory('gallery');

// public
router.get('/', ctrl.listPublic);
router.get('/:id', ctrl.getPublic);

// admin
router.use(protect);
router.get('/admin/all', ctrl.listAll);
router.post('/admin/upload', upload.array('images', 20), ctrl.upload);
router.patch('/admin/:id', ctrl.update);
router.patch('/admin/:id/toggle-featured', ctrl.toggleFeatured);
router.patch('/admin/:id/toggle-hidden', ctrl.toggleHidden);
router.delete('/admin/:id', ctrl.remove);

module.exports = router;
