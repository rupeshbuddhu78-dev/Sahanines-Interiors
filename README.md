# Sahanines Interiors — Production MERN Website

Multi-page Express/MongoDB/Cloudinary website for an interior design company with a secure admin dashboard.

## Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Node.js, Express.js MVC REST API
- Database: MongoDB Atlas + Mongoose
- Image storage: Cloudinary
- Auth: JWT + bcrypt
- Deployment: Render (`render.yaml` included)

## Main Routes

- Website: `/`, `/about.html`, `/services.html`, `/gallery.html`, `/projects.html`, `/testimonials.html`, `/faq.html`, `/contact.html`, `/privacy-policy.html`, `/terms.html` (pretty URLs like `/about` also work in Express)
- Admin: `/admin/login`, `/admin/dashboard`
- API: `/api/*`

## Setup

1. Copy `.env.example` to `.env` and fill MongoDB Atlas, Cloudinary and JWT values.
2. Install dependencies: `npm install`
3. Seed initial admin/content: `npm run seed`
4. Start production server: `npm start`

Default seed admin is controlled by `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`.

## Admin Features

Dashboard statistics, charts, activity logs, notifications, website settings, Cloudinary logo/hero uploads, gallery management, before/after projects, bookings, contact messages with CSV export, services, testimonials, FAQs, admin users, profile and password management.

## Security

Helmet secure headers, rate limiting, Mongo sanitize, XSS cleaning, HPP protection, JWT auth, bcrypt hashing, same-origin CSRF guard for cookie-auth writes, validation middleware and centralized error handling.

Never commit real `.env` values.
