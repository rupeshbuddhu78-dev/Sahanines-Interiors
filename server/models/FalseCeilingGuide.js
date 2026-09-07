const mongoose = require('mongoose');

const falseCeilingGuideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  advantages: [{ type: String }],
  videoUrl: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FalseCeilingGuide', falseCeilingGuideSchema);
