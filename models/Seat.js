const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
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
  isBooked: {
    type: Boolean,
    default: false
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  }
}, {
  timestamps: true
});

// Compound index to ensure unique seat numbers per library and facility
seatSchema.index({ libraryId: 1, seatNumber: 1, facilityType: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);