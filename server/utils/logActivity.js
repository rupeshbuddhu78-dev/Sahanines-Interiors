const ActivityLog = require('../models/ActivityLog');

async function logActivity({ admin, action, entity, entityId, details, ipAddress }) {
  try {
    await ActivityLog.create({
      admin: admin?._id,
      adminName: admin?.name,
      action,
      entity,
      entityId,
      details,
      ipAddress,
    });
  } catch (err) {
    console.error('[ActivityLog] Failed:', err.message);
  }
}

module.exports = logActivity;
