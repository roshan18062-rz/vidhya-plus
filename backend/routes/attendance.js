const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');
const { sendAbsenceNotification } = require('../utils/smsService');

// All routes only need authentication
router.use(authMiddleware);

// @route   POST /api/attendance
// @desc    Mark attendance
// @access  Private (Teacher only)
router.post('/', async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const student = await Student.findOne({
      _id: studentId,
      instituteId: req.user.instituteId
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      studentId,
      date: dateObj,
      instituteId: req.user.instituteId
    });

    if (attendance) {
      attendance.status = status;
      attendance.markedBy = req.user.userId;
      await attendance.save();
    } else {
      attendance = new Attendance({
        studentId,
        date: dateObj,
        status,
        markedBy: req.user.userId,
        instituteId: req.user.instituteId
      });
      await attendance.save();
    }

    // Send SMS if absent (Disabled for MVP)
    if (status === 'absent') {
      console.log(`📱 SMS would be sent to ${student.studentName}'s parent (${student.contactNumber})`);
      attendance.smsStatus = 'not_sent';
      await attendance.save();
    }

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance/bulk
// @desc    Mark bulk attendance
// @access  Private (Teacher only)
router.post('/bulk', async (req, res) => {
  try {
    const { date, attendanceData } = req.body;

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    const results = [];

    for (const record of attendanceData) {
      const student = await Student.findOne({
        _id: record.studentId,
        instituteId: req.user.instituteId
      });

      if (!student) continue;

      let attendance = await Attendance.findOne({
        studentId: record.studentId,
        date: dateObj,
        instituteId: req.user.instituteId
      });

      if (attendance) {
        attendance.status = record.status;
        attendance.markedBy = req.user.userId;
      } else {
        attendance = new Attendance({
          studentId: record.studentId,
          date: dateObj,
          status: record.status,
          markedBy: req.user.userId,
          instituteId: req.user.instituteId
        });
      }

      await attendance.save();

      // FIXED: Changed 'status' to 'record.status'
      if (record.status === 'absent') {
        console.log(`📱 SMS would be sent to ${student.studentName}'s parent (${student.contactNumber})`);
        attendance.smsStatus = 'not_sent';
        await attendance.save();
      }

      results.push(attendance);
    }

    res.json({ message: 'Attendance marked successfully', results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance
// @desc    Get attendance records
// @access  Private (Teacher only)
router.get('/', async (req, res) => {
  try {
    const { date, studentId, startDate, endDate } = req.query;

    let query = { instituteId: req.user.instituteId };

    if (date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      query.date = dateObj;
    }

    if (studentId) {
      query.studentId = studentId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'studentName studentId class boardType')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/today
// @desc    Get today's attendance summary
// @access  Private (Teacher only)
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ 
      date: today,
      instituteId: req.user.instituteId
    }).populate('studentId', 'studentName studentId class boardType');

    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const totalActive = await Student.countDocuments({ 
      status: 'active',
      instituteId: req.user.instituteId
    });

    res.json({
      date: today,
      present: presentCount,
      absent: absentCount,
      notMarked: totalActive - attendance.length,
      total: totalActive,
      records: attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;