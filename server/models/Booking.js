const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, trim: true },
    preferredDate: Date,
    preferredTime: String,
    service: { type: String, required: true },
    budget: String,
    message: { type: String, maxlength: 3000 },
    propertyType: String,
    referenceImages: [
      {
        url: String,
        publicId: String,
        folder: String,
        width: Number,
        height: Number,
        format: String,
        createdTime: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    adminNotes: String,
    source: { type: String, default: 'website' },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

bookingSchema.index({ name: 'text', email: 'text', phone: 'text', message: 'text' });

module.exports = mongoose.model('Booking', bookingSchema);
