const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const msg = errors.array().map((e) => `${e.path}: ${e.msg}`).join('; ');
  return next(new AppError(msg, 400));
};
