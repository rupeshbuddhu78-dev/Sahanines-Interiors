const crypto = require('crypto');
const Visitor = require('../models/Visitor');

// Lightweight visitor tracking - fires once per unique visitor+path per session (client sets cookie)
module.exports = async (req, res, next) => {
  // Only track HTML page loads
  const accept = req.headers.accept || '';
  if (!accept.includes('text/html')) return next();
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/admin')) return next();

  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 24);
    Visitor.create({
      ipHash,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || req.headers.referrer,
      path: req.originalUrl.split('?')[0],
    }).catch(() => {}); // fire-and-forget
  } catch (err) {
    // Swallow — must not block request
  }
  next();
};
