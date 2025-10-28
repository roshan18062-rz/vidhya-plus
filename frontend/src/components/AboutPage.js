import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';


function AboutPage() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Simple Navigation */}
      <nav className="about-nav">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate('/')}>
            <h2>
              <span style={{color: '#667eea', fontWeight: 700}}>Vidhya</span>
              <span style={{color: '#ffd700', fontWeight: 900}}>+</span>
            </h2>
          </div>
          <button onClick={() => navigate('/')} className="btn-back">
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Vidhya+</h1>
          <p className="about-tagline">Built with passion. Designed for impact.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="content-container">
          <h2>The Story Behind Vidhya+</h2>
          <div className="story-content">
            <p>
              Every great product starts with a problem. In 2024, while visiting my local 
              neighborhood, I noticed something that stayed with me - dedicated tutors spending 
              hours managing attendance registers, fee notebooks, and manually calling parents.
            </p>
            <p>
              These passionate educators were losing precious time on paperwork - time they could 
              spend teaching. That's when the idea of Vidhya+ was born.
            </p>
            <p>
              My mission was simple: <strong>Give tutors back their time.</strong> Let technology 
              handle the administrative burden so they can focus on what they do best - educating 
              the next generation.
            </p>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="developer-section-about">
        <div className="content-container">
          <div className="developer-grid">
            <div className="developer-photo">
              <div className="avatar-large">
                <span className="avatar-text">👨‍💻</span>
              </div>
              <div className="social-links">
                <button className="social-btn">
                  <span>📧</span> Email
                </button>
                <button className="social-btn">
                  <span>💼</span> LinkedIn
                </button>
                <button className="social-btn">
                  <span>🐙</span> GitHub
                </button>
              </div>
            </div>

            <div className="developer-details">
              <h2>Meet Roshan</h2>
              <p className="role">Full Stack Developer & Creator of Vidhya+</p>
              
              <div className="bio">
                <p>
                  Hi! I'm Roshan, a passionate full-stack developer who believes technology 
                  should empower people, not complicate their lives. With over 3 years of 
                  experience building web applications, I've always been drawn to projects 
                  that make a real difference.
                </p>
                <p>
                  Vidhya+ isn't just another project for me - it's personal. Growing up in India, 
                  I've seen the impact good tutors have on students' lives. They deserve tools that 
                  respect their time and enhance their work, not add to their burden.
                </p>
              </div>

              <div className="skills-section">
                <h3>Technical Expertise</h3>
                <div className="skills-grid">
                  <div className="skill-item">
                    <span className="skill-icon">⚛️</span>
                    <div>
                      <strong>Frontend</strong>
                      <p>React.js, JavaScript, HTML/CSS</p>
                    </div>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon">🔧</span>
                    <div>
                      <strong>Backend</strong>
                      <p>Node.js, Express.js, REST APIs</p>
                    </div>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon">🗄️</span>
                    <div>
                      <strong>Database</strong>
                      <p>MongoDB, MySQL</p>
                    </div>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon">🎨</span>
                    <div>
                      <strong>Design</strong>
                      <p>UI/UX, Responsive Design</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="achievements">
                <div className="achievement-item">
                  <h4>3+</h4>
                  <p>Years Experience</p>
                </div>
                <div className="achievement-item">
                  <h4>10+</h4>
                  <p>Projects Built</p>
                </div>
                <div className="achievement-item">
                  <h4>500+</h4>
                  <p>Happy Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-section">
        <div className="content-container">
          <div className="vision-grid">
            <div className="vision-card">
              <div className="vision-icon">🎯</div>
              <h3>Mission</h3>
              <p>
                To empower every tuition teacher in India with affordable, easy-to-use 
                technology that simplifies management and improves parent communication.
              </p>
            </div>

            <div className="vision-card">
              <div className="vision-icon">🚀</div>
              <h3>Vision</h3>
              <p>
                A future where no teacher wastes time on paperwork. Where technology serves 
                education, enabling tutors to focus 100% on teaching excellence.
              </p>
            </div>

            <div className="vision-card">
              <div className="vision-icon">💡</div>
              <h3>Values</h3>
              <p>
                Simplicity over complexity. User needs over fancy features. 
                Real feedback over assumptions. Impact over profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Solo Developer Section */}
      <section className="solo-dev-section">
        <div className="content-container">
          <h2>Why a Solo Developer is Good for You</h2>
          <p className="section-subtitle">
            Being a one-person team isn't a limitation - it's an advantage
          </p>

          <div className="advantages-grid">
            <div className="advantage-card">
              <span className="advantage-number">01</span>
              <h3>Direct Communication</h3>
              <p>
                Your feedback reaches me directly - no support tickets, no middlemen. 
                Suggest a feature today, see it implemented tomorrow.
              </p>
            </div>

            <div className="advantage-card">
              <span className="advantage-number">02</span>
              <h3>Built from Real Feedback</h3>
              <p>
                I personally talk to tutors, understand their pain points, and build 
                features that actually matter - not what a corporate board thinks is cool.
              </p>
            </div>

            <div className="advantage-card">
              <span className="advantage-number">03</span>
              <h3>Quick Bug Fixes</h3>
              <p>
                No bureaucracy, no approval chains. Found a bug? I can fix it the same day. 
                Try getting that from a big company!
              </p>
            </div>

            <div className="advantage-card">
              <span className="advantage-number">04</span>
              <h3>Personal Investment</h3>
              <p>
                This isn't just a job for me - it's my passion project. Your success with 
                Vidhya+ is my success. I'm genuinely invested in making this work for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack-section">
        <div className="content-container">
          <h2>Built with Modern Technology</h2>
          <p className="section-subtitle">
            Reliable, secure, and scalable architecture
          </p>

          <div className="tech-stack-grid">
            <div className="tech-card">
              <h4>Frontend</h4>
              <ul>
                <li>React.js - Modern UI framework</li>
                <li>JavaScript - No TypeScript complexity</li>
                <li>CSS3 - Beautiful, responsive design</li>
                <li>React Router - Smooth navigation</li>
              </ul>
            </div>

            <div className="tech-card">
              <h4>Backend</h4>
              <ul>
                <li>Node.js - Fast, scalable server</li>
                <li>Express.js - Robust API framework</li>
                <li>JWT - Secure authentication</li>
                <li>RESTful APIs - Industry standard</li>
              </ul>
            </div>

            <div className="tech-card">
              <h4>Database</h4>
              <ul>
                <li>MongoDB - Flexible NoSQL database</li>
                <li>Mongoose - Data modeling</li>
                <li>Cloud-ready - Easy deployment</li>
                <li>Secure - Bank-grade encryption</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="content-container">
          <h2>Let's Connect</h2>
          <p className="section-subtitle">
            Have questions, suggestions, or just want to say hi? I'd love to hear from you!
          </p>

          <div className="contact-grid">
            <div className="contact-card">
              <span className="contact-icon">📧</span>
              <h3>Email</h3>
              <p>Drop me an email anytime</p>
              <button className="contact-btn">roshan@vidhyaplus.com</button>
            </div>

            <div className="contact-card">
              <span className="contact-icon">💼</span>
              <h3>LinkedIn</h3>
              <p>Let's connect professionally</p>
              <button className="contact-btn">Connect on LinkedIn</button>
            </div>

            <div className="contact-card">
              <span className="contact-icon">💬</span>
              <h3>WhatsApp</h3>
              <p>Quick questions? WhatsApp me</p>
              <button className="contact-btn">Chat on WhatsApp</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Tuition?</h2>
          <p>Join hundreds of tutors who've simplified their work with Vidhya+</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/register')} className="btn-primary-cta">
              Get Started Free
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary-cta">
              Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>&copy; 2024 Vidhya+. Built with ❤️ by Roshan. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutPage;