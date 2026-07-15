require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { generalLimiter } = require('./middleware/rateLimit');
const visitorTracker = require('./middleware/visitorTracker');
const csrfGuard = require('./middleware/csrfGuard');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Trust proxy (Render)
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com',
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:', 'https:', '*.cloudinary.com'],
        'connect-src': ["'self'", 'https:'],
        'frame-src': ["'self'", 'https://www.google.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Sanitization / XSS / HPP
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Compression + logging
app.use(compression());
if (!isProd) app.use(morgan('dev'));

// Rate limit for API
app.use('/api', generalLimiter);
app.use('/api', csrfGuard);

// Visitor tracking (async / non-blocking)
app.use(visitorTracker);

// Static assets
const clientDir = path.join(__dirname, '..', 'client', 'public');
app.use(express.static(clientDir, { maxAge: isProd ? '7d' : 0 }));

// API routes
app.use('/api', apiRoutes);

// robots.txt & sitemap fallback if not statically served
app.get('/robots.txt', (req, res) =>
  res.type('text/plain').sendFile(path.join(clientDir, 'robots.txt'))
);
app.get('/sitemap.xml', (req, res) =>
  res.type('application/xml').sendFile(path.join(clientDir, 'sitemap.xml'))
);

// Page routes -> serve HTML files (multi-page)
const pages = [
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/about', 'about.html'],
  ['/about.html', 'about.html'],
  ['/services', 'services.html'],
  ['/services.html', 'services.html'],
  ['/gallery', 'gallery.html'],
  ['/gallery.html', 'gallery.html'],
  ['/projects', 'projects.html'],
  ['/projects.html', 'projects.html'],
  ['/testimonials', 'testimonials.html'],
  ['/testimonials.html', 'testimonials.html'],
  ['/faq', 'faq.html'],
  ['/faq.html', 'faq.html'],
  ['/contact', 'contact.html'],
  ['/contact.html', 'contact.html'],
  ['/privacy-policy', 'privacy-policy.html'],
  ['/privacy-policy.html', 'privacy-policy.html'],
  ['/terms', 'terms.html'],
  ['/terms.html', 'terms.html'],
  ['/404.html', '404.html'],
];
pages.forEach(([route, file]) => {
  app.get(route, (req, res) => res.sendFile(path.join(clientDir, 'pages', file)));
});

// Admin pages
app.get('/admin', (req, res) => res.redirect('/admin/login'));
app.get('/admin/login', (req, res) =>
  res.sendFile(path.join(clientDir, 'pages', 'admin', 'login.html'))
);
app.get('/admin/dashboard', (req, res) =>
  res.sendFile(path.join(clientDir, 'pages', 'admin', 'dashboard.html'))
);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

// Startup
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} on port ${PORT}`);
      console.log(`[Server] http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Startup failed:', err.message);
    process.exit(1);
  }
})();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('[UnhandledRejection]', err);
});
process.on('uncaughtException', (err) => {
  console.error('[UncaughtException]', err);
  process.exit(1);
});
