const rateLimit = require('express-rate-limit');

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
const max = parseInt(process.env.RATE_LIMIT_MAX || '200', 10);

exports.generalLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
});

exports.formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});
