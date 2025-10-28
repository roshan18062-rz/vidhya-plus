const express = require('express');
const router = express.Router();
const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// @route   POST /api/fees
// @desc    Record fee payment
// @access  Private (Teacher only)
router.post('/', async (req, res) => {
  try {
    const { studentId, monthYear, amount, paymentMode } = req.body;

    // Verify student belongs to institute
    const student = await Student.findOne({
      _id: studentId,
      instituteId: req.user.instituteId
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // ✅ CHECK IF PAYMENT ALREADY EXISTS FOR THIS MONTH
    const existingPayment = await FeePayment.findOne({
      studentId,
      monthYear,
      instituteId: req.user.instituteId,
      status: 'paid' // Only check paid payments
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

    // Generate receipt number
    const count = await FeePayment.countDocuments({ instituteId: req.user.instituteId });
    const receiptNumber = `${req.user.instituteCode}-REC-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

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
        status: 'paid' // ✅ Only check paid status
      });

      // ✅ Only add to pending if NO paid payment exists
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