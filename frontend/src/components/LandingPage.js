import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <h2>
              <span className="logo-vidya">Vidhya</span>
              <span className="logo-plus">+</span>
            </h2>
            <p className="logo-tagline">Knowledge. Enhanced.</p>
          </div>
          <div className="nav-buttons">
            <button onClick={() => navigate('/login')} className="btn-nav-login">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="btn-nav-register">
              Register Institute
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>विद्या + Excellence</span>
          </div>
          <h1 className="hero-title">
  Manage Your Tuition Center with <span className="highlight">Vidhya+</span>
</h1>
<p className="hero-subtitle">
  Complete solution for tutors and coaching centers. Manage students, track attendance, 
  collect fees, and send automated parent notifications. Built by a teacher, for teachers.
</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/register')} className="btn-get-started">
              Get Started Free
            </button>
            <button onClick={() => navigate('/login')} className="btn-login-hero">
              Login to Dashboard
            </button>
          </div>
          <div className="hero-features">
            <div className="feature-badge">
              <span className="badge-icon">✅</span>
              <span>30 Days Free Trial</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">🚀</span>
              <span>5 Minute Setup</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">💯</span>
              <span>100% Free to Start</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop" 
            alt="Happy students studying" 
          />
          <div className="image-overlay">
            {/* <div className="overlay-stat">
              <h3>500+</h3>
              <p>Happy Tutors</p>
            </div>
            <div className="overlay-stat">
              <h3>10K+</h3>
              <p>Students</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything You Need to Run Your Tuition</h2>
          <p>Powerful features designed specifically for Indian tuition centers</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🎓</div>
            <h3>Student Management</h3>
            <p>Add, edit, and organize students by class (1st to 12th) and board (CBSE, ICSE, State). Keep all student information in one place.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Attendance Tracking</h3>
            <p>Mark daily attendance with one click. View attendance history, generate reports, and track student presence easily.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>SMS Notifications</h3>
            <p>Automatic SMS/WhatsApp alerts to parents when students are absent. Keep parents informed instantly and effortlessly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Fee Management</h3>
            <p>Track monthly fees, payment status, pending amounts, and generate professional receipts. Never miss a payment again.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Dashboard & Reports</h3>
            <p>Get instant overview of your tuition with beautiful dashboard. Generate detailed reports for attendance and fees.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is secure with authentication and role-based access. Bank-grade security for your peace of mind.</p>
          </div>
        </div>
      </section>

      {/* Happy Students Section */}
      <section className="students-section">
        <div className="section-header">
          <h2>Join Thousands of Happy Students & Teachers</h2>
          <p>See what makes Vidhya+ the best choice for tuition management</p>
        </div>

        <div className="students-gallery">
          <div className="student-photo">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop" 
              alt="Students studying together" 
            />
            <div className="photo-caption">Collaborative Learning</div>
          </div>

          <div className="student-photo">
            <img 
              src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop" 
              alt="Student studying" 
            />
            <div className="photo-caption">Focused Education</div>
          </div>

          <div className="student-photo">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop" 
              alt="Happy students" 
            />
            <div className="photo-caption">Happy Learning</div>
          </div>

          <div className="student-photo">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" 
              alt="Students working together" 
            />
            <div className="photo-caption">Team Success</div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Tuition Centers</p>
          </div>
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Students Managed</p>
          </div>
          <div className="stat-item">
            <h3>99.9%</h3>
            <p>Uptime</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Available</p>
          </div>
        </div>
      </section>

      {/* Why Choose Vidhya+ */}
      <section className="why-section">
        <div className="section-header">
          <h2>Why Choose Vidhya+?</h2>
          <p>The perfect blend of tradition and technology</p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-number">01</div>
            <h3>Made for Indian Tutors</h3>
            <p>Designed specifically for Indian tuition centers with CBSE, ICSE, and State Board support. Understands your needs.</p>
          </div>

          <div className="why-card">
            <div className="why-number">02</div>
            <h3>Simple & Intuitive</h3>
            <p>No technical knowledge required. If you can use WhatsApp, you can use Vidhya+. Setup in just 5 minutes.</p>
          </div>

          <div className="why-card">
            <div className="why-number">03</div>
            <h3>Affordable Pricing</h3>
            <p>Start completely free. Pay only if you want premium features. No hidden costs. Cancel anytime.</p>
          </div>

          <div className="why-card">
            <div className="why-number">04</div>
            <h3>Reliable Support</h3>
            <p>Get help whenever you need it. Our team understands the challenges tutors face and is here to help.</p>
          </div>
        </div>
      </section>

      {/* About Developer Section */}
      {/* <section className="developer-section">
        <div className="section-header">
          <h2>Meet the Developer</h2>
          <p>Built with passion and expertise</p>
        </div>

        <div className="developer-content">
          <div className="developer-image">
            <div className="avatar">
              <span className="avatar-text">👨‍💻</span>
            </div>
          </div>

          <div className="developer-info">
            <h3>Roshan - Full Stack Developer</h3>
            <p className="developer-title">Creator of Vidhya+</p>
            
            <p className="developer-bio">
              Hi! I'm Roshan, a passionate full-stack developer who believes in using technology 
              to solve real-world problems. Vidhya+ was born from witnessing the challenges my 
              local tutors faced in managing their classes manually.
            </p>

            <p className="developer-bio">
              My mission is simple: empower educators with tools that let them focus on what they 
              do best - teaching. Every feature in Vidhya+ is designed with real tutors' feedback 
              and needs in mind.
            </p>

            <div className="developer-skills">
              <span className="skill-tag">React.js</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">MongoDB</span>
              <span className="skill-tag">Express.js</span>
              <span className="skill-tag">Full Stack Development</span>
              <span className="skill-tag">UI/UX Design</span>
            </div>

            <div className="developer-mission">
              <h4>💡 Vision</h4>
              <p>
                To make quality tuition management accessible to every teacher in India, 
                regardless of their technical expertise or budget. Education should be about 
                teaching, not paperwork.
              </p>
            </div>

            <div className="developer-stats">
              <div className="dev-stat">
                <h4>3+</h4>
                <p>Years Experience</p>
              </div>
              <div className="dev-stat">
                <h4>10+</h4>
                <p>Projects Built</p>
              </div>
              <div className="dev-stat">
                <h4>500+</h4>
                <p>Happy Users</p>
              </div>
            </div>

            <div className="developer-contact">
              <h4>📬 Let's Connect</h4>
              <p>Have questions or suggestions? I'd love to hear from you!</p>
              <div className="contact-buttons">
                <button className="btn-contact">📧 Email</button>
                <button className="btn-contact">💼 LinkedIn</button>
                <button className="btn-contact">🐙 GitHub</button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Teachers Say</h2>
          <p>Real feedback from real tutors using Vidhya+</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Vidhya+ has completely transformed how I manage my tuition. The attendance 
              tracking and automatic parent notifications save me hours every week!"
            </p>
            <div className="testimonial-author">
              <strong>Mrs. Sharma</strong>
              <span>Mathematics Tutor, Delhi</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Simple, effective, and exactly what I needed. No complicated features, 
              just practical tools that actually help. Highly recommended!"
            </p>
            <div className="testimonial-author">
              <strong>Mr. Patel</strong>
              <span>Science Classes, Mumbai</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The fee management feature is fantastic. Parents love getting automatic 
              receipts, and I love not having to maintain manual registers anymore."
            </p>
            <div className="testimonial-author">
              <strong>Ms. Verma</strong>
              <span>English Coaching, Bangalore</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Tuition Management?</h2>
          <p>Join hundreds of tutors who've simplified their work with Vidhya+</p>
          <p className="cta-subtext">✨ Start your free 30-day trial today. No credit card required. ✨</p>
          <button onClick={() => navigate('/register')} className="btn-cta">
            Get Started Now - It's Free! 🚀
          </button>
          <p className="cta-note">Takes less than 5 minutes to set up</p>
        </div>
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
            <p>Complete solution for managing your tuition center efficiently and professionally.</p>
          </div>

          <div className="footer-section">
  <h4>Quick Links</h4>
  <ul>
    <li><a href="#features">Features</a></li>
    <li><a href="#students">Gallery</a></li>
    <li><a onClick={() => navigate('/about')} style={{cursor: 'pointer'}}>About Us</a></li>
    <li><a onClick={() => navigate('/login')} style={{cursor: 'pointer'}}>Login</a></li>
    <li><a onClick={() => navigate('/register')} style={{cursor: 'pointer'}}>Register</a></li>
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
    &copy; 2024 Vidhya+. Built with ❤️ by <span onClick={() => navigate('/about')} style={{color: '#ffd700', cursor: 'pointer', textDecoration: 'underline'}}>Roshan</span>. All rights reserved.
  </p>
  <p className="footer-tagline-small">विद्या + Excellence = Vidhya+</p>
</div>
      </footer>
    </div>
  );
}

export default LandingPage;