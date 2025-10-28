const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

// All routes only need authentication, no role check
router.use(authMiddleware);

// @route   GET /api/students
// @desc    Get all students for the institute (with pagination)
// @access  Private (Teacher only)
router.get('/', async (req, res) => {
  try {
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
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { parentName: { $regex: search, $options: 'i' } }
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
router.get('/:id', async (req, res) => {
  try {
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
router.post('/', async (req, res) => {
  try {
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

    const count = await Student.countDocuments({ instituteId: req.user.instituteId });
    const studentId = `${req.user.instituteCode}-${String(count + 1).padStart(4, '0')}`;

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
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Teacher only)
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, instituteId: req.user.instituteId },
      { $set: req.body },
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
// @access  Private (Teacher only)
router.delete('/:id', async (req, res) => {
  try {
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

// @route   GET /api/students/stats/dashboard
// @desc    Get dashboard statistics for institute
// @access  Private (Teacher only)
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

module.exports = router;