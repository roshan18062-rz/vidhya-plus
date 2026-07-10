const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// FIX #2: escape regex metacharacters so user input can't build a catastrophic-backtracking pattern (ReDoS)
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
      // FIX #2: was `{ $regex: search }` raw — escaped + length-capped now
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

    // ✅ SIMPLE SEQUENTIAL LOGIC - NO TIMESTAMPS!
    // Get all students for this institute
    const allStudents = await Student.find({ 
      instituteId: req.user.instituteId 
    }).select('studentId').lean();

    let nextNumber = 1;

    if (allStudents.length > 0) {
      // Extract all numbers from student IDs
      const allNumbers = allStudents.map(s => {
        const idParts = s.studentId.split('-');
        if (idParts.length >= 2) {
          return parseInt(idParts[1]) || 0;
        }
        return 0;
      }).filter(num => num > 0);

      if (allNumbers.length > 0) {
        // Get highest number and add 1
        nextNumber = Math.max(...allNumbers) + 1;
      }
    }

    // Generate ID with 4-digit padding
    const studentId = `${req.user.instituteCode}-${String(nextNumber).padStart(4, '0')}`;

    // FIX #10: debug-only, no PII
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
    
    // FIX #10: debug-only, no student name in logs
    if (process.env.NODE_ENV !== 'production') console.log('Student created successfully:', studentId);
    
    res.status(201).json(student);
  } catch (error) {
    console.error('❌ Error creating student:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
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
router.put('/:id', async (req, res) => {
  try {
    // FIX #3: whitelist updatable fields instead of `$set: req.body` (was mass-assignable,
    // including instituteId — allowed re-parenting a student to a different tenant)
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
// @access  Private (Teacher only)
// FIX #4: only 'owner' role can delete/deactivate a student record
router.delete('/:id', requireRole('owner'), async (req, res) => {
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