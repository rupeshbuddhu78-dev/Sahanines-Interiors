const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  category: { type: String, required: true, enum: ['False Ceiling', 'Gypsum Ceiling', 'POP Ceiling', 'Lighting', 'Residential', 'Commercial'] },
  location: { type: String, default: 'Guwahati' },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  gallery: [{ type: String }],
  altText: { type: String, default: '' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
