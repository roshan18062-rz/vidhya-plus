const { body, validationResult } = require('express-validator');
const validator = require('validator');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Institute = require('../models/Institute');

// @route   POST /api/auth/register
// @desc    Register new institute with admin user
// @access  Public
router.post('/register', [
  // Validation middleware
  body('instituteName').trim().isLength({ min: 3, max: 100 }).withMessage('Institute name must be 3-100 characters'),
  body('ownerName').trim().isLength({ min: 3, max: 50 }).withMessage('Owner name must be 3-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('contactNumber').matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits'),
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { 
      instituteName, 
      ownerName, 
      email, 
      contactNumber, 
      address,
      username, 
      password 
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate unique institute code
    const instituteCode = instituteName
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, '') + 
      Math.random().toString(36).substring(2, 6).toUpperCase();

    // Create institute
    const institute = new Institute({
      instituteName,
      instituteCode,
      ownerName,
      email,
      contactNumber,
      address: address || '',
      subscriptionStatus: 'trial'
    });

    await institute.save();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName: ownerName,
      role: 'admin',
      instituteId: institute._id
    });

    await user.save();

    res.status(201).json({ 
      message: 'Institute registered successfully! You can now login.',
      instituteCode,
      instituteName,
      trialDays: 30
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user by email and populate institute
    const user = await User.findOne({ email }).populate('instituteId');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if institute subscription is active
    if (user.instituteId.subscriptionStatus === 'inactive') {
      return res.status(403).json({ 
        message: 'Your subscription has expired. Please contact support.' 
      });
    }

    // Create JWT token
    const payload = {
      userId: user._id,
      instituteId: user.instituteId._id
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Return token and user info
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        instituteName: user.instituteId.instituteName,
        instituteCode: user.instituteId.instituteCode,
        subscriptionStatus: user.instituteId.subscriptionStatus,
        subscriptionExpiry: user.instituteId.subscriptionExpiry
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('instituteId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      instituteName: user.instituteId.instituteName,
      instituteCode: user.instituteId.instituteCode,
      subscriptionStatus: user.instituteId.subscriptionStatus
    });

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;