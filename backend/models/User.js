const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
    // ✅ REMOVED: unique: true (we'll define index separately)
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'platform_admin'],
    default: 'owner'
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ FIXED: Define unique index only once, here
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);