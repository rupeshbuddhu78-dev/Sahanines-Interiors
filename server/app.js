require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if credentials are available
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

const JWT_SECRET = process.env.JWT_SECRET || 'sahanines-secret-key-2024';
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const USE_MONGO = !!MONGODB_URI;

// MongoDB Models (only if using MongoDB)
let Admin, SiteSettings, Service, Project, Gallery, Testimonial, FAQ, Enquiry;

if (USE_MONGO) {
  Admin = require('./models/Admin');
  SiteSettings = require('./models/SiteSettings');
  Service = require('./models/Service');
  Project = require('./models/Project');
  Gallery = require('./models/Gallery');
  Testimonial = require('./models/Testimonial');
  FAQ = require('./models/FAQ');
  Enquiry = require('./models/Enquiry');
}

// Simple JSON store (fallback for local dev)
const DB_PATH = path.join(__dirname, 'data.json');
let db;

function loadDB() {
  if (USE_MONGO) return;
  try {
    if (fs.existsSync(DB_PATH)) {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch(e) {}
  if (!db) db = { settings: {}, services: [], projects: [], gallery: [], testimonials: [], faqs: [], enquiries: [], admins: [] };
}

function saveDB() {
  if (USE_MONGO) return;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function slugify(t) { return t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-'); }
function genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

// Seed data for JSON mode
function seedJSON() {
  if (USE_MONGO) return;
  loadDB();
  if (db.services && db.services.length > 0) return;

  const hashedPw = bcrypt.hashSync('admin123', 12);
  db.admins = [{ _id: genId(), name: 'Admin', email: 'admin@sahanines.com', password: hashedPw }];

  db.settings = {
    businessName: 'Sahanines Interiors', tagline: 'False Ceiling & Interior Design in Guwahati',
    logo: '', favicon: '', phone: '076360 08047', whatsapp: '917636008047', email: '',
    address: { line1: 'House No. 4, Shantipur, Ashram Road', line2: 'Jyotikuchi, Guwahati, Assam 781009', full: 'House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, Assam 781009' },
    googleMapsUrl: '', googleMapsEmbed: '', googleBusinessUrl: '', googleReviewUrl: '',
    googleRating: 5.0, googleReviewsCount: 318, plusCode: '4PGJ+R4 Guwahati, Assam',
    social: { facebook: '', instagram: '', youtube: '', twitter: '' },
    hero: { heading: 'Premium False Ceiling & Interior Solutions in Guwahati', subtitle: 'Modern false ceiling designs, gypsum and POP ceiling work, lighting solutions and professional interior finishing by Sahanines Interiors.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80', ctaPrimary: 'Get Free Quote', ctaSecondary: 'View Our Projects' },
    about: { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', headerImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80' },
    footer: { description: 'Professional false ceiling and interior solutions in Guwahati, Assam.', copyright: '© 2024 Sahanines Interiors. All rights reserved.' },
    theme: { primaryColor: '#1a1a2e', secondaryColor: '#c9a96e', accentColor: '#e8d5b7', buttonColor: '#c9a96e' },
    seo: { defaultTitle: 'Sahanines Interiors | False Ceiling & Interior Design in Guwahati', defaultDescription: 'Professional false ceiling and interior solutions in Guwahati, Assam.', ogImage: '', googleVerification: '', analyticsId: '', searchConsoleVerification: '' }
  };

  db.services = [
    { _id: genId(), name: 'False Ceiling', slug: 'false-ceiling', shortDescription: 'Modern false ceiling solutions for homes and offices.', description: 'Our false ceiling solutions transform spaces into elegant environments with improved insulation and integrated lighting.', image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', altText: 'False ceiling Guwahati', benefits: ['Enhanced aesthetics', 'Improved insulation', 'Concealed wiring'], applications: ['Living rooms', 'Bedrooms', 'Offices'], faqs: [{ question: 'What is a false ceiling?', answer: 'A secondary ceiling installed below the main ceiling.' }], seoTitle: 'False Ceiling in Guwahati', seoDescription: 'Professional false ceiling installation.', isActive: true, sortOrder: 1, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Gypsum False Ceiling', slug: 'gypsum-false-ceiling', shortDescription: 'Elegant gypsum ceiling designs.', description: 'Premium gypsum ceilings with smooth finish and modern lighting integration.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', altText: 'Gypsum ceiling', benefits: ['Smooth finish', 'Fire resistant', 'Easy maintenance'], applications: ['Bedrooms', 'Living rooms'], faqs: [], seoTitle: 'Gypsum Ceiling Guwahati', seoDescription: 'Gypsum ceiling installation.', isActive: true, sortOrder: 2, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'POP False Ceiling', slug: 'pop-false-ceiling', shortDescription: 'Custom POP ceiling designs.', description: 'Intricate POP designs for decorative interiors.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', altText: 'POP ceiling', benefits: ['Custom designs', 'Cost-effective'], applications: ['Drawing rooms', 'Halls'], faqs: [], seoTitle: 'POP Ceiling Guwahati', seoDescription: 'POP ceiling work.', isActive: true, sortOrder: 3, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Ceiling Lighting', slug: 'ceiling-lighting', shortDescription: 'LED and concealed lighting solutions.', description: 'Comprehensive lighting solutions including LED strips and cove lighting.', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', altText: 'Ceiling lighting', benefits: ['Energy efficient', 'Ambient lighting'], applications: ['All rooms'], faqs: [], seoTitle: 'Ceiling Lighting Guwahati', seoDescription: 'Lighting installation.', isActive: true, sortOrder: 4, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Interior Ceiling Design', slug: 'interior-ceiling-design', shortDescription: 'Custom ceiling designs.', description: 'Tailored ceiling designs for your space.', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', altText: 'Interior design', benefits: ['Customized', 'Professional consultation'], applications: ['All spaces'], faqs: [], seoTitle: 'Interior Design Guwahati', seoDescription: 'Interior ceiling design.', isActive: true, sortOrder: 5, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Residential False Ceiling', slug: 'residential-false-ceiling', shortDescription: 'Home ceiling solutions.', description: 'Complete residential false ceiling work.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', altText: 'Residential ceiling', benefits: ['Room-specific', 'Enhanced aesthetics'], applications: ['Bedrooms', 'Living rooms', 'Kitchens'], faqs: [], seoTitle: 'Residential Ceiling Guwahati', seoDescription: 'Home ceiling work.', isActive: true, sortOrder: 6, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Commercial False Ceiling', slug: 'commercial-false-ceiling', shortDescription: 'Commercial ceiling solutions.', description: 'Professional ceilings for offices and shops.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', altText: 'Commercial ceiling', benefits: ['Professional', 'Scalable'], applications: ['Offices', 'Shops'], faqs: [], seoTitle: 'Commercial Ceiling Guwahati', seoDescription: 'Commercial ceiling work.', isActive: true, sortOrder: 7, createdAt: new Date().toISOString() }
  ];

  db.projects = [
    { _id: genId(), title: 'Modern Living Room', slug: 'modern-living-room', category: 'False Ceiling', location: 'Jyotikuchi, Guwahati', description: 'Modern ceiling with LED lighting.', coverImage: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', altText: 'Living room', isFeatured: true, isActive: true, sortOrder: 1, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Gypsum Bedroom', slug: 'gypsum-bedroom', category: 'Gypsum Ceiling', location: 'Shantipur, Guwahati', description: 'Elegant gypsum ceiling.', coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', altText: 'Bedroom', isFeatured: true, isActive: true, sortOrder: 2, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Office Cabin', slug: 'office-cabin', category: 'Commercial', location: 'GS Road, Guwahati', description: 'Professional office ceiling.', coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', altText: 'Office', isFeatured: true, isActive: true, sortOrder: 3, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'POP Design', slug: 'pop-design', category: 'POP Ceiling', location: 'Dispur, Guwahati', description: 'Decorative POP ceiling.', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', altText: 'POP', isActive: true, sortOrder: 4, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'LED Lighting', slug: 'led-lighting', category: 'Lighting', location: 'Khanapara, Guwahati', description: 'Integrated LED lighting.', coverImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', altText: 'LED', isFeatured: true, isActive: true, sortOrder: 5, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Apartment Work', slug: 'apartment-work', category: 'Residential', location: 'Aminjari, Guwahati', description: 'Complete apartment ceiling.', coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', altText: 'Apartment', isActive: true, sortOrder: 6, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Showroom Design', slug: 'showroom-design', category: 'Commercial', location: 'Fancy Bazar, Guwahati', description: 'Retail showroom ceiling.', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', altText: 'Showroom', isActive: true, sortOrder: 7, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Dining Room', slug: 'dining-room', category: 'Residential', location: 'Christianbasti, Guwahati', description: 'Elegant dining ceiling.', coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', altText: 'Dining', isActive: true, sortOrder: 8, createdAt: new Date().toISOString() }
  ];

  db.gallery = [
    { _id: genId(), image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', title: 'Modern Design', category: 'False Ceiling', altText: 'Modern', isActive: true, sortOrder: 1 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', title: 'Luxury Interior', category: 'Residential', altText: 'Luxury', isActive: true, sortOrder: 2 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', title: 'Elegant Ceiling', category: 'POP Ceiling', altText: 'Elegant', isActive: true, sortOrder: 3 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', title: 'Bedroom', category: 'Gypsum Ceiling', altText: 'Bedroom', isActive: true, sortOrder: 4 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', title: 'Lighting', category: 'Lighting', altText: 'Lighting', isActive: true, sortOrder: 5 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', title: 'Office', category: 'Commercial', altText: 'Office', isActive: true, sortOrder: 6 }
  ];

  db.testimonials = [
    { _id: genId(), name: 'Rahul S.', review: 'Excellent service and quality materials. Highly recommended!', rating: 5, isPublished: true, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Priyam D.', review: 'Finished on time with clean work. Very professional.', rating: 5, isPublished: true, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Ankita M.', review: 'Perfect lighting work, adds a classy vibe to our home.', rating: 5, isPublished: true, createdAt: new Date().toISOString() }
  ];

  db.faqs = [
    { _id: genId(), question: 'What is a false ceiling?', answer: 'A secondary ceiling installed below the main ceiling for aesthetics and functionality.', isPublished: true, sortOrder: 1 },
    { _id: genId(), question: 'What types do you provide?', answer: 'Gypsum, POP, and designer ceiling solutions.', isPublished: true, sortOrder: 2 },
    { _id: genId(), question: 'Do you provide gypsum work?', answer: 'Yes, we specialize in gypsum ceiling installation.', isPublished: true, sortOrder: 3 },
    { _id: genId(), question: 'Do you provide POP work?', answer: 'Yes, custom POP designs for decorative interiors.', isPublished: true, sortOrder: 4 },
    { _id: genId(), question: 'Can you integrate LED lighting?', answer: 'Yes, we specialize in LED integration.', isPublished: true, sortOrder: 5 },
    { _id: genId(), question: 'How to get a quotation?', answer: 'Call 076360 08047 or use the contact form.', isPublished: true, sortOrder: 6 },
    { _id: genId(), question: 'Which areas do you serve?', answer: 'All areas of Guwahati and nearby.', isPublished: true, sortOrder: 7 }
  ];

  db.enquiries = [];
  saveDB();
  console.log('JSON database seeded');
}

// Seed MongoDB
async function seedMongo() {
  if (!USE_MONGO) return;
  
  const adminExists = await Admin.findOne({ email: 'admin@sahanines.com' });
  if (adminExists) return;

  await Admin.create({ name: 'Admin', email: 'admin@sahanines.com', password: 'admin123' });
  
  await SiteSettings.create({
    businessName: 'Sahanines Interiors',
    phone: '076360 08047',
    whatsapp: '917636008047',
    address: { full: 'House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, Assam 781009' },
    googleRating: 5.0,
    googleReviewsCount: 318,
    hero: {
      heading: 'Premium False Ceiling & Interior Solutions in Guwahati',
      subtitle: 'Modern false ceiling designs, gypsum and POP ceiling work, lighting solutions and professional interior finishing.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80'
    }
  });

  await Service.create([
    { name: 'False Ceiling', slug: 'false-ceiling', shortDescription: 'Modern false ceiling solutions.', description: 'Professional false ceiling installation.', image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', isActive: true, sortOrder: 1 },
    { name: 'Gypsum False Ceiling', slug: 'gypsum-false-ceiling', shortDescription: 'Elegant gypsum designs.', description: 'Premium gypsum ceilings.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', isActive: true, sortOrder: 2 },
    { name: 'POP False Ceiling', slug: 'pop-false-ceiling', shortDescription: 'Custom POP designs.', description: 'Decorative POP ceilings.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', isActive: true, sortOrder: 3 },
    { name: 'Ceiling Lighting', slug: 'ceiling-lighting', shortDescription: 'LED lighting solutions.', description: 'Integrated lighting.', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', isActive: true, sortOrder: 4 },
    { name: 'Interior Ceiling Design', slug: 'interior-ceiling-design', shortDescription: 'Custom designs.', description: 'Tailored ceiling designs.', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', isActive: true, sortOrder: 5 },
    { name: 'Residential False Ceiling', slug: 'residential-false-ceiling', shortDescription: 'Home solutions.', description: 'Residential ceiling work.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', isActive: true, sortOrder: 6 },
    { name: 'Commercial False Ceiling', slug: 'commercial-false-ceiling', shortDescription: 'Commercial solutions.', description: 'Office and shop ceilings.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', isActive: true, sortOrder: 7 }
  ]);

  console.log('MongoDB seeded');
}

// Express app
const app = express();
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: (r,f,cb) => cb(null, uploadDir), filename: (r,f,cb) => cb(null, Date.now() + '-' + Math.round(Math.random()*1E9) + path.extname(f.originalname)) });
const upload = multer({ storage, fileFilter: (r,f,cb) => { if (/jpeg|jpg|png|webp/.test(path.extname(f.originalname).toLowerCase())) cb(null,true); else cb(new Error('Only images allowed')); }, limits: { fileSize: 5*1024*1024 } });
app.use('/uploads', express.static(uploadDir));

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try { jwt.verify(token, JWT_SECRET); next(); } catch(e) { res.status(401).json({ success: false, message: 'Not authorized' }); }
}

// === API ROUTES ===

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (USE_MONGO) {
    const admin = await Admin.findOne({ email });
    if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, admin: { name: admin.name, email: admin.email } });
  } else {
    const admin = db.admins.find(a => a.email === email);
    if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, admin: { name: admin.name, email: admin.email } });
  }
});

