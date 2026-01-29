const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.js');

// Admin registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const admin = new Admin(req.body);
    await admin.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Admin created successfully. You can now login.' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find admin and explicitly check isActive
    const admin = await Admin.findOne({ username, isActive: true });
    
    // 2. If no admin found
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Check password using the model method
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

module.exports = router;