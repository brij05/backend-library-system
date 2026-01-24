const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  hasAC: {
    type: Boolean,
    default: false
  },
  hasNonAC: {
    type: Boolean,
    default: true
  },
  hasTimeBased: {
    type: Boolean,
    default: false
  },
  paytmQR: {
    type: String,
    default: ''
  },
  whatsapp: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);