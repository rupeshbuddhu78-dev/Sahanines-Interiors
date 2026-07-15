const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    adminName: String,
    action: { type: String, required: true },
    entity: String,
    entityId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
