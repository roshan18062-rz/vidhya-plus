import React, { useState, useEffect } from 'react';
import { studentsAPI, feesAPI } from '../services/api';

function FeeManagement() {
  const [students, setStudents] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [paidStudents, setPaidStudents] = useState([]); // ✅ NEW: Track paid students
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    amount: '',
    paymentMode: 'cash',
    monthYear: new Date().toISOString().slice(0, 7)
  });
  const [feeStats, setFeeStats] = useState({});

  useEffect(() => {
    fetchStudents();
    fetchPendingFees();
    fetchFeeStats();
    fetchPaidStudents(); // ✅ NEW
  }, []);

  // ✅ Refetch when month changes
  useEffect(() => {
    fetchPaidStudents();
    fetchPendingFees();
    fetchFeeStats();
  }, [paymentData.monthYear]);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll({ 
        status: 'active',
        limit: 1000
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  // ✅ NEW: Fetch students who already paid for selected month
  const fetchPaidStudents = async () => {
    try {
      const response = await feesAPI.getAll({
        monthYear: paymentData.monthYear,
        status: 'paid'
      });
      
      // Extract student IDs who already paid
      const paidIds = response.data.map(fee => fee.studentId._id);
      setPaidStudents(paidIds);
    } catch (error) {
      console.error('Error fetching paid students:', error);
      setPaidStudents([]);
    }
  };

  const fetchPendingFees = async () => {
    try {
      const response = await feesAPI.getPending();
      setPendingFees(response.data);
    } catch (error) {
      console.error('Error fetching pending fees:', error);
    }
  };

  const fetchFeeStats = async () => {
    try {
      const response = await feesAPI.getStats();
      setFeeStats(response.data);
    } catch (error) {
      console.error('Error fetching fee stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });

    // Auto-fill amount when student is selected
    if (name === 'studentId') {
      const student = students.find(s => s._id === value);
      if (student) {
        setPaymentData(prev => ({
          ...prev,
          amount: student.monthlyFee
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (paidStudents.includes(paymentData.studentId)) {
      const student = students.find(s => s._id === paymentData.studentId);
      alert(`⚠️ ${student.studentName} has already paid fees for ${paymentData.monthYear}!`);
      return;
    }

    try {
      await feesAPI.create(paymentData);
      alert('✅ Payment recorded successfully!');
      
      setPaymentData({
        studentId: '',
        amount: '',
        paymentMode: 'cash',
        monthYear: new Date().toISOString().slice(0, 7)
      });
      
      setShowPaymentForm(false);
      fetchPendingFees();
      fetchFeeStats();
      fetchPaidStudents(); // ✅ Refresh paid list
    } catch (error) {
      // ✅ Show backend error message
      const errorMsg = error.response?.data?.message || 'Unknown error';
      alert('❌ Error: ' + errorMsg);
      
      // If already paid, refresh the lists
      if (error.response?.data?.alreadyPaid) {
        fetchPaidStudents();
        fetchPendingFees();
        fetchFeeStats();
      }
    }
  };

  const handleQuickPay = (student) => {
    setPaymentData({
      studentId: student._id,
      amount: student.monthlyFee,
      paymentMode: 'cash',
      monthYear: new Date().toISOString().slice(0, 7)
    });
    setShowPaymentForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fee-management">
      <h1>💰 Fee Management</h1>

      {/* Fee Statistics */}
      <div className="fee-stats">
        <div className="stat-card">
          <h3>Total Collected (This Month)</h3>
          <div className="stat-value">₹{feeStats.totalCollected || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Paid Students</h3>
          <div className="stat-value">{feeStats.paidCount || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Students</h3>
          <div className="stat-value text-danger">{feeStats.pendingCount || 0}</div>
        </div>
      </div>

      <div className="page-header">
        <h2>Pending Fees</h2>
        <button className="btn-primary" onClick={() => setShowPaymentForm(!showPaymentForm)}>
          {showPaymentForm ? 'Cancel' : '+ Record Payment'}
        </button>
      </div>

      {showPaymentForm && (
        <div className="form-container">
          <h3>Record Fee Payment</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Select Student *</label>
                <select
                  name="studentId"
                  value={paymentData.studentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choose Student</option>
                  {students.map(student => {
                    const alreadyPaid = paidStudents.includes(student._id);
                    return (
                      <option 
                        key={student._id} 
                        value={student._id}
                        disabled={alreadyPaid}
                        style={{ 
                          color: alreadyPaid ? '#999' : '#000',
                          fontWeight: alreadyPaid ? 'normal' : 'normal'
                        }}
                      >
                        {student.studentId} - {student.studentName} (Class {student.class})
                        {alreadyPaid ? ' ✓ PAID' : ''}
                      </option>
                    );
                  })}
                </select>
                {/* ✅ Helper text */}
                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  Students marked with ✓ PAID have already paid for {paymentData.monthYear}
                </small>
              </div>

              <div className="form-group">
                <label>Month/Year *</label>
                <input
                  type="month"
                  name="monthYear"
                  value={paymentData.monthYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Payment Mode *</label>
                <select
                  name="paymentMode"
                  value={paymentData.paymentMode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Record Payment
            </button>
          </form>
        </div>
      )}

      {/* Pending Fees Table */}
      <div className="table-container">
        <table className="fees-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Board</th>
              <th>Monthly Fee</th>
              <th>Month</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {pendingFees.map((record, index) => (
    <tr key={index}>
      <td data-label="Student ID">{record.student.studentId}</td>
      <td data-label="Name">{record.student.studentName}</td>
      <td data-label="Class">{record.student.class}</td>
      <td data-label="Board">{record.student.boardType}</td>
      <td data-label="Fee">₹{record.amount}</td>
      <td data-label="Month">{record.monthYear}</td>
      <td data-label="Status">
        <span className="badge badge-pending">{record.status}</span>
      </td>
      <td data-label="Action">
        <button 
          className="btn-pay"
          onClick={() => handleQuickPay(record.student)}
        >
          Pay Now
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>

        {pendingFees.length === 0 && (
          <p className="no-data">🎉 All students have paid fees for this month!</p>
        )}
      </div>
    </div>
  );
}

export default FeeManagement;