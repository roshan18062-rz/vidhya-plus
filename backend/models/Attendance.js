const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  smsStatus: {
    type: String,
    enum: ['sent', 'failed', 'not_sent'],
    default: 'not_sent'
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

// Compound index
AttendanceSchema.index({ studentId: 1, date: 1, instituteId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);