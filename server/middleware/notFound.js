const path = require('path');

// For API routes: return JSON 404
// For everything else: serve 404.html
module.exports = (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `Route not found: ${req.originalUrl}`,
    });
  }
  res
    .status(404)
    .sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'pages', '404.html'));
};
