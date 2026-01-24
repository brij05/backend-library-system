const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Seat = require('../models/Seat');
const Library = require('../models/Library');
const authMiddleware = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const activeStudents = await Student.countDocuments({ isActive: true });
    const totalSeats = await Seat.countDocuments();
    const availableSeats = await Seat.countDocuments({ isBooked: false });
    const duePayments = await Student.countDocuments({ 
      isActive: true, 
      paymentStatus: 'DUE' 
    });
    const totalLibraries = await Library.countDocuments({ isActive: true });

    // Revenue calculation
    const students = await Student.find({ isActive: true, paymentStatus: 'PAID' });
    const monthlyRevenue = students.reduce((sum, student) => sum + student.monthlyFee, 0);

    // Library-wise breakdown
    const libraryStats = await Student.aggregate([
      { $match: { isActive: true } },
      { 
        $group: {
          _id: '$libraryId',
          studentCount: { $sum: 1 },
          totalRevenue: { $sum: '$monthlyFee' }
        }
      },
      {
        $lookup: {
          from: 'libraries',
          localField: '_id',
          foreignField: '_id',
          as: 'library'
        }
      },
      { $unwind: '$library' },
      {
        $project: {
          libraryName: '$library.name',
          studentCount: 1,
          totalRevenue: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        activeStudents,
        totalSeats,
        availableSeats,
        bookedSeats: totalSeats - availableSeats,
        duePayments,
        totalLibraries,
        monthlyRevenue,
        occupancyRate: totalSeats > 0 ? ((totalSeats - availableSeats) / totalSeats * 100).toFixed(2) : 0,
        libraryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payment due list
router.get('/due-payments', authMiddleware, async (req, res) => {
  try {
    const dueStudents = await Student.find({
      isActive: true,
      paymentStatus: 'DUE'
    }).populate('libraryId').sort({ lastPaymentDate: 1 });

    res.json({ success: true, data: dueStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recent activities
router.get('/recent-activities', authMiddleware, async (req, res) => {
  try {
    const recentStudents = await Student.find({ isActive: true })
      .populate('libraryId')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: recentStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;