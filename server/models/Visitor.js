const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    ipHash: { type: String, index: true },
    userAgent: String,
    referrer: String,
    path: String,
    country: String,
    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Visitor', visitorSchema);
