const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  categoryId: { type: String, required: true },
  subItemId: { type: String },
  itemId: { type: String },
  description: { type: String },
  amount: { type: Number, required: true },
  customerId: { type: String },
  jobNo: { type: String },
  note: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
