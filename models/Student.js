const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  seatNumber: {
    type: String,
    required: true
  },
  facilityType: {
    type: String,
    enum: ['AC', 'Non-AC'],
    required: true
  },
  timeSlot: {
    type: String,
    default: null
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  monthlyFee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['PAID', 'DUE'],
    default: 'PAID'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastPaymentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);