// Settings
app.get('/api/settings', async (req, res) => {
  if (USE_MONGO) {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, settings });
  } else {
    res.json({ success: true, settings: db.settings });
  }
});

app.put('/api/settings', auth, async (req, res) => {
  if (USE_MONGO) {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };
    deepMerge(settings, req.body);
    await settings.save();
    res.json({ success: true, settings });
  } else {
    const merge = (target, source) => { for (const k in source) { if (typeof source[k] === 'object' && source[k] !== null && !Array.isArray(source[k])) { if (!target[k]) target[k] = {}; merge(target[k], source[k]); } else { target[k] = source[k]; } } };
    merge(db.settings, req.body);
    saveDB();
    res.json({ success: true, settings: db.settings });
  }
});

// Services
app.get('/api/services', async (req, res) => {
  if (USE_MONGO) {
    const services = await Service.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, services });
  } else {
    res.json({ success: true, services: db.services.filter(s => s.isActive).sort((a,b) => a.sortOrder - b.sortOrder) });
  }
});

app.get('/api/services/all', auth, async (req, res) => {
  if (USE_MONGO) {
    const services = await Service.find().sort({ sortOrder: 1 });
    res.json({ success: true, services });
  } else {
    res.json({ success: true, services: db.services.sort((a,b) => a.sortOrder - b.sortOrder) });
  }
});

