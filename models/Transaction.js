const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['in', 'out'], required: true }, // in = รับเข้า, out = เบิกออก
  sku: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }, // ราคา/หน่วย
  total: { type: Number, required: true },
  cust: { type: String, required: true }, // บริษัทลูกค้าหรือซัพพลายเออร์
  job: { type: String, default: '-' }, // Job/โครงการ
  user: { type: String, required: true }, // ผู้ทำรายการ
  cn: { type: String, default: '' }, // conversion note (หมายเหตุการแปลงหน่วย)
  gid: { type: String, default: '' }, // group id (สำหรับกลุ่มเบิก)
  inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }
}, { timestamps: true });

// Index สำหรับการค้นหา
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ sku: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
