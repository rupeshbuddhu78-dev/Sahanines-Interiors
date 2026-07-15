const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    location: String,
    role: String, // e.g. "Homeowner", "Restaurant Owner"
    rating: { type: Number, min: 1, max: 5, default: 5 },
    review: { type: String, required: true, maxlength: 2000 },
    customerImage: { url: String, publicId: String, folder: String, width: Number, height: Number, format: String, createdTime: { type: Date, default: Date.now } },
    projectImage: { url: String, publicId: String, folder: String, width: Number, height: Number, format: String, createdTime: { type: Date, default: Date.now } },
    isFeatured: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
