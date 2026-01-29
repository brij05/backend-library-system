const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
    // Note: If you add 'select: false' here for security, 
    // you must use .select('+password') in the login route.
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// FIX: Removed 'next' parameter to prevent "next is not a function" error
adminSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);