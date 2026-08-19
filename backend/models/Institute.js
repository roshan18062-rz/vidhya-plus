const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: true,
    trim: true
  },
  instituteCode: {
    type: String,
    unique: true,
    required: true,
    uppercase: true
  },
  address: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'trial'],
    default: 'trial'
  },
  subscriptionExpiry: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days trial
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// FIX: Unique index on email to prevent duplicate institutes with same email
InstituteSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Institute', InstituteSchema);
