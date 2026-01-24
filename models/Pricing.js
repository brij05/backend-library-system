const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  facilityType: {
    type: String,
    enum: ['AC', 'Non-AC'],
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

// Compound index to ensure unique pricing per library and facility
pricingSchema.index({ libraryId: 1, facilityType: 1 }, { unique: true });

module.exports = mongoose.model('Pricing', pricingSchema);