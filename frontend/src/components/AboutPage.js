import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import ScrollReveal from './ui/ScrollReveal';
import './AboutPage.css';

function AboutPage() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="about-3d">
      <nav className="about-nav-3d glass-strong">
        <div className="about-nav-inner">
          <div className="about-logo" onClick={() => navigate('/')} style={{cursor:'pointer'}}>
            <span className="brand-vidya" style={{fontWeight:700}}>Vidhya</span>
            <span className="brand-plus" style={{fontWeight:900}}>+</span>
          </div>
          <motion.button className="btn-ghost-3d" onClick={() => navigate('/')} whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
            ← Back to Home
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section className="about-hero-3d">
        <div className="about-hero-orb" /><div className="about-hero-orb-2" />
        <ScrollReveal direction="rotateX">
          <div className="about-hero-content">
            <h1>About <span className="text-gradient">Vidhya+</span></h1>
            <p className="about-tagline-3d">Built with passion. Designed for impact.</p>
          </div>
        </ScrollReveal>
      </section>

      {/* Story */}
      <section className="about-section-3d">
        <ScrollReveal direction="up">
          <div className="about-section-inner">
            <span className="section-eyebrow-3d">The Story</span>
            <h2>The Story Behind Vidhya+</h2>
            <p>Every great product starts with a problem. In 2024, while visiting my local neighborhood, I noticed something that stayed with me — dedicated tutors spending hours managing attendance registers, fee notebooks, and manually calling parents.</p>
            <p>These passionate educators were losing precious time on paperwork — time they could spend teaching. That's when the idea of Vidhya+ was born. My mission was simple: <strong>Give tutors back their time.</strong></p>
          </div>
        </ScrollReveal>
      </section>

      {/* Developer */}
      <section className="about-section-3d">
        <div className="dev-grid-3d">
          <ScrollReveal direction="left">
            <div className="dev-photo-3d card-3d" style={{textAlign:'center'}}>
              <div className="dev-avatar-3d">R</div>
              <h3>Roshan</h3>
              <p>Full Stack Developer</p>
              <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',marginTop:'1rem'}}>
                {['Email', 'LinkedIn', 'GitHub'].map(s => (
                  <motion.button key={s} className="btn-social-3d" whileHover={{scale:1.05,y:-2}} whileTap={{scale:0.95}}>{s}</motion.button>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div>
              <h2 className="about-section-title">Meet the Developer</h2>
              <p className="about-text">Hi! I'm Roshan, a passionate full-stack developer who believes technology should empower people, not complicate their lives. Vidhya+ isn't just another project — it's personal. Growing up in India, I've seen the impact good tutors have on students' lives.</p>
              <div className="skills-grid-3d">
                {[
                  { label: 'Frontend', desc: 'React.js, JavaScript, CSS3', color: 'var(--accent-blue)' },
                  { label: 'Backend', desc: 'Node.js, Express.js, REST APIs', color: 'var(--accent-violet)' },
                  { label: 'Database', desc: 'MongoDB, MySQL', color: 'var(--accent-cyan)' },
                  { label: 'Design', desc: 'UI/UX, Responsive', color: 'var(--accent-amber)' },
                ].map(skill => (
                  <motion.div key={skill.label} className="skill-card-3d card-3d" whileHover={{y:-4,transition:{duration:0.25}}}> 
                    <div className="skill-dot" style={{background:skill.color}} />
                    <div><strong style={{color:'var(--text-white)'}}>{skill.label}</strong><p>{skill.desc}</p></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Vision */}
      <section className="about-section-3d">
        <ScrollReveal direction="rotateX">
          <div className="about-section-inner" style={{textAlign:'center'}}>
            <span className="section-eyebrow-3d">Vision & Mission</span>
            <h2 style={{marginBottom:'2rem'}}>What drives us</h2>
            <div className="vision-grid-3d">
              {[
                { emoji: '🎯', title: 'Mission', desc: 'To empower every tuition teacher in India with affordable, easy-to-use technology.' },
                { emoji: '🚀', title: 'Vision', desc: 'A future where no teacher wastes time on paperwork. Technology serves education.' },
                { emoji: '💡', title: 'Values', desc: 'Simplicity over complexity. Real feedback over assumptions. Impact over profit.' },
              ].map(v => (
                <motion.div key={v.title} className="vision-card-3d card-3d" whileHover={{y:-6,rotateX:2,transition:{duration:0.3}}} style={{perspective:1200}}>
                  <div style={{fontSize:'2rem',marginBottom:'0.75rem'}}>{v.emoji}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="about-section-3d" style={{textAlign:'center',paddingBottom:'4rem'}}>
        <ScrollReveal direction="up">
          <div className="about-cta-3d card-3d" style={{maxWidth:'500px',margin:'0 auto',padding:'3rem 2rem'}}>
            <h2>Ready to Transform Your Tuition?</h2>
            <p style={{color:'var(--text-secondary)',marginBottom:'1.5rem'}}>Join hundreds of tutors who've simplified their work.</p>
            <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
              <motion.button onClick={() => navigate('/register')} className="btn-primary" whileHover={{scale:1.03}} whileTap={{scale:0.97}}>Get Started Free</motion.button>
              <motion.button onClick={() => navigate('/')} className="btn-ghost-3d" whileHover={{scale:1.02}} whileTap={{scale:0.98}}>Back to Home</motion.button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="about-footer-3d">
        <p>&copy; 2026 Vidhya+. Built with care by Roshan. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutPage;