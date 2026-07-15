const express = require('express');
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/faqController');

const router = express.Router();

router.get('/', ctrl.listPublic);

router.use(protect);
router.get('/admin/all', ctrl.listAll);
router.post('/admin', ctrl.create);
router.patch('/admin/:id', ctrl.update);
router.delete('/admin/:id', ctrl.remove);

module.exports = router;
