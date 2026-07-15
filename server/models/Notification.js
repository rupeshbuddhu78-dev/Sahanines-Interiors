const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['booking', 'contact', 'system', 'gallery', 'testimonial'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: String,
    icon: String,
    isRead: { type: Boolean, default: false, index: true },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    relatedId: mongoose.Schema.Types.ObjectId,
    relatedModel: String,
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
