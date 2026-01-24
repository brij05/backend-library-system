const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  facilityType: {
    type: String,
    enum: ['Non-AC'],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  monthlyFee: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);