const mongoose = require('mongoose');

const imageSubSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    folder: String,
    width: Number,
    height: Number,
    format: String,
    createdTime: { type: Date, default: Date.now },
  },
  { _id: false }
);

const beforeAfterProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    customerName: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    description: { type: String, maxlength: 4000 },
    projectType: {
      type: String,
      enum: [
        'false-ceiling',
        'pvc-ceiling',
        'gypsum-ceiling',
        'pop-ceiling',
        'wood-ceiling',
        'led-ceiling',
        'office-interior',
        'commercial-interior',
        'residential-interior',
        'other',
      ],
      required: true,
      index: true,
    },
    completionDate: Date,
    beforeImage: { type: imageSubSchema, required: true },
    afterImage: { type: imageSubSchema, required: true },
    additionalImages: [imageSubSchema],
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

beforeAfterProjectSchema.index({
  title: 'text',
  customerName: 'text',
  location: 'text',
  description: 'text',
});

module.exports = mongoose.model('BeforeAfterProject', beforeAfterProjectSchema);
