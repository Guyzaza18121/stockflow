const express = require('express');
const Trash = require('../models/Trash');
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Payment = require('../models/Payment');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// Get all trash (admin/manager only)
router.get('/', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const trash = await Trash.find().sort({ deletedAt: -1 });
    res.json(trash);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restore from trash
router.post('/:id/restore', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const item = await Trash.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    const data = { ...item.data, _id: undefined };
    if (item.type === 'sale') await Sale.create(data);
    else if (item.type === 'expense') await Expense.create(data);
    else if (item.type === 'payment') await Payment.create(data);

    await Trash.findByIdAndDelete(req.params.id);
    res.json({ message: 'กู้คืนสำเร็จ', type: item.type });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Permanent delete
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    await Trash.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบถาวรสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
