require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const SiteSettings = require('../models/SiteSettings');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');

const seed = async () => {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Admin.deleteMany({}),
    SiteSettings.deleteMany({}),
    Service.deleteMany({}),
    Project.deleteMany({}),
    Gallery.deleteMany({}),
    Testimonial.deleteMany({}),
    FAQ.deleteMany({})
  ]);
  console.log('Cleared existing data');

  // Create admin
  await Admin.create({ name: 'Admin', email: 'admin@sahanines.com', password: 'admin123' });
  console.log('Admin created: admin@sahanines.com / admin123');

  // Create site settings
  await SiteSettings.create({});
  console.log('Site settings created');

  // Create services
  const services = [
    { name: 'False Ceiling', shortDescription: 'Modern and professionally finished false ceiling solutions for homes, offices and commercial spaces.', description: 'Our false ceiling solutions transform ordinary spaces into elegant, modern environments. We provide comprehensive false ceiling installation services that combine aesthetic appeal with practical benefits including improved insulation, acoustic control, and integrated lighting options. Each installation is carried out with precision and attention to detail, ensuring a clean finish that complements your interior design.', image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', altText: 'Modern false ceiling installation in Guwahati by Sahanines Interiors', benefits: ['Enhanced room aesthetics', 'Improved insulation and acoustics', 'Concealed wiring and pipes', 'Integrated lighting options', 'Fire-resistant materials available'], applications: ['Living rooms', 'Bedrooms', 'Offices', 'Commercial spaces', 'Hotels and restaurants'], faqs: [{ question: 'What is a false ceiling?', answer: 'A false ceiling is a secondary ceiling installed below the main ceiling, creating a gap that can house lighting, wiring, and insulation. It enhances the visual appeal and functionality of a space.' }, { question: 'How long does false ceiling installation take?', answer: 'Installation time varies based on room size and design complexity. A standard room typically takes 2-4 days for complete installation.' }], seoTitle: 'False Ceiling Services in Guwahati | Sahanines Interiors', seoDescription: 'Professional false ceiling installation in Guwahati. Modern designs, quality materials, and expert finishing for residential and commercial spaces.', sortOrder: 1 },
    { name: 'Gypsum False Ceiling', shortDescription: 'Elegant gypsum ceiling designs with clean finishing and modern lighting integration.', description: 'Gypsum false ceilings offer a premium, smooth finish that is ideal for modern interiors. Gypsum boards are lightweight, easy to install, and provide excellent fire resistance. They create a seamless surface perfect for concealing lighting fixtures, air conditioning ducts, and electrical wiring. Our gypsum ceiling installations are known for their precision and durability.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', altText: 'Gypsum false ceiling design in Guwahati', benefits: ['Smooth and seamless finish', 'Lightweight and durable', 'Fire resistant', 'Easy to maintain', 'Perfect for modern interiors'], applications: ['Bedrooms', 'Living rooms', 'Office cabins', 'Conference rooms', 'Retail stores'], faqs: [{ question: 'What is gypsum false ceiling?', answer: 'Gypsum false ceiling uses gypsum boards to create a smooth, premium ceiling surface. It is lightweight, fire-resistant, and ideal for modern interior designs.' }, { question: 'Is gypsum ceiling good for homes?', answer: 'Yes, gypsum ceilings are excellent for homes. They provide a clean, modern look, improve insulation, and can integrate seamlessly with lighting systems.' }], seoTitle: 'Gypsum False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Premium gypsum false ceiling installation in Guwahati. Smooth finish, fire-resistant materials, and modern designs for your home or office.', sortOrder: 2 },
    { name: 'POP False Ceiling', shortDescription: 'Custom POP ceiling designs for decorative and premium interiors.', description: 'Plaster of Paris (POP) false ceilings allow for intricate decorative designs and custom shapes. POP is a versatile material that can be moulded into various patterns, curves, and ornamental designs. Our POP ceiling work combines traditional craftsmanship with modern techniques to create stunning ceiling designs that become focal points of your interior space.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', altText: 'POP false ceiling design in Guwahati', benefits: ['Custom decorative designs', 'Intricate patterns and curves', 'Durable and long-lasting', 'Cost-effective', 'Versatile design options'], applications: ['Drawing rooms', 'Banquet halls', 'Restaurants', 'Traditional interiors', 'Luxury homes'], faqs: [{ question: 'What is POP false ceiling?', answer: 'POP (Plaster of Paris) false ceiling uses plaster material to create decorative ceiling designs. It allows for intricate patterns, curves, and custom shapes.' }, { question: 'How is POP different from gypsum?', answer: 'POP is applied as a plaster and allows more intricate decorative work, while gypsum comes in pre-made boards. POP is generally more cost-effective for complex designs.' }], seoTitle: 'POP False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Custom POP false ceiling designs in Guwahati. Decorative plaster ceiling work for homes, halls, and commercial spaces.', sortOrder: 3 },
    { name: 'Ceiling Lighting', shortDescription: 'LED lighting, concealed lighting, cove lighting and ceiling-integrated lighting solutions.', description: 'Lighting is an essential element of ceiling design. We provide comprehensive ceiling lighting solutions including LED strip lighting, cove lighting, recessed lights, pendant lights, and concealed lighting systems. Our lighting designs enhance the ambiance of your space while ensuring energy efficiency and easy maintenance.', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', altText: 'Ceiling lighting design in Guwahati', benefits: ['Energy-efficient LED options', 'Ambient and accent lighting', 'Concealed wiring', 'Custom lighting layouts', 'Reduced electricity costs'], applications: ['Living rooms', 'Bedrooms', 'Hallways', 'Commercial spaces', 'Showrooms'], faqs: [{ question: 'Can LED lights be integrated into false ceilings?', answer: 'Yes, LED strip lights, recessed lights, and cove lighting can all be seamlessly integrated into false ceiling designs for beautiful ambient lighting.' }], seoTitle: 'Ceiling Lighting Solutions in Guwahati | Sahanines Interiors', seoDescription: 'Professional ceiling lighting installation in Guwahati. LED, cove, and concealed lighting integrated with your false ceiling design.', sortOrder: 4 },
    { name: 'Interior Ceiling Design', shortDescription: 'Modern ceiling concepts designed according to room size, furniture, lighting and overall interior style.', description: 'Every space is unique, and ceiling design should complement the overall interior. Our interior ceiling design service considers room dimensions, furniture layout, lighting requirements, and your personal style to create ceiling designs that enhance the complete interior experience. From concept to execution, we ensure every detail is thoughtfully planned.', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', altText: 'Interior ceiling design in Guwahati', benefits: ['Customized to your space', 'Harmonized with interior style', 'Professional design consultation', '3D design visualization', 'Expert execution'], applications: ['New homes', 'Renovation projects', 'Office interiors', 'Showrooms', 'Premium residences'], faqs: [{ question: 'Do you provide design consultation?', answer: 'Yes, we provide complete design consultation. We assess your space, understand your requirements, and suggest ceiling designs that complement your interior.' }], seoTitle: 'Interior Ceiling Design in Guwahati | Sahanines Interiors', seoDescription: 'Custom interior ceiling design services in Guwahati. Modern ceiling concepts tailored to your space and style.', sortOrder: 5 },
    { name: 'Residential False Ceiling', shortDescription: 'False ceiling solutions for bedrooms, living rooms, dining areas, kitchens and other residential spaces.', description: 'Transform your home with our residential false ceiling solutions. We understand that every room in your home serves a different purpose, and we design ceilings accordingly. From elegant living room ceilings to functional kitchen solutions, our residential work focuses on creating comfortable, beautiful living spaces that reflect your personality.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', altText: 'Residential false ceiling in Guwahati', benefits: ['Room-specific designs', 'Enhanced home aesthetics', 'Improved insulation', 'Noise reduction', 'Increased property value'], applications: ['Bedrooms', 'Living rooms', 'Dining areas', 'Kitchens', 'Pooja rooms'], faqs: [{ question: 'Do you work on residential projects?', answer: 'Yes, we specialize in residential false ceiling work. We design and install ceilings for all rooms in your home including bedrooms, living rooms, and kitchens.' }], seoTitle: 'Residential False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Home false ceiling installation in Guwahati. Bedroom, living room, and kitchen ceiling designs for residential spaces.', sortOrder: 6 },
    { name: 'Commercial False Ceiling', shortDescription: 'Professional ceiling solutions for offices, shops, showrooms and commercial spaces.', description: 'Commercial spaces require ceilings that balance aesthetics with functionality. Our commercial false ceiling services are designed to create professional environments that impress clients and provide comfortable working conditions. We handle projects of all sizes, from small offices to large commercial complexes, ensuring timely completion and quality finishing.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', altText: 'Commercial false ceiling in Guwahati', benefits: ['Professional appearance', 'Acoustic management', 'Fire safety compliance', 'Easy maintenance access', 'Scalable solutions'], applications: ['Offices', 'Retail shops', 'Showrooms', 'Restaurants', 'Hotels'], faqs: [{ question: 'Do you handle commercial projects?', answer: 'Yes, we provide commercial false ceiling solutions for offices, shops, showrooms, restaurants, and other commercial spaces in Guwahati.' }], seoTitle: 'Commercial False Ceiling in Guwahati | Sahanines Interiors', seoDescription: 'Commercial false ceiling contractor in Guwahati. Office, shop, and showroom ceiling solutions with professional finishing.', sortOrder: 7 }
  ];
  await Service.insertMany(services);
  console.log(`${services.length} services created`);

  // Create projects
  const projects = [
    { title: 'Modern Living Room Ceiling', category: 'False Ceiling', location: 'Jyotikuchi, Guwahati', description: 'A sleek modern false ceiling with integrated LED strip lighting and recessed spotlights. The design features clean lines and a minimalist approach that complements the contemporary furniture.', coverImage: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', altText: 'Modern living room false ceiling project in Guwahati', isFeatured: true, sortOrder: 1 },
    { title: 'Gypsum Ceiling for Premium Bedroom', category: 'Gypsum Ceiling', location: 'Shantipur, Guwahati', description: 'Elegant gypsum false ceiling with cove lighting around the perimeter. The smooth finish and warm lighting create a relaxing bedroom atmosphere.', coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', altText: 'Gypsum ceiling bedroom project in Guwahati', isFeatured: true, sortOrder: 2 },
    { title: 'Office Cabin Ceiling Work', category: 'Commercial', location: 'GS Road, Guwahati', description: 'Professional false ceiling installation for a corporate office cabin. The design includes acoustic panels, recessed lighting, and a clean modern finish.', coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', altText: 'Office ceiling project in Guwahati', isFeatured: true, sortOrder: 3 },
    { title: 'Decorative POP Ceiling', category: 'POP Ceiling', location: 'Dispur, Guwahati', description: 'Intricate POP ceiling design with decorative mouldings and a central chandelier point. The design adds a touch of elegance to this traditional living room.', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', altText: 'POP ceiling design project in Guwahati', sortOrder: 4 },
    { title: 'LED Lighting Integration', category: 'Lighting', location: 'Khanapara, Guwahati', description: 'Complete ceiling lighting redesign with LED strip lights, recessed downlights, and a statement pendant light. The lighting transforms the ambiance of this living space.', coverImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', altText: 'Ceiling lighting project in Guwahati', isFeatured: true, sortOrder: 5 },
    { title: 'Apartment Complex Ceiling Work', category: 'Residential', location: 'Aminjari, Guwahati', description: 'False ceiling work for a residential apartment including living room, bedrooms, and dining area. Each room has a unique design suited to its function.', coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', altText: 'Residential ceiling project in Guwahati', sortOrder: 6 },
    { title: 'Showroom Ceiling Design', category: 'Commercial', location: 'Fancy Bazar, Guwahati', description: 'Eye-catching false ceiling design for a retail showroom. The ceiling features modern geometric patterns with integrated track lighting to highlight products.', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', altText: 'Showroom ceiling project in Guwahati', sortOrder: 7 },
    { title: 'Dining Room Ceiling', category: 'Residential', location: 'Christianbasti, Guwahati', description: 'An elegant dining room ceiling with a circular design element and warm cove lighting that creates a welcoming atmosphere for family gatherings.', coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', altText: 'Dining room ceiling project in Guwahati', sortOrder: 8 }
  ];
  await Project.insertMany(projects);
  console.log(`${projects.length} projects created`);

  // Create gallery images
  const galleryImages = [
    { image: 'https://images.unsplash.com/photo-1618221195775-dd6882f1b695?w=800&q=80', title: 'Modern Ceiling Design', category: 'False Ceiling', altText: 'Modern false ceiling design', caption: 'Contemporary false ceiling with LED lighting' },
    { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', title: 'Luxury Interior', category: 'Residential', altText: 'Luxury interior ceiling', caption: 'Premium residential ceiling work' },
    { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', title: 'Elegant Ceiling', category: 'POP Ceiling', altText: 'Elegant POP ceiling', caption: 'Decorative POP ceiling design' },
    { image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', title: 'Bedroom Ceiling', category: 'Gypsum Ceiling', altText: 'Bedroom gypsum ceiling', caption: 'Gypsum ceiling with cove lighting' },
    { image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', title: 'Lighting Design', category: 'Lighting', altText: 'Ceiling lighting design', caption: 'Integrated ceiling lighting system' },
    { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', title: 'Office Space', category: 'Commercial', altText: 'Office ceiling design', caption: 'Modern office ceiling installation' },
    { image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', title: 'Living Room', category: 'Residential', altText: 'Living room ceiling', caption: 'Spacious living room with false ceiling' },
    { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', title: 'Interior Design', category: 'False Ceiling', altText: 'Interior ceiling design', caption: 'Custom ceiling design for modern home' },
    { image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', title: 'Kitchen Ceiling', category: 'Residential', altText: 'Kitchen false ceiling', caption: 'Functional kitchen ceiling design' },
    { image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', title: 'Bathroom Ceiling', category: 'Gypsum Ceiling', altText: 'Bathroom ceiling', caption: 'Moisture-resistant bathroom ceiling' },
    { image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80', title: 'Hall Ceiling', category: 'POP Ceiling', altText: 'Hall POP ceiling', caption: 'Grand hall ceiling with ornamental design' },
    { image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', title: 'Commercial Space', category: 'Commercial', altText: 'Commercial ceiling', caption: 'Professional commercial ceiling work' }
  ];
  await Gallery.insertMany(galleryImages);
  console.log(`${galleryImages.length} gallery images created`);

  // Create testimonials
  const testimonials = [
    { name: 'Rahul S.', review: 'Excellent service, high-quality materials, and very polite staff. The false ceiling in our living room looks stunning. Highly recommended for anyone in Guwahati looking for quality ceiling work.', rating: 5 },
    { name: 'Priyam D.', review: 'They finished the work on time and kept the place clean during installation. The gypsum ceiling in our bedroom is perfect. Very professional team.', rating: 5 },
    { name: 'Ankita M.', review: 'The lighting work is just perfect, adding a soft and classy vibe to our home. Sahanines Interiors understood exactly what we wanted and delivered beyond expectations.', rating: 5 },
    { name: 'Bikash T.', review: 'Very satisfied with the POP ceiling work in our drawing room. The design is elegant and the finishing is top-notch. The team was punctual and professional.', rating: 5 },
    { name: 'Deepa G.', review: 'We got our office ceiling done by Sahanines Interiors. The work quality is excellent and the team was very cooperative. They handled the commercial project with great professionalism.', rating: 5 }
  ];
  await Testimonial.insertMany(testimonials);
  console.log(`${testimonials.length} testimonials created`);

  // Create FAQs
  const faqs = [
    { question: 'What is a false ceiling?', answer: 'A false ceiling is a secondary ceiling installed below the original ceiling, creating a gap that can be used for lighting, wiring, insulation, and decorative purposes. It enhances the aesthetics and functionality of any room.', sortOrder: 1 },
    { question: 'What types of false ceilings do you provide in Guwahati?', answer: 'We provide gypsum false ceilings, POP (Plaster of Paris) false ceilings, and various designer ceiling solutions. Each type has its own advantages depending on the design requirements and budget.', sortOrder: 2 },
    { question: 'Do you provide gypsum false ceiling work?', answer: 'Yes, we specialize in gypsum false ceiling installation. Gypsum ceilings offer a smooth, premium finish and are ideal for modern interiors. They are lightweight, fire-resistant, and easy to maintain.', sortOrder: 3 },
    { question: 'Do you provide POP false ceiling work?', answer: 'Yes, we provide custom POP false ceiling designs. POP allows for intricate decorative patterns and curves, making it ideal for traditional and ornamental ceiling designs.', sortOrder: 4 },
    { question: 'Can you integrate LED lighting into a false ceiling?', answer: 'Absolutely. We specialize in integrating LED strip lights, recessed lights, cove lighting, and pendant lights into false ceiling designs. Lighting integration is one of our key strengths.', sortOrder: 5 },
    { question: 'Do you provide residential false ceiling work?', answer: 'Yes, we provide false ceiling solutions for all residential spaces including bedrooms, living rooms, dining areas, kitchens, and pooja rooms across Guwahati.', sortOrder: 6 },
    { question: 'Do you provide commercial false ceiling work?', answer: 'Yes, we handle commercial projects including offices, retail shops, showrooms, restaurants, and hotels. Our commercial ceiling solutions balance aesthetics with functionality.', sortOrder: 7 },
    { question: 'How can I get a quotation?', answer: 'You can get a free quotation by calling us at 076360 08047, sending a WhatsApp message, or filling out the enquiry form on our website. We will assess your requirements and provide a detailed estimate.', sortOrder: 8 },
    { question: 'Which areas of Guwahati do you serve?', answer: 'We serve all areas of Guwahati including Jyotikuchi, Shantipur, GS Road, Dispur, Khanapara, Christianbasti, Fancy Bazar, Aminjari, and surrounding areas in Assam.', sortOrder: 9 },
    { question: 'How can I contact Sahanines Interiors?', answer: 'You can reach us by phone at 076360 08047, through WhatsApp, or visit us at House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, Assam 781009. You can also use the contact form on our website.', sortOrder: 10 }
  ];
  await FAQ.insertMany(faqs);
  console.log(`${faqs.length} FAQs created`);

  console.log('\nSeed completed successfully!');
  console.log('Admin login: admin@sahanines.com / admin123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
