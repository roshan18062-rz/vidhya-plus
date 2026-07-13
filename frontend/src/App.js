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
import { motionTokens } from './lib/motion-tokens';
import './App.css';

// Page transition pattern (motion-patterns skill): fade + slight rise on
// enter, fade + slight fall on exit. Every route's element gets wrapped in
// this so AnimatePresence has a motion child with initial/animate/exit to
// actually animate — Routes itself is not a motion component.
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: motionTokens.distance.sm }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -motionTokens.distance.sm }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // FIX #6: the JWT itself is never in localStorage anymore (lives in an httpOnly
  // cookie the browser sends automatically). 'user' here is just display data
  // (name/role/etc), not a credential, so keeping it in localStorage is fine.
  // We confirm the session is actually still valid server-side via /auth/me
  // rather than trusting local state alone.
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      authAPI.getMe()
        .then(() => {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
        })
        .catch(() => {
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout(); // FIX #9: revoke server-side (bumps tokenVersion)
    } catch (e) {
      // even if the network call fails, still clear local state below
    }
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <Router>
        <AppShell
          isAuthenticated={isAuthenticated}
          user={user}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      </Router>
    </ErrorBoundary>
  );
}

// Split out so useLocation() can be called inside the Router context —
// App() itself renders <Router>, so it can't call router hooks directly.
function AppShell({ isAuthenticated, user, handleLogin, handleLogout }) {
  const location = useLocation();

  return (
    <div className="App">
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                {isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
              </PageTransition>
            }
          />

          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />

          <Route
            path="/register"
            element={
              <PageTransition>
                {isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
              </PageTransition>
            }
          />

          <Route
            path="/login"
            element={
              <PageTransition>
                {isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
              </PageTransition>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PageTransition>
                {isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/" />}
              </PageTransition>
            }
          />

          <Route
            path="/students"
            element={
              <PageTransition>
                {isAuthenticated ? <StudentManagement /> : <Navigate to="/" />}
              </PageTransition>
            }
          />

          <Route
            path="/attendance"
            element={
              <PageTransition>
                {isAuthenticated ? <Attendance /> : <Navigate to="/" />}
              </PageTransition>
            }
          />

          <Route
            path="/fees"
            element={
              <PageTransition>
                {isAuthenticated ? <FeeManagement /> : <Navigate to="/" />}
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;