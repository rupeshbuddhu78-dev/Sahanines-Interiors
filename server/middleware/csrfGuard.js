// Lightweight CSRF protection for cookie-authenticated admin/API writes.
// Requests with a Bearer token are treated as API-token calls. Browser form/API
// writes that rely on cookies must come from the same origin.
module.exports = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.headers.authorization?.startsWith('Bearer ')) return next();

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const host = req.get('host');

  if (!origin && !referer) return next();

  try {
    const source = new URL(origin || referer);
    if (source.host === host) return next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid request origin.' });
  }

  return res.status(403).json({ success: false, message: 'CSRF protection: origin blocked.' });
};
