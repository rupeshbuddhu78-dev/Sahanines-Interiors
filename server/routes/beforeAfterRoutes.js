const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadFactory } = require('../config/cloudinary');
const ctrl = require('../controllers/beforeAfterController');

const router = express.Router();
const upload = uploadFactory('before-after');

router.get('/', ctrl.listPublic);
router.get('/:id', ctrl.getPublic);

router.use(protect);
router.get('/admin/all', ctrl.listAll);
router.post(
  '/admin/create',
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 },
  ]),
  ctrl.create
);
router.patch('/admin/:id', ctrl.update);
router.delete('/admin/:id', ctrl.remove);

module.exports = router;
