import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        <div className="App">
          {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
          
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <LandingPage />
              } 
            />

            <Route 
              path="/about" 
              element={<AboutPage />} 
            />

            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Register />
              } 
            />

            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? 
                <Dashboard user={user} /> : 
                <Navigate to="/" />
              } 
            />
            
            <Route 
              path="/students" 
              element={
                isAuthenticated ? 
                <StudentManagement /> : 
                <Navigate to="/" />
              } 
            />
            
            <Route 
              path="/attendance" 
              element={
                isAuthenticated ? 
                <Attendance /> : 
                <Navigate to="/" />
              } 
            />
            
            <Route 
              path="/fees" 
              element={
                isAuthenticated ? 
                <FeeManagement /> : 
                <Navigate to="/" />
              } 
            />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;