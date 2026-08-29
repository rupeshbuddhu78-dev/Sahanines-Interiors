const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: '' },
  category: { type: String, default: 'General' },
  altText: { type: String, default: '' },
  caption: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
