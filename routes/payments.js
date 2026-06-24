const express = require('express');
const Payment = require('../models/Payment');
const Trash = require('../models/Trash');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, checkRole(['admin', 'manager', 'user']), async (req, res) => {
  try {
    const payment = new Payment({ ...req.body, createdBy: req.user.id, updatedBy: req.user.id });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, checkRole(['admin', 'manager', 'user']), async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedBy: req.user.id },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const payment = await Payment.findOne({ id: req.params.id });
    if (!payment) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await Trash.create({ originalId: payment.id || payment._id.toString(), type: 'payment', data: payment.toObject(), deletedBy: req.user.id, deletedByName: req.user.name });
    await payment.deleteOne();
    res.json({ message: 'ย้ายไป Trash สำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
