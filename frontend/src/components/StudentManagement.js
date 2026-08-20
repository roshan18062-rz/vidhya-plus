import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { studentsAPI } from '../services/api';
import { TableRowSkeleton } from './ui/SkeletonLoader';

function debounce(func, wait) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => func(...a), wait); }; }

const boardBadge = { CBSE: 'badge-cbse', ICSE: 'badge-icse', 'State Board': 'badge-state' };

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ studentName: '', class: '', boardType: 'CBSE', parentName: '', contactNumber: '', email: '', monthlyFee: '' });
  const [filters, setFilters] = useState({ class: '', boardType: '', search: '', status: 'active' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const r = await studentsAPI.getAll({ ...filters, page: pagination.page, limit: pagination.limit });
      setStudents(r.data.students);
      setPagination(prev => ({ ...prev, ...r.data.pagination }));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => { setFilters(prev => ({ ...prev, [e.target.name]: e.target.value })); setPagination(prev => ({ ...prev, page: 1 })); };
  const debouncedSearch = useMemo(() => debounce((s) => { setFilters(prev => ({ ...prev, search: s })); setPagination(prev => ({ ...prev, page: 1 })); }, 500), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await studentsAPI.update(editingId, formData); } else { await studentsAPI.create(formData); }
      resetForm(); fetchStudents();
    } catch (err) { alert('Error: ' + (err.response?.data?.message || 'Something went wrong')); }
  };

  const handleEdit = (s) => {
    setFormData({ studentName: s.studentName, class: s.class, boardType: s.boardType, parentName: s.parentName, contactNumber: s.contactNumber, email: s.email || '', monthlyFee: s.monthlyFee });
    setEditingId(s._id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => { if (window.confirm('Remove this student?')) { try { await studentsAPI.delete(id); fetchStudents(); } catch (e) { alert('Error deleting'); } } };
  const resetForm = () => { setFormData({ studentName: '', class: '', boardType: 'CBSE', parentName: '', contactNumber: '', email: '', monthlyFee: '' }); setEditingId(null); setShowForm(false); };

  return (
    <div className="students-3d" style={{ padding: 'calc(64px + 1.5rem) 1.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div className="ambient-bg"><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>

      <motion.div className="page-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Student Management</h1>
        <motion.button className="btn-primary" onClick={() => setShowForm(!showForm)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {showForm ? 'Cancel' : '+ Add Student'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div className="form-container" initial={{ opacity: 0, height: 0, rotateX: -5 }} animate={{ opacity: 1, height: 'auto', rotateX: 0 }} exit={{ opacity: 0, height: 0, rotateX: 5 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ perspective: 1200, overflow: 'hidden' }}>
            <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row"><div className="form-group"><label>Student Name *</label><input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} required /></div><div className="form-group"><label>Class *</label><select name="class" value={formData.class} onChange={handleInputChange} required><option value="">Select Class</option>{[...Array(12)].map((_, i) => <option key={i} value={`${i + 1}`}>{i + 1}th</option>)}</select></div><div className="form-group"><label>Board *</label><select name="boardType" value={formData.boardType} onChange={handleInputChange} required><option value="CBSE">CBSE</option><option value="ICSE">ICSE</option><option value="State Board">State Board</option></select></div></div>
              <div className="form-row"><div className="form-group"><label>Parent Name *</label><input type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} required /></div><div className="form-group"><label>Contact *</label><input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required pattern="[0-9]{10}" placeholder="10 digit number" /></div><div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} /></div></div>
              <div className="form-row"><div className="form-group"><label>Monthly Fee *</label><input type="number" name="monthlyFee" value={formData.monthlyFee} onChange={handleInputChange} required min="0" /></div></div>
              <div className="form-actions"><button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add Student'}</button><button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button></div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="filters">
        <input type="text" placeholder="Search name, ID, parent..." className="search-input" onChange={(e) => debouncedSearch(e.target.value)} />
        <select name="class" value={filters.class} onChange={handleFilterChange}><option value="">All Classes</option>{[...Array(12)].map((_, i) => <option key={i} value={`${i + 1}`}>{i + 1}th</option>)}</select>
        <select name="boardType" value={filters.boardType} onChange={handleFilterChange}><option value="">All Boards</option><option value="CBSE">CBSE</option><option value="ICSE">ICSE</option><option value="State Board">State Board</option></select>
        <select name="status" value={filters.status} onChange={handleFilterChange}><option value="active">Active</option><option value="inactive">Inactive</option><option value="">All</option></select>
      </div>

      <div className="pagination-info">Showing {students.length > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</div>

      <div className="table-container">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Class</th><th>Board</th><th>Parent</th><th>Contact</th><th>Fee</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={8} />) :
              students.map((s, i) => (
                <motion.tr key={s._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <td><span style={{fontFamily:'var(--font-mono)',fontSize:'0.82rem',color:'var(--text-tertiary)'}}>{s.studentId}</span></td>
                  <td style={{fontWeight:500,color:'var(--text-white)'}}>{s.studentName}</td>
                  <td>{s.class}th</td>
                  <td><span className={`badge ${boardBadge[s.boardType] || ''}`}>{s.boardType}</span></td>
                  <td>{s.parentName}</td>
                  <td style={{fontFamily:'var(--font-mono)',fontSize:'0.85rem'}}>{s.contactNumber}</td>
                  <td style={{fontWeight:600}}>₹{s.monthlyFee}</td>
                  <td>
                    <div style={{display:'flex',gap:'0.4rem'}}>
                      <motion.button className="btn-edit-3d" onClick={() => handleEdit(s)} whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Edit</motion.button>
                      <motion.button className="btn-delete-3d" onClick={() => handleDelete(s._id)} whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Delete</motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            }
          </tbody>
        </table>
        {students.length === 0 && !loading && <p className="no-data">No students found</p>}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => setPagination(p => ({...p,page:1}))} disabled={!pagination.hasPrevPage} className="btn-pagination">« First</button>
          <button onClick={() => setPagination(p => ({...p,page:p.page-1}))} disabled={!pagination.hasPrevPage} className="btn-pagination">‹ Prev</button>
          <div className="pagination-info-center">Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong></div>
          <button onClick={() => setPagination(p => ({...p,page:p.page+1}))} disabled={!pagination.hasNextPage} className="btn-pagination">Next ›</button>
          <button onClick={() => setPagination(p => ({...p,page:pagination.totalPages}))} disabled={!pagination.hasNextPage} className="btn-pagination">Last »</button>
        </div>
      )}

      <style>{`
        .btn-edit-3d { background: rgba(79,124,255,0.1); border: 1px solid rgba(79,124,255,0.2); color: var(--accent-blue); padding: 0.35rem 0.75rem; border-radius: var(--r-sm); cursor: pointer; font-size: 0.8rem; font-family: var(--font-body); font-weight: 500; transition: all 0.2s ease; }
        .btn-edit-3d:hover { background: rgba(79,124,255,0.2); }
        .btn-delete-3d { background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); color: var(--accent-rose); padding: 0.35rem 0.75rem; border-radius: var(--r-sm); cursor: pointer; font-size: 0.8rem; font-family: var(--font-body); font-weight: 500; transition: all 0.2s ease; }
        .btn-delete-3d:hover { background: rgba(244,63,94,0.2); }
      `}</style>
    </div>
  );
}

export default StudentManagement;
