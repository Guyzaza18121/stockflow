const express = require('express');
const Sale = require('../models/Sale');
const Trash = require('../models/Trash');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, checkRole(['admin', 'manager', 'user']), async (req, res) => {
  try {
    const sale = new Sale({ ...req.body, createdBy: req.user.id, updatedBy: req.user.id });
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, checkRole(['admin', 'manager', 'user']), async (req, res) => {
  try {
    const sale = await Sale.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedBy: req.user.id },
      { new: true }
    );
    if (!sale) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const sale = await Sale.findOne({ id: req.params.id });
    if (!sale) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await Trash.create({ originalId: sale.id || sale._id.toString(), type: 'sale', data: sale.toObject(), deletedBy: req.user.id, deletedByName: req.user.name });
    await sale.deleteOne();
    res.json({ message: 'ย้ายไป Trash สำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
