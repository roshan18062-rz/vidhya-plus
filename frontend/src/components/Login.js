import React, { useState } from 'react';
import { motion } from 'motion/react';
import { authAPI } from '../services/api';
import ParticleBackground from './ui/ParticleBackground';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Login to your institute dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={credentials.email}
              onChange={(e) => setCredentials({...credentials, [e.target.name]: e.target.value})}
              required placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={credentials.password}
              onChange={(e) => setCredentials({...credentials, [e.target.name]: e.target.value})}
              required placeholder="Enter password" />
          </div>

          {error && <div className="error-message">{error}</div>}

          <motion.button type="submit" className="btn-primary btn-large auth-btn"
            disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="auth-switch">
          Don't have an account? <a href="/register">Register your institute</a>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;