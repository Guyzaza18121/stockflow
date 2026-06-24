const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cat: { type: String, required: true }, // หมวดหมู่
  unit: { type: String, required: true }, // หน่วยนับ
  qty: { type: Number, required: true, default: 0 }, // จำนวนคงเหลือ
  min: { type: Number, required: true, default: 0 }, // จุดสั่งซื้อ
  bp: { type: Number, required: true, default: 0 }, // ราคารับเข้า/หน่วย
  sp: { type: Number, required: true, default: 0 }, // ราคาเบิก/หน่วย
  loc: { type: String, default: '' }, // ตำแหน่งที่เก็บ
  sup: { type: String, default: '' }, // ซัพพลายเออร์
  hc: { type: Boolean, default: false }, // has conversion
  cf: { type: String, default: '' }, // conversion from (หน่วยที่ซื้อ)
  ct: { type: String, default: '' }, // conversion to (หน่วยที่เก็บ/เบิก)
  cr: { type: Number, default: 1 }, // conversion rate
  createdBy: { type: String },
  updatedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
