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

// Check if MongoDB URI is configured
if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
  console.error('Please set MONGODB_URI in Render Environment Variables.');
  console.error('Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sahanines-interiors');
  process.exit(1);
}

// MongoDB Models
const Admin = require('./models/Admin');
const SiteSettings = require('./models/SiteSettings');
const Service = require('./models/Service');
const Project = require('./models/Project');
const Gallery = require('./models/Gallery');
const Testimonial = require('./models/Testimonial');
const FAQ = require('./models/FAQ');
const Enquiry = require('./models/Enquiry');

function slugify(t) { return t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-'); }

// Seed MongoDB
async function seedMongo() {
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

  console.log('✅ MongoDB seeded with default data');
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
  const admin = await Admin.findOne({ email });
  if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, admin: { name: admin.name, email: admin.email } });
});

// Settings
app.get('/api/settings', async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  res.json({ success: true, settings });
});

app.put('/api/settings', auth, async (req, res) => {
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
});

// Services
app.get('/api/services', async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json({ success: true, services });
});

app.get('/api/services/all', auth, async (req, res) => {
  const services = await Service.find().sort({ sortOrder: 1 });
  res.json({ success: true, services });
});

app.get('/api/services/:slug', async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  if (!service) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, service });
});

app.post('/api/services', auth, async (req, res) => {
  const service = await Service.create({ ...req.body, slug: slugify(req.body.name) });
  res.json({ success: true, service });
});

app.put('/api/services/:id', auth, async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, service });
});

app.delete('/api/services/:id', auth, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Projects
app.get('/api/projects', async (req, res) => {
  let filter = { isActive: true };
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  const projects = await Project.find(filter).sort({ sortOrder: 1 });
  res.json({ success: true, projects });
});

app.get('/api/projects/all', auth, async (req, res) => {
  const projects = await Project.find().sort({ sortOrder: 1 });
  res.json({ success: true, projects });
});

app.get('/api/projects/:slug', async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return res.status(404).json({ success: false });
  res.json({ success: true, project });
});

app.post('/api/projects', auth, async (req, res) => {
  const project = await Project.create({ ...req.body, slug: slugify(req.body.title) });
  res.json({ success: true, project });
});

app.put('/api/projects/:id', auth, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, project });
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  let filter = { isActive: true };
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  const images = await Gallery.find(filter).sort({ sortOrder: 1 });
  res.json({ success: true, images });
});

app.get('/api/gallery/all', auth, async (req, res) => {
  const images = await Gallery.find().sort({ sortOrder: 1 });
  res.json({ success: true, images });
});

app.post('/api/gallery', auth, async (req, res) => {
  const image = await Gallery.create(req.body);
  res.json({ success: true, image });
});

app.delete('/api/gallery/:id', auth, async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  const testimonials = await Testimonial.find({ isPublished: true });
  res.json({ success: true, testimonials });
});

app.get('/api/testimonials/all', auth, async (req, res) => {
  const testimonials = await Testimonial.find();
  res.json({ success: true, testimonials });
});

app.post('/api/testimonials', auth, async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.json({ success: true, testimonial });
});

app.put('/api/testimonials/:id', auth, async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, testimonial });
});

app.delete('/api/testimonials/:id', auth, async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// FAQs
app.get('/api/faqs', async (req, res) => {
  const faqs = await FAQ.find({ isPublished: true }).sort({ sortOrder: 1 });
  res.json({ success: true, faqs });
});

app.get('/api/faqs/all', auth, async (req, res) => {
  const faqs = await FAQ.find().sort({ sortOrder: 1 });
  res.json({ success: true, faqs });
});

app.post('/api/faqs', auth, async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.json({ success: true, faq });
});

app.put('/api/faqs/:id', auth, async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, faq });
});

app.delete('/api/faqs/:id', auth, async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Enquiries
app.post('/api/enquiries', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone required' });
  const enquiry = await Enquiry.create({ ...req.body, status: 'New' });
  res.json({ success: true, enquiry });
});

app.get('/api/enquiries', auth, async (req, res) => {
  let filter = {};
  if (req.query.status) filter.status = req.query.status;
  const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, enquiries, total: enquiries.length });
});

app.put('/api/enquiries/:id', auth, async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, enquiry });
});

app.delete('/api/enquiries/:id', auth, async (req, res) => {
  await Enquiry.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Upload
app.post('/api/upload', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  
  try {
    if (isCloudinaryConfigured()) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'sahanines-interiors',
        resource_type: 'image'
      });
      
      fs.unlinkSync(req.file.path);
      
      res.json({ 
        success: true, 
        url: result.secure_url, 
        filename: result.public_id,
        storage: 'cloudinary'
      });
    } else {
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
  
  const services = await Service.find({ isActive: true });
  services.forEach(s => { xml += `  <url><loc>${base}/services/${s.slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`; });
  
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
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    await seedMongo();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
  
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (MongoDB mode)`));
}

start();
