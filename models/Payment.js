const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  categoryId: { type: String, required: true },
  itemId: { type: String },
  saleItemLabel: { type: String },
  description: { type: String },
  amount: { type: Number, required: true },
  customerId: { type: String },
  jobNo: { type: String },
  fromSaleId: { type: String },
  note: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
