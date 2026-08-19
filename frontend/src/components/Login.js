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
        initial={{ opacity: 0, y: 50, rotateX: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1200 }}
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
      <style>{`
        .auth-page-3d {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          background: radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.12) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(79,124,255,0.08) 0%, transparent 50%),
                      var(--bg-primary);
        }
        .auth-box-3d {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-radius: var(--r-xl);
          position: relative;
          z-index: 1;
          transform-style: preserve-3d;
        }
        .auth-box-3d::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(79,124,255,0.3), transparent 50%, rgba(124,58,237,0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .auth-brand { text-align: center; margin-bottom: 1.5rem; }
        .auth-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-white);
          text-align: center;
          margin-bottom: 0.3rem;
        }
        .auth-subtitle {
          text-align: center;
          color: var(--text-tertiary);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        .auth-btn { width: 100%; margin-top: 0.5rem; }
        .auth-switch {
          text-align: center;
          color: var(--text-tertiary);
          font-size: 0.88rem;
          margin-top: 1.5rem;
        }
        .auth-switch a {
          color: var(--accent-blue);
          text-decoration: none;
          font-weight: 500;
        }
        .auth-switch a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default Login;