const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Institute = require('../models/Institute');

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token decoded successfully:', decoded); // DEBUG LOG
    
    // Get user and attach to request
    const user = await User.findById(decoded.userId).populate('instituteId');
    
    if (!user) {
      console.error('❌ User not found for ID:', decoded.userId); // DEBUG LOG
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.username, user.instituteId.instituteName); // DEBUG LOG

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

module.exports = { authMiddleware };
