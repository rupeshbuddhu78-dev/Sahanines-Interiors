require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const WebsiteSettings = require('../models/WebsiteSettings');
const Service = require('../models/Service');
const Faq = require('../models/Faq');
const Testimonial = require('../models/Testimonial');

const services = [
  {
    slug: 'false-ceiling',
    title: 'False Ceiling',
    shortDescription:
      'Bespoke false ceilings that transform ambience — gypsum, PVC, wooden, and hybrid systems.',
    description:
      'Our false ceilings combine acoustics, thermal comfort and lighting choreography into a single design language. From minimal cove-lit ceilings to sculptural gypsum installations, every solution is engineered for durability and finished by hand.',
    icon: 'ceiling',
    benefits: [
      'Concealed lighting design',
      'Acoustic and thermal insulation',
      'Hides ducting, wiring and structural imperfections',
      '7-year workmanship warranty',
    ],
    faqs: [
      {
        question: 'How long does a false ceiling installation take?',
        answer:
          'A typical 1000 sq.ft residence takes 10–14 working days including finishing, painting and integrated lighting.',
      },
      {
        question: 'Which is better — gypsum or POP?',
        answer:
          'Gypsum boards are faster to install, cleaner, and offer superior finishing. POP is more malleable for custom curves but requires longer curing and skilled labour.',
      },
    ],
    startingPrice: 'Starting at ₹95 / sq.ft',
    order: 1,
  },
  {
    slug: 'pvc-ceiling',
    title: 'PVC Ceiling',
    shortDescription:
      'Waterproof, termite-resistant PVC ceilings — ideal for kitchens, bathrooms, and humid zones.',
    description:
      'Premium PVC panels with UV-stabilised finishes and a lifetime of low-maintenance elegance. Available in wood, marble, matte and gloss textures.',
    icon: 'panel',
    benefits: ['Waterproof and termite-proof', 'Zero maintenance', 'Fast installation', 'Fire retardant'],
    order: 2,
    startingPrice: 'Starting at ₹65 / sq.ft',
  },
  {
    slug: 'gypsum-ceiling',
    title: 'Gypsum Ceiling',
    shortDescription: 'Sleek, seamless gypsum ceilings with cove lighting and custom cornice detailing.',
    description:
      'Factory-grade Saint-Gobain gypsum systems designed and executed to architectural specifications. Perfect for premium residences and hospitality spaces.',
    icon: 'ceiling',
    benefits: ['Seamless finish', 'Fire retardant', 'Sound absorption', 'Design flexibility'],
    order: 3,
    startingPrice: 'Starting at ₹85 / sq.ft',
  },
  {
    slug: 'pop-ceiling',
    title: 'POP Design',
    shortDescription: 'Handcrafted plaster-of-Paris ceilings with intricate mouldings and cornices.',
    description:
      'The classic choice for those who love ornate detailing. Our POP artisans deliver traditional craftsmanship for palatial homes and luxury villas.',
    icon: 'design',
    benefits: ['Custom mouldings', 'Ornate detailing', 'Timeless elegance', 'Cost-effective'],
    order: 4,
  },
  {
    slug: 'wood-work',
    title: 'Wood Work & Wardrobes',
    shortDescription: 'Modular wardrobes, TV units, kitchens and bespoke joinery in premium veneers.',
    description:
      'Modular and hand-built wood work using BWR grade plywood, Italian laminates, and hardware from Hettich, Blum and Hafele. Lifetime hardware warranty.',
    icon: 'wood',
    benefits: [
      'BWR grade plywood',
      'Premium imported hardware',
      '10-year structural warranty',
      'Space-optimised modular design',
    ],
    order: 5,
    startingPrice: 'Starting at ₹1,250 / sq.ft',
  },
  {
    slug: 'home-interior',
    title: 'Complete Home Interior',
    shortDescription: 'Turnkey residential interiors — from moodboard to move-in day.',
    description:
      'End-to-end home interior packages covering design, procurement, execution and styling. One point of contact, transparent pricing, guaranteed timelines.',
    icon: 'home',
    benefits: ['Turnkey execution', 'Fixed timelines', 'On-site project manager', '45-day delivery packages'],
    order: 6,
  },
  {
    slug: 'commercial-interior',
    title: 'Commercial Interior',
    shortDescription: 'Offices, retail, restaurants and clinics — built for brand and performance.',
    description:
      'We design commercial spaces that deliver on operations and brand. From open-plan offices to boutique retail environments, our commercial team handles licensing, MEP coordination, and phased delivery.',
    icon: 'office',
    benefits: [
      'MEP coordination',
      'Statutory approvals assistance',
      'Phased handovers',
      'After-sales AMC packages',
    ],
    order: 7,
  },
  {
    slug: 'led-ceiling',
    title: 'LED / Cove Lighting',
    shortDescription: 'Architectural lighting design integrated with ceilings, walls and furniture.',
    description:
      'Layered lighting design — ambient, task and accent. All fixtures BIS certified with 5-year warranty.',
    icon: 'led',
    order: 8,
  },
];

