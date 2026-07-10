const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Institute = require('../models/Institute');

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    // FIX #6: token now read from the httpOnly cookie set at login, not a
    // client-readable Bearer header sourced from localStorage. Header is kept
    // as a fallback only for non-browser API clients that can't use cookies.
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX #10: debug logs only in non-production, and never dump full token payload
    if (process.env.NODE_ENV !== 'production') {
      console.log('Token decoded for userId:', decoded.userId);
    }

    // Get user and attach to request
    const user = await User.findById(decoded.userId).populate('instituteId');
    
    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('User not found for ID:', decoded.userId);
      }
      return res.status(401).json({ message: 'User not found' });
    }

    // FIX #9: reject tokens issued before the user's last logout/password change
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    // Check if institute subscription is active
    if (user.instituteId.subscriptionStatus === 'inactive') {
      return res.status(403).json({ 
        message: 'Institute subscription has expired. Please renew.' 
      });
    }

    req.user = {
      userId: user._id,
      username: user.username,
      role: user.role,
      instituteId: user.instituteId._id,
      instituteName: user.instituteId.instituteName,
      instituteCode: user.instituteId.instituteCode
    };
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message); // DETAILED ERROR
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is malformed or invalid' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please login again.' });
    }
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// FIX #4: role-based access control middleware, apply per-route as needed
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

module.exports = { authMiddleware, requireRole };
