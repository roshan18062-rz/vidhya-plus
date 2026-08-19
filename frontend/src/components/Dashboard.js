import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { studentsAPI, attendanceAPI, feesAPI } from '../services/api';
import AnimatedCounter from './ui/AnimatedCounter';
import { DashboardSkeleton } from './ui/SkeletonLoader';

const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const staggerItem = { hidden: { opacity: 0, y: 30, rotateX: 8 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

const dashboardCards = [
  { key: 'students', icon: '■', iconColor: 'var(--accent-blue)', glowColor: 'var(--accent-blue-glow)', label: 'Total Students', getValue: (s) => s.students.totalStudents, details: (s) => [
    { label: 'CBSE', value: s.students.boardWise.CBSE || 0, color: 'var(--accent-blue)' },
    { label: 'ICSE', value: s.students.boardWise.ICSE || 0, color: 'var(--accent-violet)' },
    { label: 'State', value: s.students.boardWise['State Board'] || 0, color: 'var(--accent-cyan)' },
  ]},
  { key: 'attendance', icon: '◉', iconColor: 'var(--accent-cyan)', glowColor: 'var(--accent-cyan-glow)', label: "Today's Attendance", getValue: (s) => `${s.attendance.present}/${s.attendance.total}`, details: (s) => [
    { label: 'Present', value: s.attendance.present, color: 'var(--accent-cyan)' },
    { label: 'Absent', value: s.attendance.absent, color: 'var(--accent-rose)' },
    { label: 'Not Marked', value: s.attendance.notMarked, color: 'var(--accent-amber)' },
  ]},
  { key: 'fees', icon: '◈', iconColor: 'var(--accent-amber)', glowColor: 'var(--accent-amber-glow)', label: "This Month's Fees", getValue: (s) => `₹${s.fees.totalCollected}`, details: (s) => [
    { label: 'Paid', value: s.fees.paidCount, color: 'var(--accent-cyan)' },
    { label: 'Pending', value: s.fees.pendingCount, color: 'var(--accent-rose)' },
  ]},
];

function Dashboard({ user }) {
  const [stats, setStats] = useState({ students: { totalStudents: 0, boardWise: {} }, attendance: { present: 0, absent: 0, notMarked: 0, total: 0 }, fees: { totalCollected: 0, paidCount: 0, pendingCount: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, a, f] = await Promise.all([studentsAPI.getStats(), attendanceAPI.getToday(), feesAPI.getStats()]);
        setStats({ students: s.data, attendance: a.data, fees: f.data });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const daysRemaining = user?.subscriptionExpiry
    ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (loading) return (
    <div style={{ padding: '2rem' }}><DashboardSkeleton /></div>
  );

  return (
    <div className="dashboard-3d">
      <div className="ambient-bg"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>

      <div className="dashboard-3d-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dash-welcome">Welcome to {user?.instituteName}</p>
        </div>
        {user?.subscriptionStatus === 'trial' && (
          <div className="trial-alert-3d glass">
            <span className="trial-alert-dot" />
            Trial: {daysRemaining} days remaining
          </div>
        )}
      </div>

      <motion.div className="dashboard-3d-grid" variants={staggerContainer} initial="hidden" animate="visible" style={{ perspective: '1200px' }}>
        {dashboardCards.map(card => (
          <motion.div key={card.key} variants={staggerItem}>
            <motion.div
              className="dash-card-3d card-3d"
              whileHover={{ y: -8, rotateX: -3, rotateY: 3, transition: { duration: 0.35 } }}
              style={{ boxShadow: `var(--shadow-3d), 0 0 40px ${card.glowColor}` }}
            >
              <div className="dash-card-header">
                <span className="dash-card-icon" style={{ color: card.iconColor }}>{card.icon}</span>
                <span className="dash-card-label">{card.label}</span>
              </div>
              <div className="dash-card-value">{card.getValue(stats)}</div>
              <div className="dash-card-details">
                {card.details(stats).map(d => (
                  <div key={d.label} className="dash-detail-row">
                    <span className="dash-detail-dot" style={{ background: d.color }} />
                    <span className="dash-detail-label">{d.label}</span>
                    <span className="dash-detail-value" style={{ color: d.color }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Quick Actions Card */}
        <motion.div variants={staggerItem}>
          <motion.div
            className="dash-card-3d card-3d"
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
          >
            <div className="dash-card-header">
              <span className="dash-card-icon" style={{ color: 'var(--accent-violet)' }}>◈</span>
              <span className="dash-card-label">Quick Actions</span>
            </div>
            <div className="quick-actions-3d">
              {[
                { label: 'Add Student', to: '/students', color: 'var(--accent-blue)' },
                { label: 'Mark Attendance', to: '/attendance', color: 'var(--accent-cyan)' },
                { label: 'Record Payment', to: '/fees', color: 'var(--accent-amber)' },
              ].map(a => (
                <motion.a key={a.to} href={a.to} className="quick-action-btn glass-light"
                  whileHover={{ scale: 1.03, x: 4 }} whileTap={{ scale: 0.97 }}
                  style={{ borderLeft: `3px solid ${a.color}` }}
                >
                  {a.label}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{opacity:0.5}}><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Institute Info */}
      <motion.div
        className="institute-card-3d card-3d"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3 className="inst-card-title">Institute Information</h3>
        <div className="inst-info-grid">
          {[
            { label: 'Institute Code', value: user?.instituteCode },
            { label: 'Subscription', value: user?.subscriptionStatus?.toUpperCase(), badge: true },
            { label: 'Email', value: user?.email },
          ].map(item => (
            <div key={item.label} className="inst-info-item">
              <span className="inst-info-label">{item.label}</span>
              <span className={item.badge ? `inst-badge inst-badge-${user?.subscriptionStatus}` : 'inst-info-value'}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        .dashboard-3d { padding: 1.5rem; max-width: 1280px; margin: 0 auto; position: relative; min-height: calc(100vh - 64px); }
        .dashboard-3d-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .dashboard-3d-header h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--text-white); margin: 0; }
        .dash-welcome { color: var(--text-tertiary); font-size: 0.9rem; margin-top: 0.25rem; }
        .trial-alert-3d { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: var(--r-full); font-size: 0.85rem; color: var(--accent-amber); border: 1px solid rgba(245,158,11,0.2); }
        .trial-alert-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-amber); animation: pulse-dot 2s ease-in-out infinite; }

        .dashboard-3d-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
        .dash-card-3d { transform-style: preserve-3d; }
        .dash-card-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .dash-card-icon { font-size: 1.3rem; }
        .dash-card-label { font-size: 0.85rem; color: var(--text-tertiary); font-weight: 500; }
        .dash-card-value { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--text-white); margin-bottom: 1rem; }
        .dash-card-details { display: flex; flex-direction: column; gap: 0.5rem; }
        .dash-detail-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
        .dash-detail-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .dash-detail-label { color: var(--text-tertiary); flex: 1; }
        .dash-detail-value { font-weight: 600; font-family: var(--font-mono); }

        .quick-actions-3d { display: flex; flex-direction: column; gap: 0.5rem; }
        .quick-action-btn { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: var(--r-md); text-decoration: none; color: var(--text-primary); font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
        .quick-action-btn:hover { background: rgba(255,255,255,0.06); }

        .institute-card-3d { margin-top: 0.5rem; }
        .inst-card-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--text-white); margin-bottom: 1rem; }
        .inst-info-grid { display: flex; gap: 2rem; flex-wrap: wrap; }
        .inst-info-item { display: flex; flex-direction: column; gap: 0.2rem; }
        .inst-info-label { font-size: 0.78rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.04em; }
        .inst-info-value { font-size: 0.95rem; color: var(--text-primary); font-weight: 500; }
        .inst-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: var(--r-full); font-size: 0.78rem; font-weight: 600; }
        .inst-badge-trial { background: rgba(245,158,11,0.15); color: var(--accent-amber); }
        .inst-badge-active { background: rgba(6,214,160,0.15); color: var(--accent-cyan); }
        .inst-badge-inactive { background: rgba(244,63,94,0.15); color: var(--accent-rose); }
      `}</style>
    </div>
  );
}

export default Dashboard;
