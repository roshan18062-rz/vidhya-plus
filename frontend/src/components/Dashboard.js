import React, { useState, useEffect } from 'react';
import { studentsAPI, attendanceAPI, feesAPI } from '../services/api';

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
      
      <div className="dashboard-grid">
        {/* Students Stats */}
        <div className="card">
          <h3>👨‍🎓 Total Students</h3>
          <div className="stat-number">{stats.students.totalStudents}</div>
          <div className="stat-details">
            <p>CBSE: {stats.students.boardWise.CBSE || 0}</p>
            <p>ICSE: {stats.students.boardWise.ICSE || 0}</p>
            <p>State: {stats.students.boardWise['State Board'] || 0}</p>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="card">
          <h3>📅 Today's Attendance</h3>
          <div className="stat-number">
            {stats.attendance.present}/{stats.attendance.total}
          </div>
          <div className="stat-details">
            <p className="text-success">Present: {stats.attendance.present}</p>
            <p className="text-danger">Absent: {stats.attendance.absent}</p>
            <p className="text-warning">Not Marked: {stats.attendance.notMarked}</p>
          </div>
        </div>

        {/* Fee Collection */}
        <div className="card">
          <h3>💰 This Month's Fees</h3>
          <div className="stat-number">₹{stats.fees.totalCollected}</div>
          <div className="stat-details">
            <p className="text-success">Paid: {stats.fees.paidCount}</p>
            <p className="text-danger">Pending: {stats.fees.pendingCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-actions">
            <button className="btn-action" onClick={() => window.location.href = '/students'}>
              Add Student
            </button>
            <button className="btn-action" onClick={() => window.location.href = '/attendance'}>
              Mark Attendance
            </button>
            <button className="btn-action" onClick={() => window.location.href = '/fees'}>
              Record Payment
            </button>
          </div>
        </div>
      </div>

      {/* Institute Info Card */}
      <div className="institute-info-card">
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
      </div>
    </div>
  );
}

export default Dashboard;