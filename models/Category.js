const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true, default: () => Math.random().toString(36).slice(2) },
  type: { type: String, enum: ['sale', 'expense', 'payment'], required: true },
  label: { type: String, required: true },
  color: { type: String },
  items: [{
    id: { type: String, required: true },
    label: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
