const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, checkRole(['admin', 'manager', 'user']), async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ ts: -1 }).limit(500);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message:error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const log = new ActivityLog({
      ...req.body,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role
    });
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

router.put('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const log = await ActivityLog.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: false }
    );
    if (!log) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
