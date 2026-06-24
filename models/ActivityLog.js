const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  action: { type: String, required: true },
  detail: { type: String },
  type: { type: String, default: 'info' },
  time: { type: String },
  ts: { type: Number },
  restored: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
