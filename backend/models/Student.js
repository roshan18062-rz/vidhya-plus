const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  boardType: {
    type: String,
    enum: ['CBSE', 'ICSE', 'State Board'],
    required: true
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  parentName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Contact number must be 10 digits'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  monthlyFee: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  studentPhoto: {
    type: String,
    default: ''
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

// Compound index: studentId must be unique per institute
StudentSchema.index({ studentId: 1, instituteId: 1 }, { unique: true });

module.exports = mongoose.model('Student', StudentSchema);