const express = require('express');
const router = express.Router();
const Pricing = require('../models/Pricing.js');

// Get all pricing
router.get('/', async (req, res) => {
  try {
    const { libraryId } = req.query;
    const filter = { isActive: true };
    if (libraryId) filter.libraryId = libraryId;

    const pricing = await Pricing.find(filter).populate('libraryId');
    res.json({ success: true, data: pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create pricing
router.post('/', async (req, res) => {
  try {
    const pricing = new Pricing(req.body);
    await pricing.save();
    res.status(201).json({ success: true, data: pricing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update pricing
router.put('/:id', async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pricing) {
      return res.status(404).json({ success: false, message: 'Pricing not found' });
    }
    res.json({ success: true, data: pricing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;