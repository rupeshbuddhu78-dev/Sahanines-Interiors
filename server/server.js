require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const startServer = async () => {
  // Connect to database first
  await connectDB();

  // Seed data after DB connection
  const Admin = require('./models/Admin');
  const SiteSettings = require('./models/SiteSettings');
  const Service = require('./models/Service');
  const Project = require('./models/Project');
  const Gallery = require('./models/Gallery');
  const Testimonial = require('./models/Testimonial');
  const FAQ = require('./models/FAQ');

  const adminExists = await Admin.findOne({ email: 'admin@sahanines.com' });
  if (!adminExists) {
    console.log('Seeding database...');
    await Admin.create({ name: 'Admin', email: 'admin@sahanines.com', password: 'admin123' });
    await SiteSettings.create({});

    await Service.insertMany([
      { name: 'False Ceiling', slug: 'false-ceiling', shortDescription: 'Modern false ceiling solutions for homes and offices.', description: 'Our false ceiling solutions transform spaces into elegant environments with improved insulation and integrated lighting.', image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', isActive: true, sortOrder: 1 },
      { name: 'Gypsum False Ceiling', slug: 'gypsum-false-ceiling', shortDescription: 'Elegant gypsum ceiling designs.', description: 'Premium gypsum ceilings with smooth finish and modern lighting integration.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', isActive: true, sortOrder: 2 },
      { name: 'POP False Ceiling', slug: 'pop-false-ceiling', shortDescription: 'Custom POP ceiling designs.', description: 'Intricate POP designs for decorative interiors.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', isActive: true, sortOrder: 3 },
      { name: 'Ceiling Lighting', slug: 'ceiling-lighting', shortDescription: 'LED and concealed lighting solutions.', description: 'Comprehensive lighting solutions including LED strips and cove lighting.', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', isActive: true, sortOrder: 4 },
      { name: 'Interior Ceiling Design', slug: 'interior-ceiling-design', shortDescription: 'Custom ceiling designs.', description: 'Tailored ceiling designs for your space.', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', isActive: true, sortOrder: 5 },
      { name: 'Residential False Ceiling', slug: 'residential-false-ceiling', shortDescription: 'Home ceiling solutions.', description: 'Complete residential false ceiling work.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', isActive: true, sortOrder: 6 },
      { name: 'Commercial False Ceiling', slug: 'commercial-false-ceiling', shortDescription: 'Commercial ceiling solutions.', description: 'Professional ceilings for offices and shops.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', isActive: true, sortOrder: 7 }
    ]);

    await Project.insertMany([
      { title: 'Modern Living Room Ceiling', slug: 'modern-living-room-ceiling', category: 'False Ceiling', location: 'Jyotikuchi, Guwahati', description: 'A sleek modern false ceiling with integrated LED strip lighting.', coverImage: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', isFeatured: true, sortOrder: 1 },
      { title: 'Gypsum Ceiling for Premium Bedroom', slug: 'gypsum-ceiling-premium-bedroom', category: 'Gypsum Ceiling', location: 'Shantipur, Guwahati', description: 'Elegant gypsum false ceiling with cove lighting.', coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', isFeatured: true, sortOrder: 2 },
      { title: 'Office Cabin Ceiling Work', slug: 'office-cabin-ceiling-work', category: 'Commercial', location: 'GS Road, Guwahati', description: 'Professional false ceiling installation for a corporate office.', coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', isFeatured: true, sortOrder: 3 },
      { title: 'Decorative POP Ceiling', slug: 'decorative-pop-ceiling', category: 'POP Ceiling', location: 'Dispur, Guwahati', description: 'Intricate POP ceiling design with decorative mouldings.', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', sortOrder: 4 },
      { title: 'LED Lighting Integration', slug: 'led-lighting-integration', category: 'Lighting', location: 'Khanapara, Guwahati', description: 'Complete ceiling lighting redesign with LED strip lights.', coverImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', isFeatured: true, sortOrder: 5 },
      { title: 'Apartment Complex Ceiling Work', slug: 'apartment-complex-ceiling', category: 'Residential', location: 'Aminjari, Guwahati', description: 'False ceiling work for a residential apartment.', coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', sortOrder: 6 },
      { title: 'Showroom Ceiling Design', slug: 'showroom-ceiling-design', category: 'Commercial', location: 'Fancy Bazar, Guwahati', description: 'Eye-catching false ceiling design for a retail showroom.', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', sortOrder: 7 },
      { title: 'Dining Room Ceiling', slug: 'dining-room-ceiling', category: 'Residential', location: 'Christianbasti, Guwahati', description: 'An elegant dining room ceiling with circular design.', coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', sortOrder: 8 }
    ]);

    await Gallery.insertMany([
      { image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', title: 'Modern Ceiling Design', category: 'False Ceiling' },
      { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', title: 'Luxury Interior', category: 'Residential' },
      { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', title: 'Elegant Ceiling', category: 'POP Ceiling' },
      { image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', title: 'Bedroom Ceiling', category: 'Gypsum Ceiling' },
      { image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', title: 'Lighting Design', category: 'Lighting' },
      { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', title: 'Office Space', category: 'Commercial' }
    ]);

    await Testimonial.insertMany([
      { name: 'Rahul S.', review: 'Excellent service and quality materials. Highly recommended!', rating: 5 },
      { name: 'Priyam D.', review: 'Finished on time with clean work. Very professional.', rating: 5 },
      { name: 'Ankita M.', review: 'Perfect lighting work, adds a classy vibe to our home.', rating: 5 }
    ]);

    await FAQ.insertMany([
      { question: 'What is a false ceiling?', answer: 'A secondary ceiling installed below the main ceiling for aesthetics and functionality.', sortOrder: 1 },
      { question: 'What types do you provide?', answer: 'Gypsum, POP, and designer ceiling solutions.', sortOrder: 2 },
      { question: 'Do you provide gypsum work?', answer: 'Yes, we specialize in gypsum ceiling installation.', sortOrder: 3 },
      { question: 'Do you provide POP work?', answer: 'Yes, custom POP designs for decorative interiors.', sortOrder: 4 },
      { question: 'Can you integrate LED lighting?', answer: 'Yes, we specialize in LED integration.', sortOrder: 5 },
      { question: 'How to get a quotation?', answer: 'Call 076360 08047 or use the contact form.', sortOrder: 6 },
      { question: 'Which areas do you serve?', answer: 'All areas of Guwahati and nearby.', sortOrder: 7 }
    ]);

    console.log('Database seeded successfully');
  }

  const app = express();

  // Security middleware
  app.use(helmet({ 
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
        connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
        mediaSrc: ["'self'", "https:", "http:"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", "https://www.google.com"],
        frameAncestors: ["'self'"]
      }
    }
  }));
  app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
  app.use(mongoSanitize());

  // Rate limiting
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
  app.use('/api/', limiter);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // API Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/settings', require('./routes/settings'));
  app.use('/api/services', require('./routes/services'));
  app.use('/api/projects', require('./routes/projects'));
  app.use('/api/gallery', require('./routes/gallery'));
  app.use('/api/testimonials', require('./routes/testimonials'));
  app.use('/api/faqs', require('./routes/faqs'));
  app.use('/api/enquiries', require('./routes/enquiries'));
  app.use('/api/upload', require('./routes/upload'));
  app.use('/api/sitemap', require('./routes/sitemap'));

  // Serve React build in production
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get(/^\/(?!api|uploads).*/, (req, res) => {
    const indexPath = path.join(clientBuild, 'index.html');
    const fs = require('fs');
    if (fs.existsSync(indexPath)) res.sendFile(indexPath);
    else res.status(404).send('Not found');
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message === 'Only image files (JPG, PNG, WebP) are allowed') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch(err => { console.error('Startup error:', err); process.exit(1); });