app.get('/api/services/:slug', async (req, res) => {
  if (USE_MONGO) {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, service });
  } else {
    const s = db.services.find(s => s.slug === req.params.slug);
    if (!s) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, service: s });
  }
});

app.post('/api/services', auth, async (req, res) => {
  if (USE_MONGO) {
    const service = await Service.create({ ...req.body, slug: slugify(req.body.name) });
    res.json({ success: true, service });
  } else {
    const s = { _id: genId(), ...req.body, slug: slugify(req.body.name), createdAt: new Date().toISOString() };
    db.services.push(s);
    saveDB();
    res.json({ success: true, service: s });
  }
});

app.put('/api/services/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, service });
  } else {
    const i = db.services.findIndex(s => s._id === req.params.id);
    if (i === -1) return res.status(404).json({ success: false });
    if (req.body.name) req.body.slug = slugify(req.body.name);
    db.services[i] = { ...db.services[i], ...req.body };
    saveDB();
    res.json({ success: true, service: db.services[i] });
  }
});

app.delete('/api/services/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    await Service.findByIdAndDelete(req.params.id);
  } else {
    db.services = db.services.filter(s => s._id !== req.params.id);
    saveDB();
  }
  res.json({ success: true });
});

// Projects
app.get('/api/projects', async (req, res) => {
  if (USE_MONGO) {
    let filter = { isActive: true };
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    const projects = await Project.find(filter).sort({ sortOrder: 1 });
    res.json({ success: true, projects });
  } else {
    let p = db.projects.filter(p => p.isActive);
    if (req.query.category && req.query.category !== 'All') p = p.filter(p => p.category === req.query.category);
    res.json({ success: true, projects: p.sort((a,b) => a.sortOrder - b.sortOrder) });
  }
});

