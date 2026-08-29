const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const JWT_SECRET = 'sahanines-secret-key-2024';
const PORT = 3000;

// Simple JSON store
const DB_PATH = path.join(__dirname, 'data.json');
let db;

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch(e) {}
  if (!db) db = { settings: {}, services: [], projects: [], gallery: [], testimonials: [], faqs: [], enquiries: [], admins: [] };
}

function saveDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function slugify(t) { return t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-'); }
function genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

// Seed data
function seed() {
  loadDB();
  if (db.services && db.services.length > 0) return; // Already seeded

  // Admin
  const hashedPw = bcrypt.hashSync('admin123', 12);
  db.admins = [{ _id: genId(), name: 'Admin', email: 'admin@sahanines.com', password: hashedPw }];

  // Settings
  db.settings = {
    businessName: 'Sahanines Interiors', tagline: 'False Ceiling & Interior Design in Guwahati',
    logo: '', favicon: '', phone: '076360 08047', whatsapp: '917636008047', email: '',
    address: { line1: 'House No. 4, Shantipur, Ashram Road', line2: 'Jyotikuchi, Guwahati, Assam 781009', full: 'House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, Assam 781009' },
    googleMapsUrl: '', googleMapsEmbed: '', googleBusinessUrl: '', googleReviewUrl: '',
    googleRating: 5.0, googleReviewsCount: 318, plusCode: '4PGJ+R4 Guwahati, Assam',
    social: { facebook: '', instagram: '', youtube: '', twitter: '' },
    hero: { heading: 'Premium False Ceiling & Interior Solutions in Guwahati', subtitle: 'Modern false ceiling designs, gypsum and POP ceiling work, lighting solutions and professional interior finishing by Sahanines Interiors.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80', ctaPrimary: 'Get Free Quote', ctaSecondary: 'View Our Projects' },
    footer: { description: 'Professional false ceiling and interior solutions in Guwahati, Assam. Quality materials, modern designs, and clean finishing.', copyright: '© 2024 Sahanines Interiors. All rights reserved.' },
    theme: { primaryColor: '#1a1a2e', secondaryColor: '#c9a96e', accentColor: '#e8d5b7', buttonColor: '#c9a96e' },
    seo: { defaultTitle: 'Sahanines Interiors | False Ceiling & Interior Design in Guwahati', defaultDescription: 'Sahanines Interiors provides professional false ceiling, gypsum ceiling, POP ceiling, ceiling lighting and interior solutions in Guwahati, Assam. Contact us for a quote.', ogImage: '', googleVerification: '', analyticsId: '', searchConsoleVerification: '' }
  };

  // Services
  db.services = [
    { _id: genId(), name: 'False Ceiling', slug: 'false-ceiling', shortDescription: 'Modern and professionally finished false ceiling solutions for homes, offices and commercial spaces.', description: 'Our false ceiling solutions transform ordinary spaces into elegant, modern environments. We provide comprehensive false ceiling installation services that combine aesthetic appeal with practical benefits including improved insulation, acoustic control, and integrated lighting options. Each installation is carried out with precision and attention to detail, ensuring a clean finish that complements your interior design.', image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', altText: 'Modern false ceiling installation in Guwahati by Sahanines Interiors', benefits: ['Enhanced room aesthetics', 'Improved insulation and acoustics', 'Concealed wiring and pipes', 'Integrated lighting options', 'Fire-resistant materials available'], applications: ['Living rooms', 'Bedrooms', 'Offices', 'Commercial spaces', 'Hotels and restaurants'], faqs: [{ question: 'What is a false ceiling?', answer: 'A false ceiling is a secondary ceiling installed below the main ceiling, creating a gap that can house lighting, wiring, and insulation. It enhances the visual appeal and functionality of a space.' }, { question: 'How long does false ceiling installation take?', answer: 'Installation time varies based on room size and design complexity. A standard room typically takes 2-4 days for complete installation.' }], seoTitle: 'False Ceiling Services in Guwahati | Sahanines Interiors', seoDescription: 'Professional false ceiling installation in Guwahati. Modern designs, quality materials, and expert finishing for residential and commercial spaces.', isActive: true, sortOrder: 1, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Gypsum False Ceiling', slug: 'gypsum-false-ceiling', shortDescription: 'Elegant gypsum ceiling designs with clean finishing and modern lighting integration.', description: 'Gypsum false ceilings offer a premium, smooth finish that is ideal for modern interiors. Gypsum boards are lightweight, easy to install, and provide excellent fire resistance. They create a seamless surface perfect for concealing lighting fixtures, air conditioning ducts, and electrical wiring. Our gypsum ceiling installations are known for their precision and durability.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', altText: 'Gypsum false ceiling design in Guwahati', benefits: ['Smooth and seamless finish', 'Lightweight and durable', 'Fire resistant', 'Easy to maintain', 'Perfect for modern interiors'], applications: ['Bedrooms', 'Living rooms', 'Office cabins', 'Conference rooms', 'Retail stores'], faqs: [{ question: 'What is gypsum false ceiling?', answer: 'Gypsum false ceiling uses gypsum boards to create a smooth, premium ceiling surface. It is lightweight, fire-resistant, and ideal for modern interior designs.' }, { question: 'Is gypsum ceiling good for homes?', answer: 'Yes, gypsum ceilings are excellent for homes. They provide a clean, modern look, improve insulation, and can integrate seamlessly with lighting systems.' }], seoTitle: 'Gypsum False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Premium gypsum false ceiling installation in Guwahati.', isActive: true, sortOrder: 2, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'POP False Ceiling', slug: 'pop-false-ceiling', shortDescription: 'Custom POP ceiling designs for decorative and premium interiors.', description: 'Plaster of Paris (POP) false ceilings allow for intricate decorative designs and custom shapes. POP is a versatile material that can be moulded into various patterns, curves, and ornamental designs. Our POP ceiling work combines traditional craftsmanship with modern techniques to create stunning ceiling designs.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', altText: 'POP false ceiling design in Guwahati', benefits: ['Custom decorative designs', 'Intricate patterns and curves', 'Durable and long-lasting', 'Cost-effective', 'Versatile design options'], applications: ['Drawing rooms', 'Banquet halls', 'Restaurants', 'Traditional interiors', 'Luxury homes'], faqs: [{ question: 'What is POP false ceiling?', answer: 'POP (Plaster of Paris) false ceiling uses plaster material to create decorative ceiling designs.' }, { question: 'How is POP different from gypsum?', answer: 'POP is applied as a plaster and allows more intricate decorative work, while gypsum comes in pre-made boards.' }], seoTitle: 'POP False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Custom POP false ceiling designs in Guwahati.', isActive: true, sortOrder: 3, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Ceiling Lighting', slug: 'ceiling-lighting', shortDescription: 'LED lighting, concealed lighting, cove lighting and ceiling-integrated lighting solutions.', description: 'Lighting is an essential element of ceiling design. We provide comprehensive ceiling lighting solutions including LED strip lighting, cove lighting, recessed lights, pendant lights, and concealed lighting systems.', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', altText: 'Ceiling lighting design in Guwahati', benefits: ['Energy-efficient LED options', 'Ambient and accent lighting', 'Concealed wiring', 'Custom lighting layouts', 'Reduced electricity costs'], applications: ['Living rooms', 'Bedrooms', 'Hallways', 'Commercial spaces', 'Showrooms'], faqs: [{ question: 'Can LED lights be integrated into false ceilings?', answer: 'Yes, LED strip lights, recessed lights, and cove lighting can all be seamlessly integrated into false ceiling designs.' }], seoTitle: 'Ceiling Lighting Solutions in Guwahati | Sahanines Interiors', seoDescription: 'Professional ceiling lighting installation in Guwahati.', isActive: true, sortOrder: 4, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Interior Ceiling Design', slug: 'interior-ceiling-design', shortDescription: 'Modern ceiling concepts designed according to room size, furniture, lighting and overall interior style.', description: 'Every space is unique, and ceiling design should complement the overall interior. Our interior ceiling design service considers room dimensions, furniture layout, lighting requirements, and your personal style.', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', altText: 'Interior ceiling design in Guwahati', benefits: ['Customized to your space', 'Harmonized with interior style', 'Professional design consultation', '3D design visualization', 'Expert execution'], applications: ['New homes', 'Renovation projects', 'Office interiors', 'Showrooms', 'Premium residences'], faqs: [{ question: 'Do you provide design consultation?', answer: 'Yes, we provide complete design consultation for your ceiling and interior needs.' }], seoTitle: 'Interior Ceiling Design in Guwahati | Sahanines Interiors', seoDescription: 'Custom interior ceiling design services in Guwahati.', isActive: true, sortOrder: 5, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Residential False Ceiling', slug: 'residential-false-ceiling', shortDescription: 'False ceiling solutions for bedrooms, living rooms, dining areas, kitchens and other residential spaces.', description: 'Transform your home with our residential false ceiling solutions. We design ceilings for every room, creating comfortable, beautiful living spaces that reflect your personality.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', altText: 'Residential false ceiling in Guwahati', benefits: ['Room-specific designs', 'Enhanced home aesthetics', 'Improved insulation', 'Noise reduction', 'Increased property value'], applications: ['Bedrooms', 'Living rooms', 'Dining areas', 'Kitchens', 'Pooja rooms'], faqs: [{ question: 'Do you work on residential projects?', answer: 'Yes, we specialize in residential false ceiling work for all rooms in your home.' }], seoTitle: 'Residential False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Home false ceiling installation in Guwahati.', isActive: true, sortOrder: 6, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Commercial False Ceiling', slug: 'commercial-false-ceiling', shortDescription: 'Professional ceiling solutions for offices, shops, showrooms and commercial spaces.', description: 'Commercial spaces require ceilings that balance aesthetics with functionality. Our commercial false ceiling services create professional environments that impress clients and provide comfortable working conditions.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', altText: 'Commercial false ceiling in Guwahati', benefits: ['Professional appearance', 'Acoustic management', 'Fire safety compliance', 'Easy maintenance access', 'Scalable solutions'], applications: ['Offices', 'Retail shops', 'Showrooms', 'Restaurants', 'Hotels'], faqs: [{ question: 'Do you handle commercial projects?', answer: 'Yes, we provide commercial false ceiling solutions for offices, shops, and other commercial spaces in Guwahati.' }], seoTitle: 'Commercial False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Commercial false ceiling contractor in Guwahati.', isActive: true, sortOrder: 7, createdAt: new Date().toISOString() }
  ];

  // Projects
  db.projects = [
    { _id: genId(), title: 'Modern Living Room Ceiling', slug: 'modern-living-room-ceiling', category: 'False Ceiling', location: 'Jyotikuchi, Guwahati', description: 'A sleek modern false ceiling with integrated LED strip lighting and recessed spotlights.', coverImage: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', altText: 'Modern living room false ceiling project in Guwahati', isFeatured: true, isActive: true, sortOrder: 1, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Gypsum Ceiling for Premium Bedroom', slug: 'gypsum-ceiling-premium-bedroom', category: 'Gypsum Ceiling', location: 'Shantipur, Guwahati', description: 'Elegant gypsum false ceiling with cove lighting around the perimeter.', coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', altText: 'Gypsum ceiling bedroom project', isFeatured: true, isActive: true, sortOrder: 2, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Office Cabin Ceiling Work', slug: 'office-cabin-ceiling-work', category: 'Commercial', location: 'GS Road, Guwahati', description: 'Professional false ceiling installation for a corporate office cabin.', coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', altText: 'Office ceiling project', isFeatured: true, isActive: true, sortOrder: 3, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Decorative POP Ceiling', slug: 'decorative-pop-ceiling', category: 'POP Ceiling', location: 'Dispur, Guwahati', description: 'Intricate POP ceiling design with decorative mouldings.', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', altText: 'POP ceiling design project', isActive: true, sortOrder: 4, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'LED Lighting Integration', slug: 'led-lighting-integration', category: 'Lighting', location: 'Khanapara, Guwahati', description: 'Complete ceiling lighting redesign with LED strip lights.', coverImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', altText: 'Ceiling lighting project', isFeatured: true, isActive: true, sortOrder: 5, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Apartment Complex Ceiling Work', slug: 'apartment-complex-ceiling', category: 'Residential', location: 'Aminjari, Guwahati', description: 'False ceiling work for a residential apartment.', coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', altText: 'Residential ceiling project', isActive: true, sortOrder: 6, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Showroom Ceiling Design', slug: 'showroom-ceiling-design', category: 'Commercial', location: 'Fancy Bazar, Guwahati', description: 'Eye-catching false ceiling design for a retail showroom.', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', altText: 'Showroom ceiling project', isActive: true, sortOrder: 7, createdAt: new Date().toISOString() },
    { _id: genId(), title: 'Dining Room Ceiling', slug: 'dining-room-ceiling', category: 'Residential', location: 'Christianbasti, Guwahati', description: 'Elegant dining room ceiling with circular design element.', coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', altText: 'Dining room ceiling project', isActive: true, sortOrder: 8, createdAt: new Date().toISOString() }
  ];

  // Gallery
  db.gallery = [
    { _id: genId(), image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', title: 'Modern Ceiling Design', category: 'False Ceiling', altText: 'Modern false ceiling design', caption: 'Contemporary false ceiling with LED lighting', isActive: true, sortOrder: 1 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', title: 'Luxury Interior', category: 'Residential', altText: 'Luxury interior ceiling', caption: 'Premium residential ceiling work', isActive: true, sortOrder: 2 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', title: 'Elegant Ceiling', category: 'POP Ceiling', altText: 'Elegant POP ceiling', isActive: true, sortOrder: 3 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', title: 'Bedroom Ceiling', category: 'Gypsum Ceiling', altText: 'Bedroom gypsum ceiling', isActive: true, sortOrder: 4 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', title: 'Lighting Design', category: 'Lighting', altText: 'Ceiling lighting design', isActive: true, sortOrder: 5 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', title: 'Office Space', category: 'Commercial', altText: 'Office ceiling design', isActive: true, sortOrder: 6 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', title: 'Living Room', category: 'Residential', altText: 'Living room ceiling', isActive: true, sortOrder: 7 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', title: 'Interior Design', category: 'False Ceiling', altText: 'Interior ceiling design', isActive: true, sortOrder: 8 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', title: 'Kitchen Ceiling', category: 'Residential', altText: 'Kitchen false ceiling', isActive: true, sortOrder: 9 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', title: 'Bathroom Ceiling', category: 'Gypsum Ceiling', altText: 'Bathroom ceiling', isActive: true, sortOrder: 10 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80', title: 'Hall Ceiling', category: 'POP Ceiling', altText: 'Hall POP ceiling', isActive: true, sortOrder: 11 },
    { _id: genId(), image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', title: 'Commercial Space', category: 'Commercial', altText: 'Commercial ceiling', isActive: true, sortOrder: 12 }
  ];

  // Testimonials
  db.testimonials = [
    { _id: genId(), name: 'Rahul S.', review: 'Excellent service, high-quality materials, and very polite staff. The false ceiling in our living room looks stunning. Highly recommended for anyone in Guwahati looking for quality ceiling work.', rating: 5, isPublished: true, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Priyam D.', review: 'They finished the work on time and kept the place clean during installation. The gypsum ceiling in our bedroom is perfect. Very professional team.', rating: 5, isPublished: true, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Ankita M.', review: 'The lighting work is just perfect, adding a soft and classy vibe to our home. Sahanines Interiors understood exactly what we wanted and delivered beyond expectations.', rating: 5, isPublished: true, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Bikash T.', review: 'Very satisfied with the POP ceiling work in our drawing room. The design is elegant and the finishing is top-notch. The team was punctual and professional.', rating: 5, isPublished: true, createdAt: new Date().toISOString() },
    { _id: genId(), name: 'Deepa G.', review: 'We got our office ceiling done by Sahanines Interiors. The work quality is excellent and the team was very cooperative.', rating: 5, isPublished: true, createdAt: new Date().toISOString() }
  ];

  // FAQs
  db.faqs = [
    { _id: genId(), question: 'What is a false ceiling?', answer: 'A false ceiling is a secondary ceiling installed below the original ceiling, creating a gap that can be used for lighting, wiring, insulation, and decorative purposes. It enhances the aesthetics and functionality of any room.', isPublished: true, sortOrder: 1 },
    { _id: genId(), question: 'What types of false ceilings do you provide in Guwahati?', answer: 'We provide gypsum false ceilings, POP (Plaster of Paris) false ceilings, and various designer ceiling solutions. Each type has its own advantages depending on the design requirements and budget.', isPublished: true, sortOrder: 2 },
    { _id: genId(), question: 'Do you provide gypsum false ceiling work?', answer: 'Yes, we specialize in gypsum false ceiling installation. Gypsum ceilings offer a smooth, premium finish and are ideal for modern interiors. They are lightweight, fire-resistant, and easy to maintain.', isPublished: true, sortOrder: 3 },
    { _id: genId(), question: 'Do you provide POP false ceiling work?', answer: 'Yes, we provide custom POP false ceiling designs. POP allows for intricate decorative patterns and curves, making it ideal for traditional and ornamental ceiling designs.', isPublished: true, sortOrder: 4 },
    { _id: genId(), question: 'Can you integrate LED lighting into a false ceiling?', answer: 'Absolutely. We specialize in integrating LED strip lights, recessed lights, cove lighting, and pendant lights into false ceiling designs.', isPublished: true, sortOrder: 5 },
    { _id: genId(), question: 'Do you provide residential false ceiling work?', answer: 'Yes, we provide false ceiling solutions for all residential spaces including bedrooms, living rooms, dining areas, kitchens, and pooja rooms across Guwahati.', isPublished: true, sortOrder: 6 },
    { _id: genId(), question: 'Do you provide commercial false ceiling work?', answer: 'Yes, we handle commercial projects including offices, retail shops, showrooms, restaurants, and hotels.', isPublished: true, sortOrder: 7 },
    { _id: genId(), question: 'How can I get a quotation?', answer: 'You can get a free quotation by calling us at 076360 08047, sending a WhatsApp message, or filling out the enquiry form on our website.', isPublished: true, sortOrder: 8 },
    { _id: genId(), question: 'Which areas of Guwahati do you serve?', answer: 'We serve all areas of Guwahati including Jyotikuchi, Shantipur, GS Road, Dispur, Khanapara, Christianbasti, Fancy Bazar, Aminjari, and surrounding areas.', isPublished: true, sortOrder: 9 },
    { _id: genId(), question: 'How can I contact Sahanines Interiors?', answer: 'You can reach us by phone at 076360 08047, through WhatsApp, or visit us at House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, Assam 781009.', isPublished: true, sortOrder: 10 }
  ];

  db.enquiries = [];
  saveDB();
  console.log('Database seeded');
}

seed();

// Express app
const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*', credentials: true }));
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
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const admin = db.admins.find(a => a.email === email);
  if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, admin: { name: admin.name, email: admin.email } });
});

app.get('/api/auth/profile', auth, (req, res) => { res.json({ success: true, admin: db.admins[0] }); });

// Settings
app.get('/api/settings', (req, res) => { res.json({ success: true, settings: db.settings }); });
app.put('/api/settings', auth, (req, res) => {
  const merge = (target, source) => { for (const k in source) { if (typeof source[k] === 'object' && source[k] !== null && !Array.isArray(source[k])) { if (!target[k]) target[k] = {}; merge(target[k], source[k]); } else { target[k] = source[k]; } } };
  merge(db.settings, req.body);
  saveDB();
  res.json({ success: true, settings: db.settings });
});

// Services
app.get('/api/services', (req, res) => { res.json({ success: true, services: db.services.filter(s => s.isActive).sort((a,b) => a.sortOrder - b.sortOrder) }); });
app.get('/api/services/all', auth, (req, res) => { res.json({ success: true, services: db.services.sort((a,b) => a.sortOrder - b.sortOrder) }); });
app.get('/api/services/:slug', (req, res) => { const s = db.services.find(s => s.slug === req.params.slug); if (!s) return res.status(404).json({ success: false, message: 'Not found' }); res.json({ success: true, service: s }); });
app.post('/api/services', auth, (req, res) => { const s = { _id: genId(), ...req.body, slug: slugify(req.body.name), createdAt: new Date().toISOString() }; db.services.push(s); saveDB(); res.json({ success: true, service: s }); });
app.put('/api/services/:id', auth, (req, res) => { const i = db.services.findIndex(s => s._id === req.params.id); if (i === -1) return res.status(404).json({ success: false }); if (req.body.name) req.body.slug = slugify(req.body.name); db.services[i] = { ...db.services[i], ...req.body }; saveDB(); res.json({ success: true, service: db.services[i] }); });
app.delete('/api/services/:id', auth, (req, res) => { db.services = db.services.filter(s => s._id !== req.params.id); saveDB(); res.json({ success: true }); });

// Projects
app.get('/api/projects', (req, res) => { let p = db.projects.filter(p => p.isActive); if (req.query.category && req.query.category !== 'All') p = p.filter(p => p.category === req.query.category); res.json({ success: true, projects: p.sort((a,b) => a.sortOrder - b.sortOrder) }); });
app.get('/api/projects/all', auth, (req, res) => { res.json({ success: true, projects: db.projects.sort((a,b) => a.sortOrder - b.sortOrder) }); });
app.get('/api/projects/:slug', (req, res) => { const p = db.projects.find(p => p.slug === req.params.slug); if (!p) return res.status(404).json({ success: false }); res.json({ success: true, project: p }); });
app.post('/api/projects', auth, (req, res) => { const p = { _id: genId(), ...req.body, slug: slugify(req.body.title), createdAt: new Date().toISOString() }; db.projects.push(p); saveDB(); res.json({ success: true, project: p }); });
app.put('/api/projects/:id', auth, (req, res) => { const i = db.projects.findIndex(p => p._id === req.params.id); if (i === -1) return res.status(404).json({ success: false }); if (req.body.title) req.body.slug = slugify(req.body.title); db.projects[i] = { ...db.projects[i], ...req.body }; saveDB(); res.json({ success: true, project: db.projects[i] }); });
app.delete('/api/projects/:id', auth, (req, res) => { db.projects = db.projects.filter(p => p._id !== req.params.id); saveDB(); res.json({ success: true }); });

// Gallery
app.get('/api/gallery', (req, res) => { let g = db.gallery.filter(g => g.isActive); if (req.query.category && req.query.category !== 'All') g = g.filter(g => g.category === req.query.category); res.json({ success: true, images: g.sort((a,b) => a.sortOrder - b.sortOrder) }); });
app.get('/api/gallery/all', auth, (req, res) => { res.json({ success: true, images: db.gallery.sort((a,b) => a.sortOrder - b.sortOrder) }); });
app.post('/api/gallery', auth, (req, res) => { const g = { _id: genId(), ...req.body, createdAt: new Date().toISOString() }; db.gallery.push(g); saveDB(); res.json({ success: true, image: g }); });
app.delete('/api/gallery/:id', auth, (req, res) => { db.gallery = db.gallery.filter(g => g._id !== req.params.id); saveDB(); res.json({ success: true }); });

// Testimonials
app.get('/api/testimonials', (req, res) => { res.json({ success: true, testimonials: db.testimonials.filter(t => t.isPublished) }); });
app.get('/api/testimonials/all', auth, (req, res) => { res.json({ success: true, testimonials: db.testimonials }); });
app.post('/api/testimonials', auth, (req, res) => { const t = { _id: genId(), ...req.body, createdAt: new Date().toISOString() }; db.testimonials.push(t); saveDB(); res.json({ success: true, testimonial: t }); });
app.put('/api/testimonials/:id', auth, (req, res) => { const i = db.testimonials.findIndex(t => t._id === req.params.id); if (i === -1) return res.status(404).json({ success: false }); db.testimonials[i] = { ...db.testimonials[i], ...req.body }; saveDB(); res.json({ success: true, testimonial: db.testimonials[i] }); });
app.delete('/api/testimonials/:id', auth, (req, res) => { db.testimonials = db.testimonials.filter(t => t._id !== req.params.id); saveDB(); res.json({ success: true }); });

// FAQs
app.get('/api/faqs', (req, res) => { res.json({ success: true, faqs: db.faqs.filter(f => f.isPublished).sort((a,b) => a.sortOrder - b.sortOrder) }); });
app.get('/api/faqs/all', auth, (req, res) => { res.json({ success: true, faqs: db.faqs.sort((a,b) => a.sortOrder - b.sortOrder) }); });
app.post('/api/faqs', auth, (req, res) => { const f = { _id: genId(), ...req.body, createdAt: new Date().toISOString() }; db.faqs.push(f); saveDB(); res.json({ success: true, faq: f }); });
app.put('/api/faqs/:id', auth, (req, res) => { const i = db.faqs.findIndex(f => f._id === req.params.id); if (i === -1) return res.status(404).json({ success: false }); db.faqs[i] = { ...db.faqs[i], ...req.body }; saveDB(); res.json({ success: true, faq: db.faqs[i] }); });
app.delete('/api/faqs/:id', auth, (req, res) => { db.faqs = db.faqs.filter(f => f._id !== req.params.id); saveDB(); res.json({ success: true }); });

// Enquiries
app.post('/api/enquiries', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone required' });
  const e = { _id: genId(), ...req.body, status: 'New', createdAt: new Date().toISOString() };
  db.enquiries.push(e); saveDB();
  res.json({ success: true, enquiry: e });
});
app.get('/api/enquiries', auth, (req, res) => {
  let e = db.enquiries;
  if (req.query.status) e = e.filter(x => x.status === req.query.status);
  res.json({ success: true, enquiries: e.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)), total: e.length });
});
app.put('/api/enquiries/:id', auth, (req, res) => { const i = db.enquiries.findIndex(e => e._id === req.params.id); if (i === -1) return res.status(404).json({ success: false }); db.enquiries[i] = { ...db.enquiries[i], ...req.body }; saveDB(); res.json({ success: true, enquiry: db.enquiries[i] }); });
app.delete('/api/enquiries/:id', auth, (req, res) => { db.enquiries = db.enquiries.filter(e => e._id !== req.params.id); saveDB(); res.json({ success: true }); });

// Upload
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  res.json({ success: true, url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

// Sitemap
app.get('/sitemap.xml', (req, res) => {
  const base = 'https://sahaninesinteriors.com';
  let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  ['/', '/about', '/services', '/projects', '/gallery', '/reviews', '/faq', '/contact'].forEach(p => { xml += `<url><loc>${base}${p}</loc><changefreq>weekly</changefreq></url>`; });
  db.services.filter(s => s.isActive).forEach(s => { xml += `<url><loc>${base}/services/${s.slug}</loc><changefreq>monthly</changefreq></url>`; });
  db.projects.filter(p => p.isActive).forEach(p => { xml += `<url><loc>${base}/projects/${p.slug}</loc><changefreq>monthly</changefreq></url>`; });
  xml += '</urlset>';
  res.header('Content-Type', 'application/xml').send(xml);
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
