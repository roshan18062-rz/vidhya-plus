import React, { useState, useEffect, useCallback } from 'react';
import { studentsAPI } from '../services/api';

// Remove lodash import if not installed, use vanilla JS debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    class: '',
    boardType: 'CBSE',
    parentName: '',
    contactNumber: '',
    email: '',
    monthlyFee: ''
  });
  const [filters, setFilters] = useState({
    class: '',
    boardType: '',
    search: '',
    status: 'active'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [filters, pagination.page]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await studentsAPI.getAll(params);
      setStudents(response.data.students);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Vanilla JS debounced search
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await studentsAPI.update(editingId, formData);
        alert('Student updated successfully!');
      } else {
        await studentsAPI.create(formData);
        alert('Student added successfully!');
      }
      
      resetForm();
      fetchStudents();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  const handleEdit = (student) => {
    setFormData({
      studentName: student.studentName,
      class: student.class,
      boardType: student.boardType,
      parentName: student.parentName,
      contactNumber: student.contactNumber,
      email: student.email || '',
      monthlyFee: student.monthlyFee
    });
    setEditingId(student._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        await studentsAPI.delete(id);
        alert('Student removed successfully!');
        fetchStudents();
      } catch (error) {
        alert('Error deleting student');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      class: '',
      boardType: 'CBSE',
      parentName: '',
      contactNumber: '',
      email: '',
      monthlyFee: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="student-management">
      <div className="page-header">
        <h1>👨‍🎓 Student Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Student'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Student Name *</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={`${i + 1}`}>{i + 1}th</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Board *</label>
                <select
                  name="boardType"
                  value={formData.boardType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Parent Name *</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  required
                  placeholder="10 digit number"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Monthly Fee *</label>
                <input
                  type="number"
                  name="monthlyFee"
                  value={formData.monthlyFee}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Student' : 'Add Student'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by name, ID, or parent name..."
          onChange={handleSearchChange}
          className="search-input"
        />

        <select name="class" value={filters.class} onChange={handleFilterChange}>
          <option value="">All Classes</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={`${i + 1}`}>{i + 1}th</option>
          ))}
        </select>

        <select name="boardType" value={filters.boardType} onChange={handleFilterChange}>
          <option value="">All Boards</option>
          <option value="CBSE">CBSE</option>
          <option value="ICSE">ICSE</option>
          <option value="State Board">State Board</option>
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="">All Status</option>
        </select>
      </div>

      {/* Pagination Info */}
      <div className="pagination-info">
        Showing {students.length > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="loading-spinner">Loading students...</div>
      ) : (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Board</th>
                <th>Parent Name</th>
                <th>Contact</th>
                <th>Monthly Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {students.map(student => (
    <tr key={student._id}>
      <td data-label="Student ID">{student.studentId}</td>
      <td data-label="Name">{student.studentName}</td>
      <td data-label="Class">{student.class}</td>
      <td data-label="Board"><span className="badge">{student.boardType}</span></td>
      <td data-label="Parent">{student.parentName}</td>
      <td data-label="Contact">{student.contactNumber}</td>
      <td data-label="Fee">₹{student.monthlyFee}</td>
      <td data-label="Actions">
        <button className="btn-edit" onClick={() => handleEdit(student)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => handleDelete(student._id)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>

          {students.length === 0 && (
            <p className="no-data">No students found matching your filters</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={!pagination.hasPrevPage}
            className="btn-pagination"
          >
            « First
          </button>
          
          <button 
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className="btn-pagination"
          >
            ‹ Previous
          </button>
          
          <div className="pagination-info-center">
            Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
          </div>
          
          <button 
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="btn-pagination"
          >
            Next ›
          </button>
          
          <button 
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={!pagination.hasNextPage}
            className="btn-pagination"
          >
            Last »
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;