app.get('/api/projects/all', auth, async (req, res) => {
  if (USE_MONGO) {
    const projects = await Project.find().sort({ sortOrder: 1 });
    res.json({ success: true, projects });
  } else {
    res.json({ success: true, projects: db.projects.sort((a,b) => a.sortOrder - b.sortOrder) });
  }
});

app.get('/api/projects/:slug', async (req, res) => {
  if (USE_MONGO) {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ success: false });
    res.json({ success: true, project });
  } else {
    const p = db.projects.find(p => p.slug === req.params.slug);
    if (!p) return res.status(404).json({ success: false });
    res.json({ success: true, project: p });
  }
});

app.post('/api/projects', auth, async (req, res) => {
  if (USE_MONGO) {
    const project = await Project.create({ ...req.body, slug: slugify(req.body.title) });
    res.json({ success: true, project });
  } else {
    const p = { _id: genId(), ...req.body, slug: slugify(req.body.title), createdAt: new Date().toISOString() };
    db.projects.push(p);
    saveDB();
    res.json({ success: true, project: p });
  }
});

app.put('/api/projects/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, project });
  } else {
    const i = db.projects.findIndex(p => p._id === req.params.id);
    if (i === -1) return res.status(404).json({ success: false });
    if (req.body.title) req.body.slug = slugify(req.body.title);
    db.projects[i] = { ...db.projects[i], ...req.body };
    saveDB();
    res.json({ success: true, project: db.projects[i] });
  }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    await Project.findByIdAndDelete(req.params.id);
  } else {
    db.projects = db.projects.filter(p => p._id !== req.params.id);
    saveDB();
  }
  res.json({ success: true });
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  if (USE_MONGO) {
    let filter = { isActive: true };
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    const images = await Gallery.find(filter).sort({ sortOrder: 1 });
    res.json({ success: true, images });
  } else {
    let g = db.gallery.filter(g => g.isActive);
    if (req.query.category && req.query.category !== 'All') g = g.filter(g => g.category === req.query.category);
    res.json({ success: true, images: g.sort((a,b) => a.sortOrder - b.sortOrder) });
  }
});

