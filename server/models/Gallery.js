const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, maxlength: 2000 },
    category: {
      type: String,
      enum: [
        'living-room',
        'bedroom',
        'kitchen',
        'office',
        'commercial',
        'pvc',
        'pop',
        'gypsum',
        'wood',
        'custom',
      ],
      required: true,
      index: true,
    },
    projectName: String,
    location: String,
    completionDate: Date,
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      folder: String,
      width: Number,
      height: Number,
      format: String,
      bytes: Number,
      createdTime: { type: Date, default: Date.now },
    },
    tags: [String],
    isFeatured: { type: Boolean, default: false, index: true },
    isHidden: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

gallerySchema.index({ title: 'text', description: 'text', projectName: 'text', location: 'text' });

module.exports = mongoose.model('Gallery', gallerySchema);
