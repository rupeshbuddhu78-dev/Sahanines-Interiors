const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema(
  {
    // Branding
    websiteName: { type: String, default: 'Sahanines Interiors' },
    companyName: { type: String, default: 'Sahanines Interiors Pvt. Ltd.' },
    tagline: { type: String, default: 'Crafting Spaces, Curating Lifestyles' },
    logo: { url: String, publicId: String, folder: String, width: Number, height: Number, format: String, createdTime: Date },
    favicon: { url: String, publicId: String, folder: String, width: Number, height: Number, format: String, createdTime: Date },

    // Hero
    hero: {
      title: { type: String, default: 'Interiors that Inspire, Craftsmanship that Endures' },
      subtitle: {
        type: String,
        default:
          'Award-winning residential and commercial interior design with over a decade of premium execution.',
      },
      ctaText: { type: String, default: 'Get Free Quote' },
      background: { url: String, publicId: String, folder: String, width: Number, height: Number, format: String, createdTime: Date },
      videoUrl: String,
    },

    // About
    about: {
      story: { type: String, default: '' },
      mission: { type: String, default: 'Deliver exceptional interiors on time, on budget, without compromise.' },
      vision: { type: String, default: 'Be the most trusted name in premium interior craftsmanship.' },
      yearsExperience: { type: Number, default: 12 },
      projectsCompleted: { type: Number, default: 450 },
      happyClients: { type: Number, default: 380 },
      awards: { type: Number, default: 18 },
    },

    // Contact
    contact: {
      address: { type: String, default: 'Guwahati, Assam, India' },
      phone: { type: String, default: '+91 7636 008 047' },
      whatsapp: { type: String, default: '+91 7636 008 047' },
      email: { type: String, default: 'sahanines01@gmail.com' },
      workingHours: { type: String, default: 'Mon - Sat: 09:30 - 19:00' },
      googleMapsEmbed: { type: String, default: '' },
    },

    // Social
    social: {
      facebook: String,
      instagram: { type: String, default: 'https://instagram.com/sahanines' },
      youtube: String,
      linkedin: String,
      twitter: String,
      pinterest: String,
    },

    // Footer
    footer: {
      description: {
        type: String,
        default: 'Sahanines Interiors — bespoke turnkey interior design for homes and businesses.',
      },
      copyright: {
        type: String,
        default: '© {year} Sahanines Interiors. All rights reserved.',
      },
    },

    // SEO
    seo: {
      title: { type: String, default: 'Sahanines Interiors | Premium Interior Design' },
      description: {
        type: String,
        default:
          'Sahanines Interiors — false ceiling, PVC, POP, gypsum, woodwork and complete home & commercial interior design services.',
      },
      keywords: {
        type: [String],
        default: [
          'interior design',
          'false ceiling',
          'PVC ceiling',
          'POP design',
          'wood work',
          'home interior',
          'commercial interior',
          'interior design Guwahati',
          'false ceiling Assam',
        ],
      },
      ogImage: { url: String, publicId: String, folder: String, width: Number, height: Number, format: String, createdTime: Date },
      googleVerification: String,
      googleAnalyticsId: String,
    },

    // Maintenance
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'We will be back shortly.' },
  },
  { timestamps: true }
);

// Singleton pattern - always return the single settings document
websiteSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);
