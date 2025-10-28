import React, { useState, useEffect } from 'react';
import { studentsAPI, attendanceAPI } from '../services/api';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [classFilter, setClassFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [classFilter]);

  useEffect(() => {
    fetchAttendanceForDate();
  }, [selectedDate, students]);

  const fetchStudents = async () => {
    try {
      const params = { 
        status: 'active',
        limit: 1000 // Get all students for attendance (no pagination needed here)
      };
      if (classFilter) params.class = classFilter;
      
      const response = await studentsAPI.getAll(params);
      
      // FIX: Access the students array from paginated response
      setStudents(response.data.students || []); // ✅ FIXED!
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]); // Set empty array on error
    }
  };

  const fetchAttendanceForDate = async () => {
    try {
      const response = await attendanceAPI.getAll({ date: selectedDate });
      const attendanceMap = {};
      
      // response.data is an array of attendance records
      response.data.forEach(record => {
        attendanceMap[record.studentId._id] = record.status;
      });
      
      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  const markAllPresent = () => {
    const newData = {};
    students.forEach(student => {
      newData[student._id] = 'present';
    });
    setAttendanceData(newData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const bulkData = students.map(student => ({
        studentId: student._id,
        status: attendanceData[student._id] || 'absent'
      }));

      await attendanceAPI.bulkMark({
        date: selectedDate,
        attendanceData: bulkData
      });

      alert('Attendance marked successfully!');
      fetchAttendanceForDate();
    } catch (error) {
      alert('Error marking attendance: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance">
      <h1>📅 Daily Attendance</h1>

      <div className="attendance-controls">
        <div className="form-group">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label>Filter by Class:</label>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">All Classes</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={`${i + 1}`}>{i + 1}th</option>
            ))}
          </select>
        </div>

        <button className="btn-secondary" onClick={markAllPresent}>
          Mark All Present
        </button>

        <button 
          className="btn-primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Submit Attendance'}
        </button>
      </div>

      {/* Show loading state */}
      {students.length === 0 && !classFilter && (
        <div className="loading-spinner">Loading students...</div>
      )}

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Board</th>
              <th>Parent Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.studentName}</td>
                <td>{student.class}</td>
                <td>{student.boardType}</td>
                <td>{student.contactNumber}</td>
                <td>
                  <div className="attendance-buttons">
                    <button
                      className={`btn-attendance ${attendanceData[student._id] === 'present' ? 'present' : ''}`}
                      onClick={() => handleAttendanceChange(student._id, 'present')}
                    >
                      Present
                    </button>
                    <button
                      className={`btn-attendance ${attendanceData[student._id] === 'absent' ? 'absent' : ''}`}
                      onClick={() => handleAttendanceChange(student._id, 'absent')}
                    >
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <p className="no-data">
            {classFilter 
              ? `No students found in class ${classFilter}` 
              : 'No active students found. Please add students first.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default Attendance;