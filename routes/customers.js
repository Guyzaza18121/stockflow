const express = require('express');
const Customer = require('../models/Customer');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// Create customer group
router.post('/', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// Update customer
router.put('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    
    if (!customer) {
      return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// Delete customer
router.delete('/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ id: req.params.id });
    
    if (!customer) {
      return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    }

    res.json({ message: 'ลบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

module.exports = router;