const faqs = [
  {
    question: 'How long does a typical project take?',
    answer:
      'A 2-BHK complete interior takes 45–60 days depending on scope. False ceiling and civil works finish in 2–3 weeks. Every project ships with a written timeline signed before kick-off.',
    category: 'process',
    order: 1,
  },
  {
    question: 'Do you provide free site visits and quotations?',
    answer:
      'Yes. Our design consultant visits your property within 48 hours of enquiry, followed by a detailed itemised quote within 3 working days.',
    category: 'pricing',
    order: 2,
  },
  {
    question: 'What warranty do you provide?',
    answer:
      'Woodwork carries a 10-year structural warranty, hardware 10 years, and false ceiling / painting 7 years. Written warranty card handed over on project completion.',
    category: 'warranty',
    order: 3,
  },
  {
    question: 'Do you handle small-scale renovations too?',
    answer:
      'Yes. We take up single-room upgrades, false-ceiling-only jobs, and kitchen refits. Minimum project value is ₹75,000.',
    category: 'services',
    order: 4,
  },
  {
    question: 'How do payments work?',
    answer:
      'Payments are milestone-based: 10% booking, 40% on material procurement, 40% on 70% completion, 10% on handover. No cash payments — everything is digitally tracked.',
    category: 'pricing',
    order: 5,
  },
  {
    question: 'Which locations do you serve?',
    answer:
      'We currently serve Guwahati, Assam and nearby North-East India locations. For projects above 3000 sq.ft we travel pan-India.',
    category: 'general',
    order: 6,
  },
];

const testimonials = [
  {
    customerName: 'Ananya Rao',
    location: 'Dispur, Guwahati',
    role: 'Homeowner, 3BHK',
    rating: 5,
    review:
      'Sahanines delivered our 3BHK in 52 days — on the exact date they promised. The false ceiling and LED cove lighting turned our living room into something out of a magazine. Their project manager was on WhatsApp every single day.',
    isFeatured: true,
    order: 1,
  },
  {
    customerName: 'Karthik & Meera',
    location: 'Beltola, Guwahati',
    role: 'Homeowners',
    rating: 5,
    review:
      'We interviewed six interior firms. Sahanines was the only one that gave us a fully itemised quote, no hidden costs, and stuck to it. Their woodwork team is exceptional.',
    isFeatured: true,
    order: 2,
  },
  {
    customerName: 'Rajesh Menon',
    location: 'Fancy Bazaar, Guwahati',
    role: 'Restaurant Owner',
    rating: 5,
    review:
      'They designed our 2400 sq.ft cafe from concept to handover in 8 weeks. The commercial team handled BBMP approvals and MEP without us lifting a finger.',
    isFeatured: true,
    order: 3,
  },
  {
    customerName: 'Divya Krishnan',
    location: 'Six Mile, Guwahati',
    role: 'Villa Owner',
    rating: 5,
    review:
      'Absolutely premium finish quality. The gypsum ceiling detailing in our foyer stops every guest. Warranty was honoured within 24 hours when we had a minor issue after 8 months.',
    order: 4,
  },
];

const run = async () => {
  try {
    await connectDB();

    // 1. Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sahanines.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Administrator';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'superadmin',
      });
      console.log(`[Seed] Admin created: ${adminEmail}`);
    } else {
      console.log('[Seed] Admin already exists');
    }

    // 2. Website settings singleton
    await WebsiteSettings.getSingleton();
    console.log('[Seed] Website settings ensured');

    // 3. Services
    for (const s of services) {
      await Service.updateOne({ slug: s.slug }, { $setOnInsert: s }, { upsert: true });
    }
    console.log(`[Seed] Services: ${services.length}`);

    // 4. FAQs
    for (const f of faqs) {
      await Faq.updateOne({ question: f.question }, { $setOnInsert: f }, { upsert: true });
    }
    console.log(`[Seed] FAQs: ${faqs.length}`);

    // 5. Testimonials
    for (const t of testimonials) {
      await Testimonial.updateOne(
        { customerName: t.customerName, review: t.review },
        { $setOnInsert: t },
        { upsert: true }
      );
    }
    console.log(`[Seed] Testimonials: ${testimonials.length}`);

    console.log('\n✅ Seed complete.\n');
    console.log(`   Login: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}\n`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Failed:', err);
    process.exit(1);
  }
};

run();
