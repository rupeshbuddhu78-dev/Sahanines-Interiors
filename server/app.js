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
    { name: 'False Ceiling', slug: 'false-ceiling', shortDescription: 'Modern false ceiling solutions for homes and offices in Guwahati. Expert installation with quality materials and contemporary designs.', description: 'Sahanines Interiors provides professional false ceiling installation services in Guwahati, Assam. Our false ceiling solutions combine modern design with practical functionality — improving aesthetics, concealing wiring and plumbing, providing thermal insulation, and enabling integrated lighting. We work with gypsum, POP, PVC, and other materials to deliver ceilings that transform your space. Whether you need a simple clean finish or an elaborate designer ceiling with LED lighting, our team handles every project with precision and care.', image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', benefits: ['Improved room aesthetics', 'Conceals wiring and pipes', 'Better insulation', 'LED lighting integration', 'Sound absorption'], applications: ['Living Rooms', 'Bedrooms', 'Offices', 'Retail Shops', 'Hotels', 'Restaurants'], seoTitle: 'Best False Ceiling Contractor in Guwahati | Sahanines Interiors', seoDescription: 'Expert false ceiling contractor in Guwahati. Modern designs, quality materials, professional installation for homes and offices. Free consultation. Call 076360 08047.', altText: 'Modern false ceiling installation in Guwahati by Sahanines Interiors', isActive: true, sortOrder: 1 },
    { name: 'Gypsum False Ceiling', slug: 'gypsum-false-ceiling', shortDescription: 'Elegant gypsum false ceiling designs in Guwahati. Smooth finish, durable, and perfect for modern interiors with integrated lighting.', description: 'Gypsum false ceilings are one of the most popular choices for modern interiors in Guwahati. Sahanines Interiors specializes in gypsum board ceiling installation — delivering smooth, clean finishes with precise joints and edges. Gypsum boards are lightweight, fire-resistant, and offer excellent thermal and sound insulation. They come in standard sizes for quick installation and can be customized with cutouts for lights, fans, and AC vents. Our gypsum ceiling designs range from simple single-layer ceilings to multi-layered designer ceilings with cove lighting and decorative elements.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', benefits: ['Smooth and clean finish', 'Fire-resistant material', 'Quick installation', 'Excellent sound insulation', 'Moisture-resistant options'], applications: ['Living Rooms', 'Bedrooms', 'Drawing Rooms', 'Office Cabins', 'Conference Rooms', 'Showrooms'], seoTitle: 'Gypsum False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Premium gypsum false ceiling installation in Guwahati. Smooth finish, fire-resistant, sound insulation. Expert gypsum ceiling contractor. Free quote. Call 076360 08047.', altText: 'Gypsum false ceiling design in Guwahati by Sahanines Interiors', isActive: true, sortOrder: 2 },
    { name: 'POP False Ceiling', slug: 'pop-false-ceiling', shortDescription: 'Custom POP false ceiling designs in Guwahati. Intricate mouldings, curves, and decorative patterns for elegant interiors.', description: 'POP (Plaster of Paris) false ceilings allow for the most creative and intricate designs. Sahanines Interiors is experienced in crafting custom POP ceiling designs in Guwahati — from elegant mouldings and curves to geometric patterns and floral motifs. POP is applied as a paste, giving our craftsmen the flexibility to create virtually any shape or texture. POP ceilings are cost-effective for complex designs and provide a seamless, monolithic finish. They are ideal for spaces where you want a statement ceiling with decorative elements, cornices, and custom lighting niches.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', benefits: ['Intricate custom designs', 'Seamless monolithic finish', 'Cost-effective for complex shapes', 'Versatile moulding options', 'Durable and long-lasting'], applications: ['Drawing Rooms', 'Bedrooms', 'Banquet Halls', 'Restaurants', 'Temples', 'Luxury Interiors'], seoTitle: 'POP False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Custom POP false ceiling designs in Guwahati. Intricate mouldings, curves, and decorative patterns. Expert POP ceiling contractor. Free consultation. Call 076360 08047.', altText: 'Decorative POP false ceiling design in Guwahati by Sahanines Interiors', isActive: true, sortOrder: 3 },
    { name: 'PVC Ceiling', slug: 'pvc-ceiling', shortDescription: 'Durable PVC ceiling solutions in Guwahati. Waterproof, termite-proof, and low maintenance — ideal for bathrooms, kitchens, and commercial spaces.', description: 'PVC ceilings are a practical and durable choice for spaces that require moisture resistance and easy maintenance. Sahanines Interiors provides PVC ceiling installation in Guwahati for bathrooms, kitchens, balconies, offices, and commercial spaces. PVC ceiling panels are waterproof, termite-proof, lightweight, and available in a wide range of colours, textures, and finishes — including wood grain, marble, and plain matte options. They are easy to clean, require no painting, and offer a neat, modern appearance at an affordable price point.', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', benefits: ['Waterproof and moisture-resistant', 'Termite-proof', 'Low maintenance — no painting needed', 'Lightweight and easy to install', 'Available in many finishes and colours'], applications: ['Bathrooms', 'Kitchens', 'Balconies', 'Offices', 'Shops', 'Commercial Spaces'], seoTitle: 'PVC Ceiling Contractor in Guwahati | Sahanines Interiors', seoDescription: 'PVC ceiling installation in Guwahati. Waterproof, termite-proof, low maintenance. Ideal for bathrooms, kitchens, and offices. Best PVC ceiling contractor. Call 076360 08047.', altText: 'PVC ceiling installation in Guwahati by Sahanines Interiors', isActive: true, sortOrder: 4 },
    { name: 'Ceiling Lighting', slug: 'ceiling-lighting', shortDescription: 'Integrated ceiling lighting solutions in Guwahati. LED strips, cove lighting, recessed lights, and decorative fixtures for stunning interiors.', description: 'Lighting transforms a ceiling from functional to spectacular. Sahanines Interiors specializes in ceiling lighting design and installation in Guwahati — integrating LED strip lights, cove lighting, recessed downlights, pendant lights, and decorative fixtures into false ceiling designs. Proper lighting design enhances ambiance, highlights architectural features, and creates the right mood for any space. We handle the complete lighting solution — from design planning and electrical wiring to fixture installation and finishing.', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', benefits: ['Transforms room ambiance', 'Energy-efficient LED options', 'Custom lighting layouts', 'Professional wiring and installation', 'Dimmable and colour-changing options'], applications: ['Living Rooms', 'Bedrooms', 'Offices', 'Restaurants', 'Retail Stores', 'Home Theaters'], seoTitle: 'Ceiling Lighting Design in Guwahati | Sahanines Interiors', seoDescription: 'Professional ceiling lighting design and installation in Guwahati. LED strips, cove lighting, recessed lights integrated into false ceilings. Call 076360 08047.', altText: 'Ceiling lighting design with LED integration in Guwahati', isActive: true, sortOrder: 5 },
    { name: 'Interior Ceiling Design', slug: 'interior-ceiling-design', shortDescription: 'Modern interior ceiling design in Guwahati. Custom designer ceilings that combine aesthetics, lighting, and functionality for premium interiors.', description: 'A well-designed ceiling is the crown of any interior. Sahanines Interiors provides modern interior ceiling design services in Guwahati — creating custom ceiling designs that complement your overall interior style. Our design approach considers room proportions, furniture layout, lighting needs, colour scheme, and your personal preferences. From minimalist contemporary designs to elaborate classical patterns, we create ceilings that become the focal point of your space. Each design is tailored to the specific room and its intended use.', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', benefits: ['Custom-tailored designs', 'Harmonizes with interior style', 'Increases property value', 'Professional design consultation', '3D visualisation available'], applications: ['Homes', 'Apartments', 'Villas', 'Offices', 'Hotels', 'Commercial Spaces'], seoTitle: 'Modern Ceiling Design in Guwahati | Sahanines Interiors', seoDescription: 'Modern interior ceiling design in Guwahati. Custom designer ceilings with lighting integration. Transform your space with professional ceiling design. Call 076360 08047.', altText: 'Modern interior ceiling design in Guwahati by Sahanines Interiors', isActive: true, sortOrder: 6 },
    { name: 'Residential False Ceiling', slug: 'residential-false-ceiling', shortDescription: 'Residential false ceiling services in Guwahati. Transform your home with modern ceiling designs for living rooms, bedrooms, and more.', description: 'Your home deserves a ceiling that matches your style and comfort needs. Sahanines Interiors provides residential false ceiling services in Guwahati — designing and installing ceilings for living rooms, bedrooms, kitchens, dining rooms, and children\'s rooms. We understand that every home is different, and we work closely with homeowners to create ceilings that enhance the character of each room. From simple, elegant designs for bedrooms to statement ceilings for living rooms, we deliver quality work that fits your budget and timeline.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', benefits: ['Home-specific designs', 'Minimal disruption during installation', 'Wide range of styles', 'Budget-friendly options', 'Quality finishing'], applications: ['Living Rooms', 'Bedrooms', 'Kitchens', 'Dining Rooms', 'Children\'s Rooms', 'Pooja Rooms'], seoTitle: 'Residential False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Residential false ceiling services in Guwahati. Modern ceiling designs for homes — living rooms, bedrooms, kitchens. Quality materials and professional installation. Call 076360 08047.', altText: 'Residential false ceiling design in Guwahati home', isActive: true, sortOrder: 7 },
    { name: 'Commercial False Ceiling', slug: 'commercial-false-ceiling', shortDescription: 'Commercial false ceiling solutions in Guwahati. Professional ceilings for offices, shops, showrooms, restaurants, and commercial spaces.', description: 'Commercial spaces need ceilings that are functional, durable, and visually impressive. Sahanines Interiors provides commercial false ceiling services in Guwahati — installing ceilings for offices, retail shops, showrooms, restaurants, hotels, clinics, and other commercial establishments. We understand the unique requirements of commercial projects — fire safety compliance, acoustic performance, HVAC integration, access panels, and high-traffic durability. Our team delivers projects on time with minimal disruption to your business operations.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', benefits: ['Commercial-grade materials', 'Fire safety compliance', 'Acoustic performance', 'HVAC and electrical integration', 'Minimal business disruption'], applications: ['Offices', 'Retail Shops', 'Showrooms', 'Restaurants', 'Hotels', 'Clinics'], seoTitle: 'Commercial False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Commercial false ceiling contractor in Guwahati. Professional ceiling solutions for offices, shops, showrooms, and restaurants. Quality work, timely delivery. Call 076360 08047.', altText: 'Commercial false ceiling installation in Guwahati office', isActive: true, sortOrder: 8 }
  ]);

  await FAQ.create([
    { question: 'What is a false ceiling?', answer: 'A false ceiling is a secondary ceiling installed below the main ceiling. It improves aesthetics, provides better insulation, hides wiring and pipes, and allows integration of modern lighting solutions.', isPublished: true, sortOrder: 1 },
    { question: 'What types of false ceilings do you provide?', answer: 'We provide Gypsum false ceilings, POP (Plaster of Paris) false ceilings, PVC ceilings, wooden ceilings, metal ceilings, and custom designer ceilings. Each type has its own benefits depending on your requirements.', isPublished: true, sortOrder: 2 },
    { question: 'What is the difference between Gypsum and POP ceiling?', answer: 'Gypsum ceilings come in ready-made boards and are quicker to install with a smooth finish. POP ceilings are applied as a paste and allow more intricate designs and curves. Gypsum is more durable and moisture-resistant, while POP is more cost-effective for complex designs.', isPublished: true, sortOrder: 3 },
    { question: 'How long does false ceiling installation take?', answer: 'Installation time depends on the room size and design complexity. A standard room (10x12 ft) typically takes 2-4 days. Complex designs with lighting integration may take 5-7 days.', isPublished: true, sortOrder: 4 },
    { question: 'Do you provide LED lighting integration?', answer: 'Yes, we specialize in integrating LED strip lights, recessed lights, cove lighting, and decorative lighting into false ceilings. We provide complete lighting solutions including installation.', isPublished: true, sortOrder: 5 },
    { question: 'What is the cost of false ceiling in Guwahati?', answer: 'The cost varies based on material, design complexity, and room size. Gypsum ceilings start from ₹65-85 per sq.ft, POP ceilings from ₹55-75 per sq.ft. Contact us for a free quotation based on your specific requirements.', isPublished: true, sortOrder: 6 },
    { question: 'Do you provide warranty on your work?', answer: 'Yes, we provide warranty on both materials and workmanship. Gypsum boards come with manufacturer warranty, and we provide 1-2 years warranty on our installation work.', isPublished: true, sortOrder: 7 },
    { question: 'Which areas in Guwahati do you serve?', answer: 'We serve all areas of Guwahati including Jyotikuchi, Shantipur, GS Road, Dispur, Khanapara, Christianbasti, Fancy Bazar, Aminjari, and surrounding areas. We also take projects in nearby towns.', isPublished: true, sortOrder: 8 },
    { question: 'Can false ceilings help with sound insulation?', answer: 'Yes, false ceilings can significantly reduce noise transmission. We use acoustic materials and proper insulation to improve soundproofing, which is especially useful for bedrooms, home theaters, and offices.', isPublished: true, sortOrder: 9 },
    { question: 'How do I get a quotation?', answer: 'You can call us at 076360 08047, WhatsApp us, or fill out the contact form on our website. We provide free site visits and quotations for projects in Guwahati.', isPublished: true, sortOrder: 10 }
  ]);

  await Testimonial.create([
    { name: 'Rahul Sharma', review: 'Excellent work by Sahanines Interiors! They completed our living room false ceiling with LED lighting. Very professional team, clean work, and finished on time. Highly recommended!', rating: 5, isPublished: true },
    { name: 'Priyam Das', review: 'Very satisfied with the gypsum ceiling work in our bedroom. The team was punctual, materials used were of good quality, and the finishing is perfect. Good value for money.', rating: 5, isPublished: true },
    { name: 'Ankita Mehta', review: 'Got POP ceiling work done for our drawing room. The design is exactly what we wanted. The team is skilled and the work quality is top-notch. Thank you Sahanines Interiors!', rating: 5, isPublished: true },
    { name: 'Bikash Kalita', review: 'Professional service from start to finish. They helped us choose the right ceiling design for our office and the installation was flawless. Good communication throughout the project.', rating: 5, isPublished: true },
    { name: 'Mridul Hazarika', review: 'We got false ceiling work done for our shop. The team completed the work quickly without disrupting our business. Very happy with the result and the pricing was reasonable.', rating: 5, isPublished: true }
  ]);

  await Project.create([
    { title: 'Modern Living Room Ceiling', slug: 'modern-living-room-ceiling', category: 'False Ceiling', location: 'Jyotikuchi, Guwahati', description: 'Modern gypsum false ceiling with integrated LED strip lighting and recessed spots.', coverImage: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', isFeatured: true, isActive: true, sortOrder: 1 },
    { title: 'Gypsum Ceiling for Premium Bedroom', slug: 'gypsum-ceiling-premium-bedroom', category: 'Gypsum Ceiling', location: 'Shantipur, Guwahati', description: 'Elegant gypsum false ceiling with cove lighting and modern design.', coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', isFeatured: true, isActive: true, sortOrder: 2 },
    { title: 'Office Cabin Ceiling Work', slug: 'office-cabin-ceiling-work', category: 'Commercial', location: 'GS Road, Guwahati', description: 'Professional false ceiling installation for a corporate office cabin.', coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', isFeatured: true, isActive: true, sortOrder: 3 },
    { title: 'Decorative POP Ceiling', slug: 'decorative-pop-ceiling', category: 'POP Ceiling', location: 'Dispur, Guwahati', description: 'Intricate POP ceiling design with decorative mouldings and patterns.', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', isActive: true, sortOrder: 4 },
    { title: 'LED Lighting Integration', slug: 'led-lighting-integration', category: 'Lighting', location: 'Khanapara, Guwahati', description: 'Complete ceiling lighting redesign with LED strip lights and spot lights.', coverImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', isFeatured: true, isActive: true, sortOrder: 5 },
    { title: 'Apartment Complex Ceiling Work', slug: 'apartment-complex-ceiling', category: 'Residential', location: 'Aminjari, Guwahati', description: 'False ceiling work for a residential apartment complex.', coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', isActive: true, sortOrder: 6 },
    { title: 'Showroom Ceiling Design', slug: 'showroom-ceiling-design', category: 'Commercial', location: 'Fancy Bazar, Guwahati', description: 'Eye-catching false ceiling design for a retail showroom.', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', isActive: true, sortOrder: 7 },
    { title: 'Dining Room Ceiling', slug: 'dining-room-ceiling', category: 'Residential', location: 'Christianbasti, Guwahati', description: 'An elegant dining room ceiling with circular design and ambient lighting.', coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', isActive: true, sortOrder: 8 }
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

// Change Password
app.put('/api/auth/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    if (!bcrypt.compareSync(currentPassword, admin.password)) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    admin.password = bcrypt.hashSync(newPassword, 12);
    await admin.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
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

// Dynamic sitemap - includes all public pages + active services from DB
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

// Serve React build - inject OG meta tags from DB for social media crawlers
const clientBuild = path.join(__dirname, '..', 'client', 'dist');

// Serve static assets (JS, CSS, images) but NOT index.html - we handle that dynamically
app.use(express.static(clientBuild, {
  index: false, // Don't serve index.html automatically
  extensions: false, // Don't try adding extensions
  setHeaders: (res, filePath) => {
    // Set cache headers for static assets
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Block direct access to index.html - always serve dynamic version
app.get('/index.html', (req, res, next) => {
  req.url = '/'; // Rewrite to root so it goes through our dynamic handler
  next();
});

app.get(/^\/(?!api|uploads).*/, async (req, res) => {
  const indexPath = path.join(clientBuild, 'index.html');
  if (!fs.existsSync(indexPath)) return res.status(404).send('Not found');
  
  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    const settings = await SiteSettings.findOne();
    
    const baseUrl = process.env.SITE_URL || 'https://best-false-ceiling-specialist-of-guwahati-sahaninesinteriors.in';
    
    if (settings) {
      const ogImage = settings.seo?.ogImage || `${baseUrl}/logo.jpg`;
      const siteName = settings.businessName || 'Sahanines Interiors';
      
      // Always inject OG image (DB value or logo fallback) if not already in static HTML
      if (!html.includes('og:image')) {
        html = html.replace('</head>', `<meta property="og:image" content="${ogImage}" />\n<meta name="twitter:image" content="${ogImage}" />\n</head>`);
      }
      
      // Update site name if different
      if (siteName && siteName !== 'Sahanines Interiors') {
        html = html.replace(/<meta property="og:site_name" content="[^"]*" \/>/, `<meta property="og:site_name" content="${siteName}" />`);
      }
    } else {
      // No settings in DB — still ensure og:image exists with logo fallback
      if (!html.includes('og:image')) {
        html = html.replace('</head>', `<meta property="og:image" content="${baseUrl}/logo.jpg" />\n<meta name="twitter:image" content="${baseUrl}/logo.jpg" />\n</head>`);
      }
    }
    
    // Set noindex for admin routes
    if (req.path.startsWith('/admin')) {
      html = html.replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex, nofollow" />');
    }
    
    res.header('Content-Type', 'text/html').send(html);
  } catch (err) {
    // If DB error, just serve static HTML
    res.sendFile(indexPath);
  }
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
