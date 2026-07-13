import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import TiltCard from './ui/TiltCard';
import { motionTokens, springs } from '../lib/motion-tokens';
import './LandingPage.css';

// Signature element: an ink stamp. Reused on the hero register, the trial
// badge, and each testimonial — the one recurring motif of this design.
function InkStamp({ label, rotate = -8, tone = 'marigold' }) {
  return (
    <motion.span
      className={`ink-stamp ink-stamp--${tone}`}
      initial={{ opacity: 0, scale: 1.6, rotate: rotate - 20 }}
      whileInView={{ opacity: 0.92, scale: 1, rotate }}
      viewport={{ once: true }}
      transition={springs.snappy}
    >
      {label}
    </motion.span>
  );
}

// The hero's centerpiece: a small illustrated "today's register" page,
// standing in for the generic stock photo a template would reach for.
// Wrapped in TiltCard for a real perspective-tracking 3D tilt on hover.
function RegisterCard() {
  const rows = [
    { name: 'Aarav K.', mark: 'present' },
    { name: 'Diya P.', mark: 'present' },
    { name: 'Kabir S.', mark: 'absent' },
    { name: 'Meera R.', mark: 'present' },
    { name: 'Rehan A.', mark: 'present' },
  ];

  const rowVariants = {
    hidden: { opacity: 0, x: -motionTokens.distance.sm },
    visible: { opacity: 1, x: 0, transition: springs.gentle },
  };

  return (
    <TiltCard
      className="register-card"
      maxTilt={9}
      style={{ role: 'img' }}
    >
      <div
        role="img"
        aria-label="A sample attendance register showing five students, four marked present and one marked absent"
      >
        <div className="register-card__head">
          <span className="register-card__title">Today&apos;s Register</span>
          <span className="register-card__date">09 Jul</span>
        </div>
        <motion.div
          className="register-card__rows"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08, delayChildren: 0.5 }}
        >
          {rows.map((row) => (
            <motion.div className="register-row" key={row.name} variants={rowVariants}>
              <span className="register-row__name">{row.name}</span>
              {row.mark === 'present' ? (
                <svg className="register-row__tick" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M4 12.5 9.5 18 20 6" fill="none" stroke="var(--slate-green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="register-row__absent">absent</span>
              )}
            </motion.div>
          ))}
        </motion.div>
        <div className="register-card__stamp">
          <InkStamp label="4/5 present" rotate={-6} tone="green" />
        </div>
      </div>
    </TiltCard>
  );
}

