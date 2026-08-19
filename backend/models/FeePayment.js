const mongoose = require('mongoose');

const FeePaymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  monthYear: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: null
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'online', 'cheque', 'upi'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  },
  receiptNumber: {
    type: String,
    sparse: true
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

// Compound index for receipt number
FeePaymentSchema.index({ receiptNumber: 1, instituteId: 1 }, { unique: true, sparse: true });

// ✅ NEW: Prevent duplicate payments for same student in same month
// Allow only ONE paid payment per student per month per institute
FeePaymentSchema.index(
  { studentId: 1, monthYear: 1, instituteId: 1, status: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { status: 'paid' } // Only for paid status
  }
);

module.exports = mongoose.model('FeePayment', FeePaymentSchema);