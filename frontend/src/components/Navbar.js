import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '■' },
  { to: '/students', label: 'Students', icon: '□' },
  { to: '/attendance', label: 'Attendance', icon: '▢' },
  { to: '/fees', label: 'Fees', icon: '▣' },
];

function Navbar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav className={`glass-strong navbar-3d${scrolled ? ' navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/dashboard" className="navbar-brand-3d">
            <span className="brand-vidya">Vidhya</span>
            <span className="brand-plus">+</span>
            {user?.subscriptionStatus === 'trial' && (
              <span className="trial-chip">Trial</span>
            )}
          </Link>

          <ul className="navbar-links">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`nav-link-3d${location.pathname === link.to ? ' active' : ''}`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      className="nav-active-indicator"
                      layoutId="nav-indicator"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-right">
            <div className="navbar-user-3d">
              <div className="user-avatar-3d">
                {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="user-meta">
                <span className="user-name-3d">{user?.fullName || user?.username}</span>
                <span className="user-inst-3d">{user?.instituteName}</span>
              </div>
            </div>
            <button onClick={onLogout} className="btn-logout-3d">
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`hamburger-3d${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* 3D Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="mobile-menu-3d"
              initial={{ x: '100%', rotateY: -15 }}
              animate={{ x: 0, rotateY: 0 }}
              exit={{ x: '100%', rotateY: -15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ perspective: 1200 }}
            >
              <div className="mobile-menu-inner">
                <div className="mobile-user-block">
                  <div className="user-avatar-3d large">
                    {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="mobile-user-name">{user?.fullName || user?.username}</span>
                  <span className="mobile-user-inst">{user?.instituteName}</span>
                </div>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className={`mobile-nav-link${location.pathname === link.to ? ' active' : ''}`}
                    >
                      <span className="mobile-link-icon">{link.icon}</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.button
                  className="btn-logout-mobile"
                  onClick={onLogout}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .navbar-3d {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          box-shadow: 0 4px 30px rgba(0,0,0,0.4);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .navbar-brand-3d {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          text-decoration: none;
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .brand-vidya { color: var(--text-primary); }
        .brand-plus { color: var(--accent-blue); font-weight: 900; }
        .trial-chip {
          font-size: 0.6rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--r-full);
          background: rgba(245,158,11,0.15);
          color: var(--accent-amber);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-left: 0.5rem;
        }
        .navbar-links {
          display: flex;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-link-3d {
          position: relative;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: var(--r-md);
          transition: color 0.2s ease, background 0.2s ease;
          display: block;
        }
        .nav-link-3d:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
        .nav-link-3d.active { color: var(--accent-blue); }
        .nav-active-indicator {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: var(--accent-blue);
          border-radius: var(--r-full);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }
        .navbar-user-3d {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .user-avatar-3d {
          width: 34px;
          height: 34px;
          border-radius: var(--r-full);
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          color: white;
          flex-shrink: 0;
        }
        .user-avatar-3d.large { width: 48px; height: 48px; font-size: 1.2rem; }
        .user-meta { display: flex; flex-direction: column; line-height: 1.2; }
        .user-name-3d { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
        .user-inst-3d { font-size: 0.72rem; color: var(--text-tertiary); }
        .btn-logout-3d {
          background: rgba(244,63,94,0.1);
          border: 1px solid rgba(244,63,94,0.2);
          color: #fca5a5;
          padding: 0.4rem 0.9rem;
          border-radius: var(--r-md);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.2s ease;
        }
        .btn-logout-3d:hover {
          background: rgba(244,63,94,0.2);
          border-color: rgba(244,63,94,0.4);
        }
        .hamburger-3d {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          z-index: 200;
        }
        .hamburger-3d span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hamburger-3d.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger-3d.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger-3d.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 140;
        }

        /* Mobile Menu */
        .mobile-menu-3d {
          position: fixed;
          top: 0;
          right: 0;
          width: min(320px, 85vw);
          height: 100vh;
          background: var(--bg-secondary);
          border-left: 1px solid rgba(255,255,255,0.08);
          z-index: 150;
          transform-origin: right center;
          overflow-y: auto;
        }
        .mobile-menu-inner {
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mobile-user-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 1.5rem 0;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .mobile-user-name { font-weight: 600; font-size: 1.1rem; color: var(--text-primary); }
        .mobile-user-inst { font-size: 0.85rem; color: var(--text-tertiary); }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text-secondary);
          padding: 0.85rem 1rem;
          border-radius: var(--r-md);
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: rgba(79,124,255,0.08);
          color: var(--accent-blue);
        }
        .mobile-link-icon { font-size: 1.1rem; opacity: 0.6; }
        .btn-logout-mobile {
          margin-top: 1.5rem;
          padding: 0.75rem;
          background: rgba(244,63,94,0.1);
          border: 1px solid rgba(244,63,94,0.2);
          color: #fca5a5;
          border-radius: var(--r-md);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.2s ease;
        }
        .btn-logout-mobile:hover { background: rgba(244,63,94,0.2); }

        @media (max-width: 860px) {
          .navbar-links, .navbar-right { display: none; }
          .hamburger-3d { display: flex; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
