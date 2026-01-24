const express = require('express');
const router = express.Router();
const Student = require('../models/Student.js');
const Seat = require('../models/Seat.js');
const Pricing = require('../models/Pricing.js');

// Helper function to calculate prorated fee
const calculateProratedFee = (baseAmount, joinDate) => {
  const join = new Date(joinDate);
  const daysInMonth = new Date(join.getFullYear(), join.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - join.getDate() + 1;
  return Math.round((baseAmount / daysInMonth) * daysRemaining);
};

// Get all students
router.get('/', async (req, res) => {
  try {
    const { active, libraryId, paymentStatus } = req.query;
    const filter = {};
    
    if (active === 'true') filter.isActive = true;
    if (libraryId) filter.libraryId = libraryId;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const students = await Student.find(filter).populate('libraryId');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('libraryId');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Assign seat to student
router.post('/', async (req, res) => {
  try {
    const { name, phone, libraryId, seatNumber, facilityType, timeSlot, joinDate, baseFee } = req.body;

    // Check if phone already exists
    const existingStudent = await Student.findOne({ phone, isActive: true });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student already has an active seat' });
    }

    // Check if seat is available
    const seat = await Seat.findOne({ libraryId, seatNumber, facilityType, isBooked: false });
    if (!seat) {
      return res.status(400).json({ success: false, message: 'Seat not available' });
    }

    // Calculate prorated fee
    const monthlyFee = calculateProratedFee(baseFee, joinDate);

    // Create student
    const student = new Student({
      name,
      phone,
      libraryId,
      seatNumber,
      facilityType,
      timeSlot,
      joinDate,
      monthlyFee,
      paymentStatus: 'PAID',
      isActive: true
    });

    await student.save();

    // Update seat
    seat.isBooked = true;
    seat.studentId = student._id;
    await seat.save();

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Release seat
router.post('/:id/release', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Update student status
    student.isActive = false;
    await student.save();

    // Release seat
    const seat = await Seat.findOne({ 
      libraryId: student.libraryId, 
      seatNumber: student.seatNumber,
      facilityType: student.facilityType
    });
    
    if (seat) {
      seat.isBooked = false;
      seat.studentId = null;
      await seat.save();
    }

    res.json({ success: true, message: 'Seat released successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus,
        lastPaymentDate: paymentStatus === 'PAID' ? new Date() : undefined
      },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;