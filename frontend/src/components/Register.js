import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    instituteName: '',
    ownerName: '',
    email: '',
    contactNumber: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.contactNumber.length !== 10) {
      setError('Contact number must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      setSuccess(
        `✅ Institute registered successfully! Your Institute Code: ${response.data.instituteCode}. Redirecting to login...`
      );
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
<h1>
          <span style={{color: '#667eea', fontWeight: 700}}>Vidhya</span>
          <span style={{color: '#ffd700', fontWeight: 900}}>+</span>
        </h1>        <p className="subtitle">Start managing your classes today - Free 30 days trial!</p>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>📚 Institute Information</h3>
            
            <div className="form-group">
              <label>Institute Name *</label>
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                required
                placeholder="e.g., MR Classes"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Owner/Teacher Name *</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  placeholder="10 digit mobile number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>Address (Optional)</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                placeholder="Institute address"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>👤 Login Credentials</h3>
            
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? 'Registering...' : '🚀 Register Institute'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
}

export default Register;