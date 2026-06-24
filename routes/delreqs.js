const express = require('express');
const DeleteRequest = require('../models/DeleteRequest');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    // admin/manager เห็นทั้งหมด, user เห็นแค่ของตัวเอง
    const filter = ['admin', 'manager'].includes(req.user.role)
      ? {}
      : { requestedBy: req.user.id };
    const delreqs = await DeleteRequest.find(filter).sort({ createdAt: -1 });
    res.json(delreqs);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const delreq = new DeleteRequest({
      ...req.body,
      requestedBy: req.user.id,
      requestedByName: req.user.name
    });
    await delreq.save();
    res.status(201).json(delreq);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

router.put('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const delreq = await DeleteRequest.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { _id: req.params.id }] },
      { ...req.body, reviewedBy: req.user.id, reviewedByName: req.user.name, reviewedAt: new Date() },
      { new: true }
    );
    if (!delreq) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(delreq);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

router.delete('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const delreq = await DeleteRequest.findOneAndDelete(
      { $or: [{ id: req.params.id }, { _id: req.params.id }] }
    );
    if (!delreq) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

module.exports = router;
