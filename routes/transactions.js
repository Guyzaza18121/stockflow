const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Inventory = require('../models/Inventory');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { type, startDate, endDate, cust, sku } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (cust) query.cust = new RegExp(cust, 'i');
    if (sku) query.sku = new RegExp(sku, 'i');
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ id: req.params.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create transaction (receive or issue)
router.post('/', async (req, res) => {
  try {
    const { id, date, type, sku, name, qty, price, total, cust, job, user, cn, gid, inventoryId } = req.body;
    
    const transaction = new Transaction({
      id,
      date,
      type,
      sku,
      name,
      qty,
      price,
      total,
      cust,
      job: job || '-',
      user,
      cn: cn || '',
      gid: gid || '',
      inventoryId
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk create transactions (for receive/issue multiple items)
router.post('/bulk', async (req, res) => {
  try {
    const { transactions } = req.body;
    
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: 'Transactions array is required' });
    }

    const saved = await Transaction.insertMany(transactions);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;
    }

    const totalIn = await Transaction.aggregate([
      { $match: { type: 'in', ...(startDate || endDate ? { date: dateFilter } : {}) } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);

    const totalOut = await Transaction.aggregate([
      { $match: { type: 'out', ...(startDate || endDate ? { date: dateFilter } : {}) } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);

    res.json({
      in: totalIn[0] || { total: 0, count: 0 },
      out: totalOut[0] || { total: 0, count: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions by customer
router.get('/by-customer/:cust', async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      cust: new RegExp(req.params.cust, 'i') 
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions by job
router.get('/by-job/:job', async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      job: req.params.job 
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
