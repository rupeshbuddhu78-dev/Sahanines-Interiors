const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  businessName: { type: String, default: 'Sahanines Interiors' },
  tagline: { type: String, default: 'False Ceiling & Interior Design in Guwahati' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  phone: { type: String, default: '076360 08047' },
  whatsapp: { type: String, default: '917636008047' },
  email: { type: String, default: '' },
  address: {
    line1: { type: String, default: 'House No. 4, Shantipur, Ashram Road' },
    line2: { type: String, default: 'Jyotikuchi, Guwahati, Assam 781009' },
    full: { type: String, default: 'House No. 4, Shantipur, Ashram Road, Jyotikuchi, Guwahati, Assam 781009' }
  },
  googleMapsUrl: { type: String, default: '' },
  googleMapsEmbed: { type: String, default: '' },
  googleBusinessUrl: { type: String, default: '' },
  googleReviewUrl: { type: String, default: '' },
  googleRating: { type: Number, default: 5.0 },
  googleReviewsCount: { type: Number, default: 318 },
  plusCode: { type: String, default: '4PGJ+R4 Guwahati, Assam' },
  social: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  hero: {
    heading: { type: String, default: 'Premium False Ceiling & Interior Solutions in Guwahati' },
    subtitle: { type: String, default: 'Modern false ceiling designs, gypsum and POP ceiling work, lighting solutions and professional interior finishing by Sahanines Interiors.' },
    image: { type: String, default: '' },
    ctaPrimary: { type: String, default: 'Get Free Quote' },
    ctaSecondary: { type: String, default: 'View Our Projects' }
  },
  footer: {
    description: { type: String, default: 'Professional false ceiling and interior solutions in Guwahati, Assam. Quality materials, modern designs, and clean finishing.' },
    copyright: { type: String, default: '© 2024 Sahanines Interiors. All rights reserved.' }
  },
  theme: {
    primaryColor: { type: String, default: '#1a1a2e' },
    secondaryColor: { type: String, default: '#c9a96e' },
    accentColor: { type: String, default: '#e8d5b7' },
    buttonColor: { type: String, default: '#c9a96e' }
  },
  seo: {
    defaultTitle: { type: String, default: 'Sahanines Interiors | False Ceiling & Interior Design in Guwahati' },
    defaultDescription: { type: String, default: 'Sahanines Interiors provides professional false ceiling, gypsum ceiling, POP ceiling, ceiling lighting and interior solutions in Guwahati, Assam. Contact us for a quote.' },
    ogImage: { type: String, default: '' },
    googleVerification: { type: String, default: '' },
    analyticsId: { type: String, default: '' },
    searchConsoleVerification: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
