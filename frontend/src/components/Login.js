import React, { useState } from 'react';
import { motion } from 'motion/react';
import { authAPI } from '../services/api';
import TiltCard from './ui/TiltCard';
import { motionTokens, springs } from '../lib/motion-tokens';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      // FIX #6: server no longer returns the JWT in the response body — it's
      // set as an httpOnly cookie instead, so there's nothing to pass here.
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: motionTokens.distance.lg }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
      >
        <TiltCard className="login-box" maxTilt={4}>
        <h1>
          <span style={{color: '#1C2230', fontWeight: 700}}>Vidhya</span>
          <span style={{color: '#E2992C', fontWeight: 900}}>+</span>
        </h1>
        <h2>Login to Your Institute</h2>
        <p style={{textAlign: 'center', color: '#8B8FA3', fontSize: '0.9rem', marginBottom: '2rem'}}>
          Knowledge. Enhanced.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <motion.button
            type="submit"
            className="btn-primary btn-large"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : motionTokens.scale.pop }}
            whileTap={{ scale: loading ? 1 : motionTokens.scale.press }}
            transition={springs.snappy}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <div className="register-link">
          Don't have an account? <a href="/register">Register your institute</a>
        </div>

        <div className="demo-info">
          <p>✨ <strong>New Here?</strong> Register your tuition institute and get 30 days free trial!</p>
        </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}

export default Login;