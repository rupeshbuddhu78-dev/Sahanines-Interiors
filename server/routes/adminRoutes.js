const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.get('/', ctrl.list);
router.post(
  '/',
  body('name').trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8 }),
  body('role').optional().isIn(['admin', 'superadmin']),
  validate,
  ctrl.create
);
router.patch(
  '/:id',
  body('email').not().exists().withMessage('Email cannot be changed'),
  body('password').optional({ checkFalsy: true }).isLength({ min: 8 }),
  body('role').optional().isIn(['admin', 'superadmin']),
  validate,
  ctrl.update
);
router.delete('/:id', ctrl.remove);

module.exports = router;
