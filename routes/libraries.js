const express = require('express');
const router = express.Router();
const Library = require('../models/Library.js');
const Seat = require('../models/Seat.js');

// Get all libraries
router.get('/', async (req, res) => {
  try {
    const libraries = await Library.find({ isActive: true });
    res.json({ success: true, data: libraries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get library by ID
router.get('/:id', async (req, res) => {
  try {
    const library = await Library.findById(req.params.id);
    if (!library) {
      return res.status(404).json({ success: false, message: 'Library not found' });
    }
    res.json({ success: true, data: library });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create library
router.post('/', async (req, res) => {
  try {
    const library = new Library(req.body);
    await library.save();
    res.status(201).json({ success: true, data: library });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update library
router.put('/:id', async (req, res) => {
  try {
    const library = await Library.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!library) {
      return res.status(404).json({ success: false, message: 'Library not found' });
    }
    res.json({ success: true, data: library });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete library (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const library = await Library.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!library) {
      return res.status(404).json({ success: false, message: 'Library not found' });
    }
    res.json({ success: true, message: 'Library deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