app.get('/api/gallery/all', auth, async (req, res) => {
  if (USE_MONGO) {
    const images = await Gallery.find().sort({ sortOrder: 1 });
    res.json({ success: true, images });
  } else {
    res.json({ success: true, images: db.gallery.sort((a,b) => a.sortOrder - b.sortOrder) });
  }
});

app.post('/api/gallery', auth, async (req, res) => {
  if (USE_MONGO) {
    const image = await Gallery.create(req.body);
    res.json({ success: true, image });
  } else {
    const g = { _id: genId(), ...req.body, createdAt: new Date().toISOString() };
    db.gallery.push(g);
    saveDB();
    res.json({ success: true, image: g });
  }
});

app.delete('/api/gallery/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    await Gallery.findByIdAndDelete(req.params.id);
  } else {
    db.gallery = db.gallery.filter(g => g._id !== req.params.id);
    saveDB();
  }
  res.json({ success: true });
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  if (USE_MONGO) {
    const testimonials = await Testimonial.find({ isPublished: true });
    res.json({ success: true, testimonials });
  } else {
    res.json({ success: true, testimonials: db.testimonials.filter(t => t.isPublished) });
  }
});

app.get('/api/testimonials/all', auth, async (req, res) => {
  if (USE_MONGO) {
    const testimonials = await Testimonial.find();
    res.json({ success: true, testimonials });
  } else {
    res.json({ success: true, testimonials: db.testimonials });
  }
});

