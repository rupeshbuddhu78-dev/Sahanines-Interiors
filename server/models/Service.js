const mongoose = require('mongoose');
const slugify = require('slugify');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  altText: { type: String, default: '' },
  benefits: [{ type: String }],
  applications: [{ type: String }],
  faqs: [{
    question: String,
    answer: String
  }],
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

serviceSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
