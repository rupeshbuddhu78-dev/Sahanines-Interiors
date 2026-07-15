const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 500 },
    answer: { type: String, required: true, maxlength: 5000 },
    category: {
      type: String,
      enum: ['general', 'services', 'pricing', 'process', 'warranty', 'other'],
      default: 'general',
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

faqSchema.index({ question: 'text', answer: 'text' });

module.exports = mongoose.model('Faq', faqSchema);
