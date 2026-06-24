const express = require('express');
const Category = require('../models/Category');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const categories = await Category.find(filter);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null }] },
      { $set: req.body },
      { new: true, runValidators: false }
    );
    if (!category) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const category = await Category.findOneAndDelete(
      { $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null }] }
    );
    if (!category) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
