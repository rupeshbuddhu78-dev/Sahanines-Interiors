const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  service: { type: String, default: '' },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Completed', 'Closed'],
    default: 'New'
  }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