app.post('/api/testimonials', auth, async (req, res) => {
  if (USE_MONGO) {
    const testimonial = await Testimonial.create(req.body);
    res.json({ success: true, testimonial });
  } else {
    const t = { _id: genId(), ...req.body, createdAt: new Date().toISOString() };
    db.testimonials.push(t);
    saveDB();
    res.json({ success: true, testimonial: t });
  }
});

app.put('/api/testimonials/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, testimonial });
  } else {
    const i = db.testimonials.findIndex(t => t._id === req.params.id);
    if (i === -1) return res.status(404).json({ success: false });
    db.testimonials[i] = { ...db.testimonials[i], ...req.body };
    saveDB();
    res.json({ success: true, testimonial: db.testimonials[i] });
  }
});

app.delete('/api/testimonials/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    await Testimonial.findByIdAndDelete(req.params.id);
  } else {
    db.testimonials = db.testimonials.filter(t => t._id !== req.params.id);
    saveDB();
  }
  res.json({ success: true });
});

// FAQs
app.get('/api/faqs', async (req, res) => {
  if (USE_MONGO) {
    const faqs = await FAQ.find({ isPublished: true }).sort({ sortOrder: 1 });
    res.json({ success: true, faqs });
  } else {
    res.json({ success: true, faqs: db.faqs.filter(f => f.isPublished).sort((a,b) => a.sortOrder - b.sortOrder) });
  }
});

app.get('/api/faqs/all', auth, async (req, res) => {
  if (USE_MONGO) {
    const faqs = await FAQ.find().sort({ sortOrder: 1 });
    res.json({ success: true, faqs });
  } else {
    res.json({ success: true, faqs: db.faqs.sort((a,b) => a.sortOrder - b.sortOrder) });
  }
});

app.post('/api/faqs', auth, async (req, res) => {
  if (USE_MONGO) {
    const faq = await FAQ.create(req.body);
    res.json({ success: true, faq });
  } else {
    const f = { _id: genId(), ...req.body, createdAt: new Date().toISOString() };
    db.faqs.push(f);
    saveDB();
    res.json({ success: true, faq: f });
  }
});

app.put('/api/faqs/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, faq });
  } else {
    const i = db.faqs.findIndex(f => f._id === req.params.id);
    if (i === -1) return res.status(404).json({ success: false });
    db.faqs[i] = { ...db.faqs[i], ...req.body };
    saveDB();
    res.json({ success: true, faq: db.faqs[i] });
  }
});

app.delete('/api/faqs/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    await FAQ.findByIdAndDelete(req.params.id);
  } else {
    db.faqs = db.faqs.filter(f => f._id !== req.params.id);
    saveDB();
  }
  res.json({ success: true });
});

// Enquiries
app.post('/api/enquiries', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone required' });
  
  if (USE_MONGO) {
    const enquiry = await Enquiry.create({ ...req.body, status: 'New' });
    res.json({ success: true, enquiry });
  } else {
    const e = { _id: genId(), ...req.body, status: 'New', createdAt: new Date().toISOString() };
    db.enquiries.push(e);
    saveDB();
    res.json({ success: true, enquiry: e });
  }
});

