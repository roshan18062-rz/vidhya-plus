import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import Attendance from './components/Attendance';
import FeeManagement from './components/FeeManagement';
import Navbar from './components/Navbar';
import { authAPI } from './services/api';
import './App.css';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      authAPI.getMe()
        .then(() => { setIsAuthenticated(true); setUser(JSON.parse(userData)); })
        .catch(() => { localStorage.removeItem('user'); setIsAuthenticated(false); setUser(null); });
    } else {
      // Unauthenticated visitor — make a lightweight GET so the CSRF cookie
      // is minted before the user registers or logs in.
      authAPI.getMe().catch(() => { /* expected 401 */ });
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch (e) { /* ok */ }
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <Router>
        <AppShell isAuthenticated={isAuthenticated} user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
      </Router>
    </ErrorBoundary>
  );
}

function AppShell({ isAuthenticated, user, handleLogin, handleLogout }) {
  const location = useLocation();

  return (
    <div className="App">
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition>{isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}</PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/register" element={<PageTransition>{isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}</PageTransition>} />
          <Route path="/login" element={<PageTransition>{isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}</PageTransition>} />
          <Route path="/dashboard" element={<PageTransition>{isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/" />}</PageTransition>} />
          <Route path="/students" element={<PageTransition>{isAuthenticated ? <StudentManagement /> : <Navigate to="/" />}</PageTransition>} />
          <Route path="/attendance" element={<PageTransition>{isAuthenticated ? <Attendance /> : <Navigate to="/" />}</PageTransition>} />
          <Route path="/fees" element={<PageTransition>{isAuthenticated ? <FeeManagement /> : <Navigate to="/" />}</PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
