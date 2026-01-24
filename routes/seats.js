const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat.js');

// Get all seats
router.get('/', async (req, res) => {
  try {
    const { libraryId, facilityType, available } = req.query;
    const filter = {};
    
    if (libraryId) filter.libraryId = libraryId;
    if (facilityType) filter.facilityType = facilityType;
    if (available === 'true') filter.isBooked = false;

    const seats = await Seat.find(filter).populate('libraryId studentId');
    res.json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get seat by ID
router.get('/:id', async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id).populate('libraryId studentId');
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.json({ success: true, data: seat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create seat
router.post('/', async (req, res) => {
  try {
    const seat = new Seat(req.body);
    await seat.save();
    res.status(201).json({ success: true, data: seat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Bulk create seats
router.post('/bulk', async (req, res) => {
  try {
    const { libraryId, facilityType, prefix, count } = req.body;
    const seats = [];
    
    for (let i = 1; i <= count; i++) {
      seats.push({
        libraryId,
        seatNumber: `${prefix}${i}`,
        facilityType,
        isBooked: false
      });
    }
    
    const createdSeats = await Seat.insertMany(seats);
    res.status(201).json({ success: true, data: createdSeats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update seat
router.put('/:id', async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.json({ success: true, data: seat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete seat
router.delete('/:id', async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.json({ success: true, message: 'Seat deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
