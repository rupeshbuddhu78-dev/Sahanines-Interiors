const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const auth = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  authLimiter,
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  validate,
  auth.login
);

router.post('/logout', auth.logout);
router.post('/forgot-password', authLimiter, body('email').isEmail(), validate, auth.forgotPassword);
router.post('/reset-password', authLimiter, auth.resetPassword);

router.use(protect);
router.get('/me', auth.me);
router.patch('/change-password', auth.changePassword);
router.patch('/profile', auth.updateProfile);

module.exports = router;
