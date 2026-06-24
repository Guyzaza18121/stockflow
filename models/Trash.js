const mongoose = require('mongoose');
const trashSchema = new mongoose.Schema({
  originalId: { type: String, required: true },
  type: { type: String, enum: ['sale', 'expense', 'payment'], required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  deletedBy: { type: String },
  deletedByName: { type: String },
  deletedAt: { type: Date, default: Date.now, expires: 604800 }
}, { timestamps: true });
module.exports = mongoose.model('Trash', trashSchema);
