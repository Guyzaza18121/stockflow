const express = require('express');
const Expense = require('../models/Expense');
const Trash = require('../models/Trash');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, checkRole(['admin', 'manager', 'user']), async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, createdBy: req.user.id, updatedBy: req.user.id });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, checkRole(['admin', 'manager', 'user']), async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedBy: req.user.id },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const expense = await Expense.findOne({ id: req.params.id });
    if (!expense) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    await Trash.create({ originalId: expense.id || expense._id.toString(), type: 'expense', data: expense.toObject(), deletedBy: req.user.id, deletedByName: req.user.name });
    await expense.deleteOne();
    res.json({ message: 'ย้ายไป Trash สำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
