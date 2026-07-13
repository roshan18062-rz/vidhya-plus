const { body, validationResult } = require('express-validator');
const validator = require('validator');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Institute = require('../models/Institute');
const { authMiddleware } = require('../middleware/auth');

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
  // FIX #8: stronger password policy (was: min 6 chars, no complexity)
  body('password')
    .isLength({ min: 10 }).withMessage('Password must be at least 10 characters')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
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

    // FIX #13: crypto.randomBytes instead of Math.random(), longer suffix = fewer collisions
    const instituteCode = instituteName
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, '') + 
      crypto.randomBytes(4).toString('hex').toUpperCase();

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
      role: 'owner',
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
    // FIX #9: embed tokenVersion so tokens can be revoked server-side later
    const payload = {
      userId: user._id,
      instituteId: user.instituteId._id,
      tokenVersion: user.tokenVersion
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // FIX #6: token set as an httpOnly cookie instead of returned in the JSON body
    // for the frontend to store in localStorage. Not readable by JS -> not
    // stealable by an XSS payload.
    // sameSite: 'none' (not 'strict') because frontend (Vercel) and backend
    // (Render) are different domains — see middleware/csrf.js for the full
    // explanation, same underlying bug applied here too.
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Return user info only, no token in the response body
    res.json({
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
// FIX #16 (bonus): was hand-rolling jwt.verify, bypassing tokenVersion revocation check.
// Now reuses authMiddleware so /me honors the same revocation/subscription rules as every other route.
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('instituteId');

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

// @route   POST /api/auth/logout
// @desc    FIX #9 - Invalidate all existing JWTs for this user by bumping tokenVersion
// @access  Private
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, { $inc: { tokenVersion: 1 } });
    // FIX #6: clear the httpOnly auth cookie server-side too
    res.clearCookie('token');
    res.json({ message: 'Logged out. All sessions invalidated.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

module.exports = router;