app.get('/api/enquiries', auth, async (req, res) => {
  if (USE_MONGO) {
    let filter = {};
    if (req.query.status) filter.status = req.query.status;
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, enquiries, total: enquiries.length });
  } else {
    let e = db.enquiries;
    if (req.query.status) e = e.filter(x => x.status === req.query.status);
    res.json({ success: true, enquiries: e.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)), total: e.length });
  }
});

app.put('/api/enquiries/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, enquiry });
  } else {
    const i = db.enquiries.findIndex(e => e._id === req.params.id);
    if (i === -1) return res.status(404).json({ success: false });
    db.enquiries[i] = { ...db.enquiries[i], ...req.body };
    saveDB();
    res.json({ success: true, enquiry: db.enquiries[i] });
  }
});

app.delete('/api/enquiries/:id', auth, async (req, res) => {
  if (USE_MONGO) {
    await Enquiry.findByIdAndDelete(req.params.id);
  } else {
    db.enquiries = db.enquiries.filter(e => e._id !== req.params.id);
    saveDB();
  }
  res.json({ success: true });
});

// Upload
app.post('/api/upload', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  
  try {
    // If Cloudinary is configured, upload to Cloudinary
    if (isCloudinaryConfigured()) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'sahanines-interiors',
        resource_type: 'image'
      });
      
      // Delete local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
      
      res.json({ 
        success: true, 
        url: result.secure_url, 
        filename: result.public_id,
        storage: 'cloudinary'
      });
    } else {
      // Fallback to local storage if Cloudinary not configured
      res.json({ 
        success: true, 
        url: `/uploads/${req.file.filename}`, 
        filename: req.file.filename,
        storage: 'local'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload error: ' + error.message });
  }
});

// Sitemap (dynamic - supplements static sitemap.xml in client/public/)
app.get('/sitemap.xml', async (req, res) => {
  const base = process.env.SITE_URL || 'https://best-false-ceiling-specialist-of-guwahati-sahaninesinteriors.in';
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/projects', priority: '0.8', changefreq: 'weekly' },
    { path: '/gallery', priority: '0.7', changefreq: 'weekly' },
    { path: '/reviews', priority: '0.8', changefreq: 'monthly' },
    { path: '/faq', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.9', changefreq: 'monthly' }
  ];
  staticPages.forEach(p => { xml += `  <url><loc>${base}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>\n`; });
  
  if (USE_MONGO) {
    const services = await Service.find({ isActive: true });
    services.forEach(s => { xml += `  <url><loc>${base}/services/${s.slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`; });
  } else {
    db.services.filter(s => s.isActive).forEach(s => { xml += `  <url><loc>${base}/services/${s.slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`; });
  }
  
  xml += '</urlset>';
  res.header('Content-Type', 'application/xml').send(xml);
});

// Domain redirect: if accessed via old Render URL, redirect to production domain
app.use((req, res, next) => {
  const host = req.headers.host;
  const productionHost = 'best-false-ceiling-specialist-of-guwahati-sahaninesinteriors.in';
  if (host && host.includes('onrender.com') && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    const newUrl = `https://${productionHost}${req.originalUrl}`;
    return res.redirect(301, newUrl);
  }
  next();
});

// Serve React build
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));
app.get(/^\/(?!api|uploads).*/, (req, res) => {
  const indexPath = path.join(clientBuild, 'index.html');
  if (fs.existsSync(indexPath)) res.sendFile(indexPath);
  else res.status(404).send('Not found');
});

// Error handler
app.use((err, req, res, next) => { console.error(err.message); res.status(500).json({ success: false, message: 'Server error' }); });

// Start server
async function start() {
  if (USE_MONGO) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDB connected');
      await seedMongo();
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    }
  } else {
    seedJSON();
  }
  
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (${USE_MONGO ? 'MongoDB' : 'JSON'} mode)`));
}

start();