// Shared scroll-reveal wrapper — whileInView + viewport once:true per
// motion-patterns rule 7 (repeating reveals distract, not inform).
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: motionTokens.distance.lg }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: motionTokens.distance.md },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
};

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <h2>
              <span className="logo-vidya">Vidhya</span>
              <span className="logo-plus">+</span>
            </h2>
            <p className="logo-tagline">विद्या + Excellence</p>
          </div>
          <div className="nav-buttons">
            <motion.button
              onClick={() => navigate('/login')}
              className="btn-nav-login"
              whileHover={{ scale: motionTokens.scale.pop }}
              whileTap={{ scale: motionTokens.scale.press }}
              transition={springs.snappy}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => navigate('/register')}
              className="btn-nav-register"
              whileHover={{ scale: motionTokens.scale.pop }}
              whileTap={{ scale: motionTokens.scale.press }}
              transition={springs.snappy}
            >
              Register Institute
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-eyebrow" variants={staggerItem}>
            <span className="hero-eyebrow__reg">Reg. No. VP&#8209;2026</span>
            <span className="hero-eyebrow__sep">·</span>
            <span>Built for tuition tutors</span>
          </motion.div>
          <motion.h1 className="hero-title" variants={staggerItem}>
            Run your tuition like a <span className="highlight">register</span>,
            not a chore.
          </motion.h1>
          <motion.p className="hero-subtitle" variants={staggerItem}>
            Vidhya+ replaces the attendance notebook, the fee ledger, and the
            "who's absent today?" phone calls — with one place to mark, track,
            and collect. Built by a tutor, for tutors.
          </motion.p>
          <motion.div className="hero-buttons" variants={staggerItem}>
            <motion.button
              onClick={() => navigate('/register')}
              className="btn-get-started"
              whileHover={{ scale: motionTokens.scale.pop, y: -2 }}
              whileTap={{ scale: motionTokens.scale.press }}
              transition={springs.snappy}
            >
              Start free — 30 days
            </motion.button>
            <motion.button
              onClick={() => navigate('/login')}
              className="btn-login-hero"
              whileHover={{ scale: motionTokens.scale.pop }}
              whileTap={{ scale: motionTokens.scale.press }}
              transition={springs.snappy}
            >
              Login to dashboard
            </motion.button>
          </motion.div>
          <motion.div className="hero-features" variants={staggerItem}>
            <div className="feature-badge">
              <span>30 days free trial</span>
            </div>
            <div className="feature-badge">
              <span>5 minute setup</span>
            </div>
            <div className="feature-badge">
              <span>No card required</span>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 2 }}
          transition={{ ...springs.gentle, delay: 0.25 }}
        >
          <RegisterCard />
        </motion.div>
      </section>

      {/* Features — presented as register entries, not floating icon cards */}
      <section className="features-section" id="features">
        <Reveal className="section-header">
          <span className="section-eyebrow">What's inside</span>
          <h2>Everything a paper register used to hold</h2>
          <p>Six entries. No modules to configure, no jargon to learn.</p>
        </Reveal>

        <motion.div
          className="register-list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {[
            { n: '01', title: 'Student Management', text: 'Add, edit, and organise students by class (1st–12th) and board (CBSE, ICSE, State). One place for every record.' },
            { n: '02', title: 'Attendance Tracking', text: 'Mark daily attendance in one tap. View history, spot patterns, generate reports without a calculator.' },
            { n: '03', title: 'SMS Notifications', text: 'Parents get an alert the moment a student is marked absent — no more end-of-day phone calls.' },
            { n: '04', title: 'Fee Management', text: 'Track monthly dues, payment status, and pending amounts. Generate a receipt in one click.' },
            { n: '05', title: 'Dashboard & Reports', text: 'A single glance tells you today\'s attendance and this month\'s collection — no register-flipping.' },
            { n: '06', title: 'Secure & Private', text: 'Role-based access and encrypted storage. Your students\' data stays yours.' },
          ].map((f) => (
            <motion.div className="register-list__row" key={f.n} variants={staggerItem}>
              <span className="register-list__num">{f.n}</span>
              <div className="register-list__body">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* By the numbers — replaces the old stock-photo gallery */}
      <section className="stats-section">
        <motion.div
          className="stats-inner"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { n: '500+', l: 'Tuition centres' },
            { n: '10,000+', l: 'Students managed' },
            { n: '99.9%', l: 'Uptime' },
            { n: '24/7', l: 'Available' },
          ].map((s) => (
            <motion.div className="stat-item" key={s.l} variants={staggerItem}>
              <h3>{s.n}</h3>
              <p>{s.l}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why choose */}
      <section className="why-section">
        <Reveal className="section-header">
          <span className="section-eyebrow section-eyebrow--light">Why Vidhya+</span>
          <h2>The perfect blend of tradition and technology</h2>
          <p>Four reasons tutors switch, in no particular order.</p>
        </Reveal>

        <motion.div
          className="why-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {[
            { title: 'Made for Indian tutors', text: 'CBSE, ICSE, and State Board support built in from day one — because that\'s who this was built for.' },
            { title: 'Simple & intuitive', text: 'No technical knowledge required. If you can use WhatsApp, you can use Vidhya+.' },
            { title: 'Affordable pricing', text: 'Start completely free. Pay only for premium features, cancel anytime, no hidden costs.' },
            { title: 'Reliable support', text: 'Real answers from people who understand the day-to-day of running a tuition centre.' },
          ].map((w) => (
            <motion.div key={w.title} variants={staggerItem}>
              <TiltCard className="why-card" maxTilt={6}>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <Reveal className="section-header">
          <span className="section-eyebrow">What teachers say</span>
          <h2>Real feedback from real tutors</h2>
        </Reveal>

        <motion.div
          className="testimonials-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {[
            { text: "Vidhya+ has completely transformed how I manage my tuition. Attendance and parent notifications save me hours every week.", name: 'Mrs. Sharma', role: 'Mathematics Tutor, Delhi' },
            { text: "Simple, effective, exactly what I needed. No complicated features — just practical tools that actually help.", name: 'Mr. Patel', role: 'Science Classes, Mumbai' },
            { text: "The fee management feature is fantastic. Parents get automatic receipts, and I don't touch a paper register anymore.", name: 'Ms. Verma', role: 'English Coaching, Bangalore' },
          ].map((t) => (
            <motion.div key={t.name} variants={staggerItem}>
              <TiltCard className="testimonial-card" maxTilt={7}>
                <InkStamp label="Verified tutor" rotate={-5} tone="ink" />
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <Reveal className="cta-content">
          <h2>Ready to close the register for good?</h2>
          <p>Join tutors who've traded the notebook for a dashboard.</p>
          <motion.button
            onClick={() => navigate('/register')}
            className="btn-cta"
            whileHover={{ scale: motionTokens.scale.pop, y: -2 }}
            whileTap={{ scale: motionTokens.scale.press }}
            transition={springs.snappy}
          >
            Get started — it&apos;s free
          </motion.button>
          <p className="cta-note">Takes less than 5 minutes to set up</p>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <span className="logo-vidya">Vidhya</span>
              <span className="logo-plus">+</span>
            </h3>
            <p className="footer-tagline">Knowledge. Enhanced.</p>
            <p>Complete solution for managing your tuition centre efficiently and professionally.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><button className="footer-link-btn" onClick={() => navigate('/about')}>About Us</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('/login')}>Login</button></li>
              <li><button className="footer-link-btn" onClick={() => navigate('/register')}>Register</button></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Student Management</li>
              <li>Attendance Tracking</li>
              <li>Fee Management</li>
              <li>SMS Notifications</li>
              <li>Dashboard & Reports</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>Documentation</li>
              <li>FAQ</li>
              <li>Contact Support</li>
              <li>Video Tutorials</li>
              <li>WhatsApp Support</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2026 Vidhya+. Built with care by <span onClick={() => navigate('/about')} style={{color: '#E2992C', cursor: 'pointer', textDecoration: 'underline'}}>Roshan</span>. All rights reserved.
          </p>
          <p className="footer-tagline-small">विद्या + Excellence = Vidhya+</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
