import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { studentsAPI, attendanceAPI } from '../services/api';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [classFilter, setClassFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchStudents(); }, [classFilter]);
  useEffect(() => { fetchAttendanceForDate(); }, [selectedDate, students]);

  const fetchStudents = async () => {
    try {
      const params = { status: 'active', limit: 1000 };
      if (classFilter) params.class = classFilter;
      const r = await studentsAPI.getAll(params);
      setStudents(r.data.students || []);
    } catch (e) { setStudents([]); }
  };

  const fetchAttendanceForDate = async () => {
    try {
      const r = await attendanceAPI.getAll({ date: selectedDate });
      const map = {};
      r.data.forEach(rec => { map[rec.studentId._id] = rec.status; });
      setAttendanceData(map);
    } catch (e) { /* ok */ }
  };

  const markAllPresent = () => {
    const d = {};
    students.forEach(s => { d[s._id] = 'present'; });
    setAttendanceData(d);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await attendanceAPI.bulkMark({ date: selectedDate, attendanceData: students.map(s => ({ studentId: s._id, status: attendanceData[s._id] || 'absent' })) });
      alert('Attendance marked successfully!');
      fetchAttendanceForDate();
    } catch (e) { alert('Error: ' + (e.response?.data?.message || 'Unknown error')); }
    finally { setSubmitting(false); }
  };

  const presentCount = Object.values(attendanceData).filter(v => v === 'present').length;
  const absentCount = Object.values(attendanceData).filter(v => v === 'absent').length;

  return (
    <div className="attendance-3d" style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div className="ambient-bg"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>

      <motion.div className="page-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Daily Attendance</h1>
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
          <motion.button className="btn-secondary" onClick={markAllPresent} whileHover={{scale:1.02}} whileTap={{scale:0.98}}>Mark All Present</motion.button>
          <motion.button className="btn-primary" onClick={handleSubmit} disabled={submitting} whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
            {submitting ? 'Saving...' : 'Submit Attendance'}
          </motion.button>
        </div>
      </motion.div>

      {/* 3D Stats Bar */}
      <motion.div className="attendance-stats-3d" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.15}}>
        <div className="att-stat glass"><span className="att-stat-num" style={{color:'var(--text-white)'}}>{students.length}</span><span className="att-stat-label">Total</span></div>
        <div className="att-stat glass"><span className="att-stat-num" style={{color:'var(--accent-cyan)'}}>{presentCount}</span><span className="att-stat-label">Present</span></div>
        <div className="att-stat glass"><span className="att-stat-num" style={{color:'var(--accent-rose)'}}>{absentCount}</span><span className="att-stat-label">Absent</span></div>
        <div className="att-stat glass"><span className="att-stat-num" style={{color:'var(--accent-amber)'}}>{students.length - presentCount - absentCount}</span><span className="att-stat-label">Unmarked</span></div>
      </motion.div>

      {/* Controls */}
      <div className="att-controls">
        <div className="form-group"><label>Date</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} max={new Date().toISOString().split('T')[0]} /></div>
        <div className="form-group"><label>Class</label><select value={classFilter} onChange={e => setClassFilter(e.target.value)}><option value="">All</option>{[...Array(12)].map((_, i) => <option key={i} value={`${i+1}`}>{i+1}th</option>)}</select></div>
      </div>

      {/* Student List with 3D Toggles */}
      <div className="att-student-list">
        {students.length === 0 && <p className="no-data">{classFilter ? `No students in class ${classFilter}` : 'No active students'}</p>}
        {students.map((s, i) => {
          const status = attendanceData[s._id];
          return (
            <motion.div
              key={s._id} className={`att-student-row glass${status ? ' marked' : ''}`}
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              <div className="att-student-info">
                <span className="att-student-name">{s.studentName}</span>
                <span className="att-student-meta">{s.class}th · {s.boardType} · {s.studentId}</span>
              </div>
              <div className="att-toggle-group">
                <motion.button
                  className={`att-toggle att-present${status === 'present' ? ' active' : ''}`}
                  onClick={() => setAttendanceData({...attendanceData, [s._id]: 'present'})}
                  whileTap={{ scale: 0.9 }}
                >Present</motion.button>
                <motion.button
                  className={`att-toggle att-absent${status === 'absent' ? ' active' : ''}`}
                  onClick={() => setAttendanceData({...attendanceData, [s._id]: 'absent'})}
                  whileTap={{ scale: 0.9 }}
                >Absent</motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .attendance-stats-3d { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .att-stat { padding: 1rem; border-radius: var(--r-lg); text-align: center; }
        .att-stat-num { display: block; font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; }
        .att-stat-label { font-size: 0.78rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.04em; }
        .att-controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .att-controls .form-group { min-width: 180px; }

        .att-student-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .att-student-row { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.25rem; border-radius: var(--r-lg); border: 1px solid var(--border-glass); transition: all 0.2s ease; gap: 1rem; }
        .att-student-row.marked { border-color: rgba(79,124,255,0.15); }
        .att-student-info { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
        .att-student-name { font-weight: 600; font-size: 0.95rem; color: var(--text-white); }
        .att-student-meta { font-size: 0.78rem; color: var(--text-tertiary); }
        .att-toggle-group { display: flex; gap: 0.4rem; flex-shrink: 0; }
        .att-toggle { padding: 0.45rem 1rem; border-radius: var(--r-md); border: 1px solid var(--border-glass); background: transparent; color: var(--text-secondary); font-size: 0.85rem; font-weight: 500; cursor: pointer; font-family: var(--font-body); transition: all 0.25s ease; }
        .att-present.active { background: rgba(6,214,160,0.15); border-color: rgba(6,214,160,0.4); color: var(--accent-cyan); box-shadow: 0 0 20px rgba(6,214,160,0.1); }
        .att-absent.active { background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.4); color: var(--accent-rose); box-shadow: 0 0 20px rgba(244,63,94,0.1); }

        @media (max-width: 768px) {
          .attendance-stats-3d { grid-template-columns: repeat(2, 1fr); }
          .att-student-row { flex-direction: column; align-items: flex-start; gap: 0.6rem; }
          .att-toggle-group { align-self: flex-end; }
        }
      `}</style>
    </div>
  );
}

export default Attendance;