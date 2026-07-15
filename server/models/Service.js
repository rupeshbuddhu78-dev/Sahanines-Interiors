const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    description: { type: String, required: true },
    icon: String, // e.g. 'ceiling', 'wood', 'led'
    banner: { url: String, publicId: String, folder: String, width: Number, height: Number, format: String, createdTime: { type: Date, default: Date.now } },
    gallery: [{ url: String, publicId: String, folder: String, width: Number, height: Number, format: String, createdTime: { type: Date, default: Date.now } }],
    benefits: [String],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    startingPrice: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
