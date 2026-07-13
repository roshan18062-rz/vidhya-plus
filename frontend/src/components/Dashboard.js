import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { studentsAPI, attendanceAPI, feesAPI } from '../services/api';
import TiltCard from './ui/TiltCard';
import { motionTokens, springs } from '../lib/motion-tokens';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: motionTokens.distance.md },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
};

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    students: { totalStudents: 0, boardWise: {} },
    attendance: { present: 0, absent: 0, notMarked: 0, total: 0 },
    fees: { totalCollected: 0, paidCount: 0, pendingCount: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentStats, attendanceStats, feeStats] = await Promise.all([
        studentsAPI.getStats(),
        attendanceAPI.getToday(),
        feesAPI.getStats()
      ]);

      setStats({
        students: studentStats.data,
        attendance: attendanceStats.data,
        fees: feeStats.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Calculate days remaining in trial
  const daysRemaining = user?.subscriptionExpiry 
    ? Math.ceil((new Date(user.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>📊 Dashboard</h1>
          <p className="institute-welcome">Welcome to {user?.instituteName}</p>
        </div>
        
        {user?.subscriptionStatus === 'trial' && (
          <div className="trial-alert">
            ⏰ Trial: {daysRemaining} days remaining
          </div>
        )}
      </div>
      
      <motion.div
        className="dashboard-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Students Stats */}
        <motion.div variants={staggerItem}>
          <TiltCard className="card" maxTilt={5}>
            <h3>👨‍🎓 Total Students</h3>
            <div className="stat-number">{stats.students.totalStudents}</div>
            <div className="stat-details">
              <p>CBSE: {stats.students.boardWise.CBSE || 0}</p>
              <p>ICSE: {stats.students.boardWise.ICSE || 0}</p>
              <p>State: {stats.students.boardWise['State Board'] || 0}</p>
            </div>
          </TiltCard>
        </motion.div>

        {/* Today's Attendance */}
        <motion.div variants={staggerItem}>
          <TiltCard className="card" maxTilt={5}>
            <h3>📅 Today's Attendance</h3>
            <div className="stat-number">
              {stats.attendance.present}/{stats.attendance.total}
            </div>
            <div className="stat-details">
              <p className="text-success">Present: {stats.attendance.present}</p>
              <p className="text-danger">Absent: {stats.attendance.absent}</p>
              <p className="text-warning">Not Marked: {stats.attendance.notMarked}</p>
            </div>
          </TiltCard>
        </motion.div>

        {/* Fee Collection */}
        <motion.div variants={staggerItem}>
          <TiltCard className="card" maxTilt={5}>
            <h3>💰 This Month's Fees</h3>
            <div className="stat-number">₹{stats.fees.totalCollected}</div>
            <div className="stat-details">
              <p className="text-success">Paid: {stats.fees.paidCount}</p>
              <p className="text-danger">Pending: {stats.fees.pendingCount}</p>
            </div>
          </TiltCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={staggerItem}>
          <TiltCard className="card" maxTilt={5}>
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions">
              <motion.button
                className="btn-action"
                onClick={() => window.location.href = '/students'}
                whileHover={{ scale: motionTokens.scale.pop }}
                whileTap={{ scale: motionTokens.scale.press }}
                transition={springs.snappy}
              >
                Add Student
              </motion.button>
              <motion.button
                className="btn-action"
                onClick={() => window.location.href = '/attendance'}
                whileHover={{ scale: motionTokens.scale.pop }}
                whileTap={{ scale: motionTokens.scale.press }}
                transition={springs.snappy}
              >
                Mark Attendance
              </motion.button>
              <motion.button
                className="btn-action"
                onClick={() => window.location.href = '/fees'}
                whileHover={{ scale: motionTokens.scale.pop }}
                whileTap={{ scale: motionTokens.scale.press }}
                transition={springs.snappy}
              >
                Record Payment
              </motion.button>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>

      {/* Institute Info Card */}
      <motion.div
        className="institute-info-card"
        initial={{ opacity: 0, y: motionTokens.distance.md }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: 0.3 }}
      >
        <h3>🏫 Institute Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Institute Code:</span>
            <span className="info-value">{user?.instituteCode}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Subscription:</span>
            <span className={`info-value badge-${user?.subscriptionStatus}`}>
              {user?.subscriptionStatus?.toUpperCase()}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;