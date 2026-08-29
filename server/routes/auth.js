const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'sahanines-secret-key-2024', { expiresIn: '7d' });
    res.json({ success: true, token, admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get profile
router.get('/profile', protect, async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (req.body.password) admin.password = req.body.password;
    await admin.save();
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
