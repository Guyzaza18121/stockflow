const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  color: { type: String },
  items: [{
    id: { type: String, required: true },
    label: { type: String, required: true },
    jobNo: { type: String },
    jobs: [{ id: String, label: String }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
