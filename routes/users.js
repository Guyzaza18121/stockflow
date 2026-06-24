const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// Create user (admin only)
router.post('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { id, username, password, role, name } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ id }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'ID หรือชื่อผู้ใช้ซ้ำ' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ id, username, password: hashedPassword, role, name });
    await user.save();

    res.status(201).json({ id, username, role, name });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// Update user (admin only)
router.put('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findOneAndUpdate({ $or: [{ id: req.params.id }, { _id: req.params.id }] }, updateData, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ $or: [{ id: req.params.id }, { _id: req.params.id }] });
    
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    res.json({ message: 'ลบผู้ใช้สำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

module.exports = router;
