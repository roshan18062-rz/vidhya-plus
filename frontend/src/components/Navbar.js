import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>
          <span style={{color: '#667eea', fontWeight: 700}}>Vidhya</span>
          <span style={{color: '#ffd700', fontWeight: 900}}>+</span>
        </h2>
        <span className="institute-code">{user?.instituteCode}</span>
      </div>
      
      <ul className="navbar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/students">Students</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>
        <li><Link to="/fees">Fees</Link></li>
      </ul>
      
      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">👨‍🏫 {user?.fullName || user?.username}</span>
          <span className="user-role">{user?.instituteName}</span>
          {user?.subscriptionStatus === 'trial' && (
            <span className="trial-badge">Trial</span>
          )}
        </div>
        <button onClick={onLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;