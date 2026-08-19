import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { studentsAPI, feesAPI } from '../services/api';

function FeeManagement() {
  const [students, setStudents] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [paidStudents, setPaidStudents] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({ studentId: '', amount: '', paymentMode: 'cash', monthYear: new Date().toISOString().slice(0, 7) });
  const [feeStats, setFeeStats] = useState({});

  useEffect(() => { fetchStudents(); fetchPendingFees(); fetchFeeStats(); fetchPaidStudents(); }, []);
  useEffect(() => { fetchPaidStudents(); fetchPendingFees(); fetchFeeStats(); }, [paymentData.monthYear]);

  const fetchStudents = async () => { try { const r = await studentsAPI.getAll({ status: 'active', limit: 1000 }); setStudents(r.data.students || []); } catch (e) { setStudents([]); } };
  const fetchPaidStudents = async () => { try { const r = await feesAPI.getAll({ monthYear: paymentData.monthYear, status: 'paid' }); setPaidStudents(r.data.map(f => f.studentId._id)); } catch (e) { setPaidStudents([]); } };
  const fetchPendingFees = async () => { try { const r = await feesAPI.getPending(); setPendingFees(r.data); } catch (e) { /* ok */ } };
  const fetchFeeStats = async () => { try { const r = await feesAPI.getStats(); setFeeStats(r.data); } catch (e) { /* ok */ } };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
    if (name === 'studentId') { const s = students.find(st => st._id === value); if (s) setPaymentData(prev => ({ ...prev, amount: s.monthlyFee })); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paidStudents.includes(paymentData.studentId)) { const s = students.find(st => st._id === paymentData.studentId); alert(`${s.studentName} already paid for ${paymentData.monthYear}!`); return; }
    try {
      await feesAPI.create(paymentData); alert('Payment recorded!');
      setPaymentData({ studentId: '', amount: '', paymentMode: 'cash', monthYear: new Date().toISOString().slice(0, 7) });
      setShowPaymentForm(false); fetchPendingFees(); fetchFeeStats(); fetchPaidStudents();
    } catch (err) { alert('Error: ' + (err.response?.data?.message || 'Unknown')); if (err.response?.data?.alreadyPaid) { fetchPaidStudents(); fetchPendingFees(); fetchFeeStats(); } }
  };

  const handleQuickPay = (student) => {
    setPaymentData({ studentId: student._id, amount: student.monthlyFee, paymentMode: 'cash', monthYear: new Date().toISOString().slice(0, 7) });
    setShowPaymentForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statsCards = [
    { label: 'Collected', value: `₹${feeStats.totalCollected || 0}`, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)' },
    { label: 'Paid', value: feeStats.paidCount || 0, color: 'var(--accent-blue)', glow: 'var(--accent-blue-glow)' },
    { label: 'Pending', value: feeStats.pendingCount || 0, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)' },
  ];

  return (
    <div className="fees-3d" style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div className="ambient-bg"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>

      <motion.div className="page-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Fee Management</h1>
        <motion.button className="btn-primary" onClick={() => setShowPaymentForm(!showPaymentForm)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {showPaymentForm ? 'Cancel' : '+ Record Payment'}
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="fees-stats-3d" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
        {statsCards.map(sc => (
          <motion.div key={sc.label} className="fee-stat-card card-3d" whileHover={{ y: -4, transition: { duration: 0.25 } }} style={{ boxShadow: `var(--shadow-3d), 0 0 30px ${sc.glow}` }}>
            <span className="fee-stat-label">{sc.label} (This Month)</span>
            <span className="fee-stat-value" style={{ color: sc.color }}>{sc.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Payment Form */}
      <AnimatePresence>
        {showPaymentForm && (
          <motion.div className="form-container" initial={{ opacity: 0, height: 0, rotateX: -5 }} animate={{ opacity: 1, height: 'auto', rotateX: 0 }} exit={{ opacity: 0, height: 0, rotateX: 5 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ perspective: 1200, overflow: 'hidden' }}>
            <h3>Record Fee Payment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Student *</label><select name="studentId" value={paymentData.studentId} onChange={handleInputChange} required><option value="">Choose Student</option>{students.map(s => <option key={s._id} value={s._id} disabled={paidStudents.includes(s._id)}>{s.studentId} - {s.studentName} ({s.class}th){paidStudents.includes(s._id) ? ' ✓ PAID' : ''}</option>)}</select></div>
                <div className="form-group"><label>Month/Year *</label><input type="month" name="monthYear" value={paymentData.monthYear} onChange={handleInputChange} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Amount *</label><input type="number" name="amount" value={paymentData.amount} onChange={handleInputChange} required min="0" /></div>
                <div className="form-group"><label>Payment Mode *</label><select name="paymentMode" value={paymentData.paymentMode} onChange={handleInputChange} required><option value="cash">Cash</option><option value="online">Online</option><option value="upi">UPI</option><option value="cheque">Cheque</option><option value="bank_transfer">Bank Transfer</option></select></div>
              </div>
              <button type="submit" className="btn-primary" style={{marginTop:'0.5rem'}}>Record Payment</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending List */}
      <div className="fees-pending-section">
        <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',color:'var(--text-white)',marginBottom:'1rem'}}>Pending Fees</h2>
        {pendingFees.length === 0
          ? <div className="card-3d" style={{textAlign:'center',padding:'2rem',color:'var(--accent-cyan)'}}>All students have paid fees for this month!</div>
          : <div className="fees-pending-grid">
              {pendingFees.map((record, i) => (
                <motion.div key={i} className="pending-card-3d card-3d" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} whileHover={{y:-4,boxShadow:'var(--shadow-3d), var(--shadow-glow-amber)',transition:{duration:0.25}}}>
                  <div className="pending-card-top">
                    <div>
                      <div style={{fontWeight:600,color:'var(--text-white)',fontSize:'0.95rem'}}>{record.student.studentName}</div>
                      <div style={{fontSize:'0.8rem',color:'var(--text-tertiary)',marginTop:'0.15rem'}}>{record.student.class}th · {record.student.boardType} · {record.student.studentId}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--accent-amber)'}}>₹{record.amount}</div>
                      <div style={{fontSize:'0.78rem',color:'var(--text-tertiary)'}}>{record.monthYear}</div>
                    </div>
                  </div>
                  <motion.button className="btn-pay-3d" onClick={() => handleQuickPay(record.student)} whileHover={{scale:1.03}} whileTap={{scale:0.97}}>Pay Now</motion.button>
                </motion.div>
              ))}
            </div>
        }
      </div>

      <style>{`
        .fees-stats-3d { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .fee-stat-card { text-align: center; padding: 1.25rem; }
        .fee-stat-label { display: block; font-size: 0.82rem; color: var(--text-tertiary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em; }
        .fee-stat-value { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; }

        .fees-pending-section { margin-top: 1.5rem; }
        .fees-pending-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
        .pending-card-3d { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
        .pending-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .btn-pay-3d { width: 100%; padding: 0.6rem; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: var(--accent-amber); border-radius: var(--r-md); font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: var(--font-body); transition: all 0.2s ease; }
        .btn-pay-3d:hover { background: rgba(245,158,11,0.2); }
      `}</style>
    </div>
  );
}

export default FeeManagement;