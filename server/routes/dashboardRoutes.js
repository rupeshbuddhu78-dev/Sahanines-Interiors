const express = require('express');
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/dashboardController');

const router = express.Router();

router.use(protect);
router.get('/overview', ctrl.overview);
router.get('/charts', ctrl.charts);
router.get('/activity', ctrl.recentActivity);
router.get('/notifications', ctrl.notifications);
router.patch('/notifications/:id/read', ctrl.markNotificationRead);
router.patch('/notifications/read-all', ctrl.markAllRead);

module.exports = router;
