const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

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

    // ✅ FIXED: Generate unique student ID with retry logic
    let studentId;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      if (attempts === 0) {
        // First attempt: Sequential numbering
        const count = await Student.countDocuments({ 
          instituteId: req.user.instituteId 
        });
        studentId = `${req.user.instituteCode}-${String(count + 1).padStart(4, '0')}`;
      } else {
        // Retry with timestamp
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100);
        studentId = `${req.user.instituteCode}-${timestamp}${random}`;
      }

      // Check if ID already exists
      const exists = await Student.findOne({ 
        studentId, 
        instituteId: req.user.instituteId 
      });

      if (!exists) {
        break; // ID is unique, proceed
      }

      attempts++;
      console.log(`⚠️ Duplicate ID detected, retrying... (${attempts}/${maxAttempts})`);
      
      // Small delay before retry
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (attempts >= maxAttempts) {
      return res.status(500).json({ 
        message: 'Unable to generate unique student ID after multiple attempts. Please try again.' 
      });
    }

    console.log(`✅ Generated unique student ID: ${studentId}`);

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
    console.error('Error adding student:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A student with this ID already exists. Please try again or contact support.',
        error: 'DUPLICATE_ID'
      });
    }
    
    res.status(500).json({ message: 'Server error while adding student. Please try again.' });
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