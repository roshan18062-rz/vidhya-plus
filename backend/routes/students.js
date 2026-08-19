const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// FIX #2: escape regex metacharacters so user input can't build a catastrophic-backtracking pattern (ReDoS)
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// @route   GET /api/students/stats/dashboard
// @desc    Get dashboard statistics for institute
// @access  Private (Teacher only)
// FIX: Moved BEFORE /:id to prevent route shadowing
router.get('/stats/dashboard', async (req, res) => {
  try {
    const instituteId = req.user.instituteId;

    const totalStudents = await Student.countDocuments({
      status: 'active',
      instituteId
    });

    const cbseCount = await Student.countDocuments({
      boardType: 'CBSE',
      status: 'active',
      instituteId
    });

    const icseCount = await Student.countDocuments({
      boardType: 'ICSE',
      status: 'active',
      instituteId
    });

    const stateCount = await Student.countDocuments({
      boardType: 'State Board',
      status: 'active',
      instituteId
    });

    res.json({
      totalStudents,
      boardWise: {
        CBSE: cbseCount,
        ICSE: icseCount,
        'State Board': stateCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students
// @desc    Get all students for the institute (with pagination)
// @access  Private (Teacher only)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search query too long'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      class: className,
      boardType,
      status,
      search,
      page = 1,
      limit = 20
    } = req.query;

    let query = { instituteId: req.user.instituteId };

    if (className) query.class = className;
    if (boardType) query.boardType = boardType;
    if (status) query.status = status;

    if (search) {
      // FIX #2: escaped + length-capped to prevent ReDoS
      const safeSearch = escapeRegex(search).slice(0, 100);
      query.$or = [
        { studentName: { $regex: safeSearch, $options: 'i' } },
        { studentId: { $regex: safeSearch, $options: 'i' } },
        { parentName: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Student.countDocuments(query);

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      students,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private (Teacher only)
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid student ID'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const student = await Student.findOne({
      _id: req.params.id,
      instituteId: req.user.instituteId
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/students
// @desc    Add new student
// @access  Private (Teacher only)
router.post('/', [
  body('studentName').trim().isLength({ min: 2, max: 100 }).withMessage('Student name must be 2-100 characters'),
  body('class').trim().notEmpty().withMessage('Class is required'),
  body('boardType').isIn(['CBSE', 'ICSE', 'State Board']).withMessage('Board type must be CBSE, ICSE, or State Board'),
  body('parentName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Parent name must be 2-100 characters'),
  body('contactNumber').optional().matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('monthlyFee').optional().isFloat({ min: 0, max: 1000000 }).withMessage('Fee must be 0-1,000,000'),
  body('studentPhoto').optional().isURL().withMessage('Photo must be a valid URL'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      studentName,
      class: className,
      boardType,
      parentName,
      contactNumber,
      email,
      monthlyFee,
      studentPhoto
    } = req.body;

    // FIX: Replaced O(n) find().lean() with single findOne + sort for student ID generation
    const lastStudent = await Student.findOne({ instituteId: req.user.instituteId })
      .sort({ createdAt: -1 })
      .select('studentId')
      .lean();

    let nextNumber = 1;
    if (lastStudent && lastStudent.studentId) {
      const idParts = lastStudent.studentId.split('-');
      if (idParts.length >= 2) {
        nextNumber = (parseInt(idParts[1]) || 0) + 1;
      }
    }

    const studentId = `${req.user.instituteCode}-${String(nextNumber).padStart(4, '0')}`;

    if (process.env.NODE_ENV !== 'production') console.log('Creating student with ID:', studentId);

    const student = new Student({
      studentId,
      studentName,
      class: className,
      boardType,
      parentName,
      contactNumber,
      email,
      monthlyFee,
      studentPhoto,
      instituteId: req.user.instituteId,
      admissionDate: new Date()
    });

    await student.save();

    if (process.env.NODE_ENV !== 'production') console.log('Student created successfully:', studentId);

    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);

    // FIX: Return 409 for duplicate key instead of generic 400
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Student ID already exists. Please try again.'
      });
    }

    res.status(500).json({
      message: 'Failed to add student. Please try again.'
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Teacher only)
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid student ID'),
  body('studentName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Student name must be 2-100 characters'),
  body('class').optional().trim().notEmpty().withMessage('Class is required'),
  body('boardType').optional().isIn(['CBSE', 'ICSE', 'State Board']).withMessage('Board type must be CBSE, ICSE, or State Board'),
  body('parentName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Parent name must be 2-100 characters'),
  body('contactNumber').optional().matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('monthlyFee').optional().isFloat({ min: 0, max: 1000000 }).withMessage('Fee must be 0-1,000,000'),
  body('studentPhoto').optional().isURL().withMessage('Photo must be a valid URL'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    // FIX #3: whitelist updatable fields instead of mass-assignment
    const ALLOWED_FIELDS = ['studentName', 'class', 'boardType', 'parentName', 'contactNumber', 'email', 'monthlyFee', 'studentPhoto', 'status'];
    const updates = {};
    for (const key of ALLOWED_FIELDS) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, instituteId: req.user.instituteId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/students/:id
// @desc    Mark student as inactive
// @access  Private (Owner only)
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid student ID'),
], requireRole('owner'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, instituteId: req.user.instituteId },
      { status: 'inactive' },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student marked as inactive', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
