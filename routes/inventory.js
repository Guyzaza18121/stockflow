const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create inventory item
router.post('/', async (req, res) => {
  try {
    const { id, sku, name, cat, unit, qty, min, bp, sp, loc, sup, hc, cf, ct, cr } = req.body;
    
    // Check if SKU already exists
    const existing = await Inventory.findOne({ sku });
    if (existing) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    const item = new Inventory({
      id,
      sku,
      name,
      cat,
      unit,
      qty: qty || 0,
      min: min || 0,
      bp: bp || 0,
      sp: sp || 0,
      loc: loc || '',
      sup: sup || '',
      hc: hc || false,
      cf: cf || '',
      ct: ct || '',
      cr: cr || 1,
      createdBy: req.user?.id || 'system'
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { sku, name, cat, unit, qty, min, bp, sp, loc, sup, hc, cf, ct, cr } = req.body;
    
    const item = await Inventory.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if SKU is being changed and if new SKU already exists
    if (sku && sku !== item.sku) {
      const existing = await Inventory.findOne({ sku });
      if (existing) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }

    const updates = {};
    if (sku !== undefined) updates.sku = sku;
    if (name !== undefined) updates.name = name;
    if (cat !== undefined) updates.cat = cat;
    if (unit !== undefined) updates.unit = unit;
    if (qty !== undefined) updates.qty = qty;
    if (min !== undefined) updates.min = min;
    if (bp !== undefined) updates.bp = bp;
    if (sp !== undefined) updates.sp = sp;
    if (loc !== undefined) updates.loc = loc;
    if (sup !== undefined) updates.sup = sup;
    if (hc !== undefined) updates.hc = hc;
    if (cf !== undefined) updates.cf = cf;
    if (ct !== undefined) updates.ct = ct;
    if (cr !== undefined) updates.cr = cr;
    updates.updatedBy = req.user?.id || 'system';

    const updated = await Inventory.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findOneAndDelete({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock items
router.get('/stats/low-stock', async (req, res) => {
  try {
    const items = await Inventory.find({ qty: { $lte: mongoose.Types.Decimal128 } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get out of stock items
router.get('/stats/out-of-stock', async (req, res) => {
  try {
    const items = await Inventory.find({ qty: 0 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
