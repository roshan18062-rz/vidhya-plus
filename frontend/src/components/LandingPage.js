import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import ScrollReveal from './ui/ScrollReveal';
import AnimatedCounter from './ui/AnimatedCounter';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-3d">
      {/* Floating Nav */}
      <nav className="landing-nav-3d glass-strong">
        <div className="landing-nav-inner">
          <div className="landing-logo" onClick={() => navigate('/')}>
            <span className="brand-vidya">Vidhya</span>
            <span className="brand-plus">+</span>
          </div>
          <div className="landing-nav-actions">
            <motion.button onClick={() => navigate('/login')} className="btn-ghost-3d" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Login
            </motion.button>
            <motion.button onClick={() => navigate('/register')} className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Register Institute
            </motion.button>
          </div>
        </div>
      </nav>

      {/* HERO — 3D floating elements */}
      <section className="hero-3d">
        <div className="hero-3d-orbs">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="hero-3d-inner">
          <motion.div
            className="hero-3d-content"
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200 }}
          >
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Built for Indian tuition tutors
            </div>
            <h1 className="hero-3d-title">
              Manage your tuition
              <span className="text-gradient"> like never before</span>
            </h1>
            <p className="hero-3d-sub">
              Attendance, fees, parent notifications — all in one beautiful dashboard.
              No more paper registers. No more missed calls.
            </p>
            <div className="hero-3d-cta">
              <motion.button onClick={() => navigate('/register')} className="btn-primary btn-hero" whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }}>
                Start Free — 30 Days
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{marginLeft: '0.5rem'}}><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </motion.button>
              <motion.button onClick={() => navigate('/login')} className="btn-ghost-3d" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Login to Dashboard
              </motion.button>
            </div>
            <div className="hero-chips">
              {['30 days free', '5 min setup', 'No card needed'].map(chip => (
                <span key={chip} className="hero-chip">{chip}</span>
              ))}
            </div>
          </motion.div>

          {/* 3D Floating Dashboard Preview */}
          <motion.div
            className="hero-3d-visual"
            initial={{ opacity: 0, scale: 0.85, rotateY: -12 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200 }}
          >
            <div className="hero-card-stack">
              <div className="hero-float-card fc-1 glass">
                <div className="fc-icon" style={{color: 'var(--accent-blue)'}}>■</div>
                <div><div className="fc-label">Total Students</div><div className="fc-value">248</div></div>
              </div>
              <div className="hero-float-card fc-2 glass">
                <div className="fc-icon" style={{color: 'var(--accent-cyan)'}}>■</div>
                <div><div className="fc-label">Today's Attendance</div><div className="fc-value">231 / 248</div></div>
              </div>
              <div className="hero-float-card fc-3 glass">
                <div className="fc-icon" style={{color: 'var(--accent-amber)'}}>■</div>
                <div><div className="fc-label">Fees Collected</div><div className="fc-value">₹1,24,500</div></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES — 3D rotateX scroll reveal */}
      <section className="features-3d" id="features">
        <ScrollReveal direction="rotateX">
          <div className="section-head">
            <span className="section-eyebrow-3d">What's inside</span>
            <h2>Everything your paper register did. <span className="text-gradient">Better.</span></h2>
            <p>Six powerful tools. Zero complexity.</p>
          </div>
        </ScrollReveal>

        <div className="features-grid-3d">
          {[
            { icon: '◈', title: 'Student Management', desc: 'Add, edit, and organise students by class and board. One place for every record.', color: 'var(--accent-blue)' },
            { icon: '◉', title: 'Attendance Tracking', desc: 'Mark daily attendance in one tap. View history, spot patterns, generate reports.', color: 'var(--accent-cyan)' },
            { icon: '☀', title: 'SMS Notifications', desc: 'Parents get an alert the moment a student is marked absent — no more phone calls.', color: 'var(--accent-amber)' },
            { icon: '◈', title: 'Fee Management', desc: 'Track monthly dues, payment status, and pending amounts. Generate receipts in one click.', color: 'var(--accent-violet)' },
            { icon: '◉', title: 'Dashboard & Reports', desc: 'A single glance tells you today\'s attendance and this month\'s collection.', color: 'var(--accent-rose)' },
            { icon: '☀', title: 'Secure & Private', desc: 'Role-based access and encrypted storage. Your students\' data stays yours.', color: 'var(--accent-cyan)' },
          ].map((f, i) => (
            <ScrollReveal key={f.title} direction={i % 2 === 0 ? 'rotateX' : 'rotateY'} delay={i * 0.08}>
              <motion.div
                className="feature-card-3d card-3d"
                whileHover={{ y: -8, rotateX: 2, rotateY: -2, transition: { duration: 0.3 } }}
                style={{ perspective: 1200 }}
              >
                <div className="feature-icon-3d" style={{ color: f.color, textShadow: `0 0 20px ${f.color}40` }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* STATS — counter animation */}
      <section className="stats-3d glass">
        <div className="stats-3d-inner">
          {[
            { n: 500, suffix: '+', l: 'Tuition Centres' },
            { n: 10000, suffix: '+', l: 'Students Managed' },
            { n: 99, suffix: '.9%', l: 'Uptime' },
            { n: 24, suffix: '/7', l: 'Available' },
          ].map((s, i) => (
            <ScrollReveal key={s.l} direction="up" delay={i * 0.1}>
              <div className="stat-block-3d">
                <h3><AnimatedCounter end={s.n} suffix={s.suffix} /></h3>
                <p>{s.l}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* WHY — 3D cards */}
      <section className="why-3d">
        <ScrollReveal direction="rotateX">
          <div className="section-head">
            <span className="section-eyebrow-3d">Why Vidhya+</span>
            <h2>Tradition meets <span className="text-gradient">technology</span></h2>
          </div>
        </ScrollReveal>
        <div className="why-grid-3d">
          {[
            { title: 'Made for Indian Tutors', desc: 'CBSE, ICSE, and State Board support built in from day one.' },
            { title: 'Simple & Intuitive', desc: 'No technical knowledge required. If you can use WhatsApp, you can use Vidhya+.' },
            { title: 'Affordable Pricing', desc: 'Start completely free. Pay only for premium features, cancel anytime.' },
            { title: 'Reliable Support', desc: 'Real answers from people who understand tuition centres.' },
          ].map((w, i) => (
            <ScrollReveal key={w.title} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.08}>
              <motion.div
                className="why-card-3d card-3d"
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3 } }}
              >
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-3d">
        <ScrollReveal direction="up">
          <div className="section-head">
            <span className="section-eyebrow-3d">Testimonials</span>
            <h2>Real feedback from <span className="text-gradient">real tutors</span></h2>
          </div>
        </ScrollReveal>
        <div className="testimonials-grid-3d">
          {[
            { text: 'Vidhya+ has completely transformed how I manage my tuition. Attendance and parent notifications save me hours every week.', name: 'Mrs. Sharma', role: 'Mathematics Tutor, Delhi' },
            { text: 'Simple, effective, exactly what I needed. No complicated features — just practical tools that actually help.', name: 'Mr. Patel', role: 'Science Classes, Mumbai' },
            { text: "The fee management feature is fantastic. Parents get automatic receipts, and I don't touch a paper register anymore.", name: 'Ms. Verma', role: 'English Coaching, Bangalore' },
          ].map((t, i) => (
            <ScrollReveal key={t.name} direction="rotateY" delay={i * 0.1}>
              <motion.div
                className="testimonial-card-3d card-3d"
                whileHover={{ y: -5, rotateY: 3, transition: { duration: 0.3 } }}
                style={{ perspective: 1200 }}
              >
                <p className="testimonial-quote">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author-3d">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-3d">
        <ScrollReveal direction="rotateX">
          <div className="cta-3d-inner">
            <h2>Ready to close the register for good?</h2>
            <p>Join tutors who've traded the notebook for a dashboard.</p>
            <motion.button onClick={() => navigate('/register')} className="btn-primary btn-hero" whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}>
              Get Started — It's Free
            </motion.button>
          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="footer-3d">
        <div className="footer-3d-inner">
          <div className="footer-col">
            <h3><span className="brand-vidya">Vidhya</span><span className="brand-plus">+</span></h3>
            <p>Complete tuition management solution for Indian tutors.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><button type="button" className="footer-link-btn" onClick={() => navigate('/about')}>About Us</button></li>
              <li><button type="button" className="footer-link-btn" onClick={() => navigate('/login')}>Login</button></li>
              <li><button type="button" className="footer-link-btn" onClick={() => navigate('/register')}>Register</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Features</h4>
            <ul><li>Student Management</li><li>Attendance Tracking</li><li>Fee Management</li><li>SMS Notifications</li></ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul><li>Documentation</li><li>FAQ</li><li>Contact Support</li><li>WhatsApp Support</li></ul>
          </div>
        </div>
        <div className="footer-3d-bottom">
          <p>&copy; 2026 Vidhya+. Built with care by <span style={{color:'var(--accent-blue)',cursor:'pointer'}} onClick={() => navigate('/about')}>Roshan</span>.</p>
          <p className="footer-sanskrit">विद्या + Excellence = Vidhya+</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;