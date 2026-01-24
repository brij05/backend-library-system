const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot.js');

// Get all time slots
router.get('/', async (req, res) => {
  try {
    const { libraryId } = req.query;
    const filter = { isActive: true };
    if (libraryId) filter.libraryId = libraryId;

    const timeSlots = await TimeSlot.find(filter).populate('libraryId');
    res.json({ success: true, data: timeSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create time slot
router.post('/', async (req, res) => {
  try {
    const timeSlot = new TimeSlot(req.body);
    await timeSlot.save();
    res.status(201).json({ success: true, data: timeSlot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update time slot
router.put('/:id', async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: 'Time slot not found' });
    }
    res.json({ success: true, data: timeSlot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete time slot
router.delete('/:id', async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: 'Time slot not found' });
    }
    res.json({ success: true, message: 'Time slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
