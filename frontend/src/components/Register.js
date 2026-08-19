import React, { useState } from 'react';
import { motion } from 'motion/react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from './ui/ParticleBackground';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    instituteName: '', ownerName: '', email: '', contactNumber: '',
    address: '', username: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 10 || !/[a-z]/.test(formData.password) || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      setError('Password must be 10+ chars with uppercase, lowercase, and number'); return;
    }
    if (formData.contactNumber.length !== 10) { setError('Contact number must be 10 digits'); return; }
    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      setSuccess(`Institute registered! Code: ${response.data.instituteCode}. Redirecting...`);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-3d">
      <ParticleBackground />
      <motion.div
        className="auth-box-3d glass-strong"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-brand">
          <span className="brand-vidya" style={{ fontWeight: 700, fontSize: '1.8rem' }}>Vidhya</span>
          <span className="brand-plus" style={{ fontWeight: 900, fontSize: '1.8rem' }}>+</span>
        </div>
        <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>Start managing your classes — 30 days free!</p>

        <form onSubmit={handleSubmit}>
          <div className="form-section" style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-blue)', marginBottom: '1rem' }}>
              Institute Information
            </h3>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Institute Name *</label>
              <input type="text" name="instituteName" value={formData.instituteName} onChange={handleChange} required placeholder="e.g., MR Classes" />
            </div>
            <div className="form-row" style={{ marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label>Owner Name *</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label>Contact Number *</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required pattern="[0-9]{10}" placeholder="10 digit mobile" />
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Institute address" />
              </div>
            </div>
          </div>

          <div className="form-section" style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-violet)', marginBottom: '1rem' }}>
              Login Credentials
            </h3>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Username *</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Choose a username" />
            </div>
            <div className="form-row" style={{ marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="10" placeholder="Min 10 chars" />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" />
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <motion.button type="submit" className="btn-primary btn-large auth-btn"
            disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
            {loading ? 'Registering...' : 'Register Institute'}
          </motion.button>
        </form>

        <p className="auth-switch">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;