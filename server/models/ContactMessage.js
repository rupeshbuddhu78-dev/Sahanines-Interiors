const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: String,
    service: String,
    budget: String,
    propertyType: String,
    message: { type: String, required: true, maxlength: 5000 },
    referenceImage: {
      url: String,
      publicId: String,
      folder: String,
      width: Number,
      height: Number,
      format: String,
      createdTime: { type: Date, default: Date.now },
    },

    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'archived', 'deleted'],
      default: 'unread',
      index: true,
    },
    isStarred: { type: Boolean, default: false, index: true },
    replyStatus: { type: String, enum: ['pending', 'replied'], default: 'pending' },
    replies: [
      {
        message: String,
        repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        repliedAt: { type: Date, default: Date.now },
      },
    ],
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

contactMessageSchema.index({
  name: 'text',
  email: 'text',
  phone: 'text',
  message: 'text',
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
