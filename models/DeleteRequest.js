const mongoose = require('mongoose');

const deleteRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // 'sale', 'expense', 'payment'
  recordId: { type: String, required: true },
  requestedBy: { type: String, required: true },
  requestedByName: { type: String },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: String },
  reviewedByName: { type: String },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('DeleteRequest', deleteRequestSchema);
