const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');
const Counter = require('../models/Counter');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// @route   POST /api/fees
// @desc    Record fee payment
// @access  Private (Teacher only)
router.post('/', [
  body('studentId').isMongoId().withMessage('Invalid student ID'),
  body('monthYear').matches(/^\d{4}-\d{2}$/).withMessage('monthYear must be in YYYY-MM format'),
  body('amount').isFloat({ min: 1, max: 10000000 }).withMessage('Amount must be 1-10,000,000'),
  body('paymentMode').isIn(['cash', 'upi', 'bank_transfer', 'cheque', 'online']).withMessage('Invalid payment mode'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { studentId, monthYear, amount, paymentMode } = req.body;

    // Verify student belongs to institute
    const student = await Student.findOne({
      _id: studentId,
      instituteId: req.user.instituteId
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // CHECK IF PAYMENT ALREADY EXISTS FOR THIS MONTH
    const existingPayment = await FeePayment.findOne({
      studentId,
      monthYear,
      instituteId: req.user.instituteId,
      status: 'paid'
    });

    if (existingPayment) {
      return res.status(400).json({
        message: `${student.studentName} has already paid fees for ${monthYear}. Receipt #${existingPayment.receiptNumber}`,
        alreadyPaid: true,
        existingPayment: {
          receiptNumber: existingPayment.receiptNumber,
          amount: existingPayment.amount,
          paymentDate: existingPayment.paymentDate,
          paymentMode: existingPayment.paymentMode
        }
      });
    }

    // FIX: Atomic counter pattern — race-condition-free receipt number generation
    const year = new Date().getFullYear();
    const counter = await Counter.findOneAndUpdate(
      { instituteId: req.user.instituteId, year },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const receiptNumber = `${req.user.instituteCode}-REC-${year}-${String(counter.seq).padStart(5, '0')}`;

    // Create new payment
    const feePayment = new FeePayment({
      studentId,
      monthYear,
      amount,
      paymentDate: new Date(),
      paymentMode,
      status: 'paid',
      receiptNumber,
      instituteId: req.user.instituteId
    });

    await feePayment.save();

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: feePayment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/fees
// @desc    Get fee records
// @access  Private (Teacher only)
router.get('/', async (req, res) => {
  try {
    const { studentId, monthYear, status } = req.query;

    let query = { instituteId: req.user.instituteId };
    if (studentId) query.studentId = studentId;
    if (monthYear) query.monthYear = monthYear;
    if (status) query.status = status;

    const fees = await FeePayment.find(query)
      .populate('studentId', 'studentName studentId class boardType monthlyFee')
      .sort({ createdAt: -1 });

    res.json(fees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/fees/pending
// @desc    Get pending fees
// @access  Private (Teacher only)
router.get('/pending', async (req, res) => {
  try {
    const students = await Student.find({
      status: 'active',
      instituteId: req.user.instituteId
    });

    const currentMonth = new Date().toISOString().slice(0, 7);

    const pendingFees = [];

    for (const student of students) {
      const payment = await FeePayment.findOne({
        studentId: student._id,
        monthYear: currentMonth,
        instituteId: req.user.instituteId,
        status: 'paid'
      });

      if (!payment) {
        pendingFees.push({
          student,
          monthYear: currentMonth,
          amount: student.monthlyFee,
          status: 'pending'
        });
      }
    }

    res.json(pendingFees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/fees/stats
// @desc    Get fee collection statistics
// @access  Private (Teacher only)
router.get('/stats', async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const paidFees = await FeePayment.find({
      monthYear: currentMonth,
      status: 'paid',
      instituteId: req.user.instituteId
    });

    const totalCollected = paidFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalStudents = await Student.countDocuments({
      status: 'active',
      instituteId: req.user.instituteId
    });
    const paidCount = paidFees.length;

    res.json({
      month: currentMonth,
      totalCollected,
      totalStudents,
      paidCount,
      pendingCount: totalStudents - paidCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
