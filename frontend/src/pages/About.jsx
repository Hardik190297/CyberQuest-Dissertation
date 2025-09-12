import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  useEffect(() => {
    document.body.classList.add('about-page');
    return () => document.body.classList.remove('about-page');
  }, []);

  return (
    <>
      {/* =====  SAME HEADER AS HOME / LOGIN  ===== */}
      <header className="about-header">
        <h1>CYBER QUEST</h1>
        <Link to="/" className="btn secondary home-btn">Home</Link>
      </header>

      {/* =====  PAGE CONTENT  ===== */}
      <main className="about-main">
        <section className="about-hero">
          <div className="section-container">
            <h2 className="about-title">About Us</h2>
            <p className="about-lead">
              Cyber Quest was born from a simple belief: cybersecurity education should be
              engaging, accessible, and fun for everyone. Our gamified platform turns complex
              security concepts into interactive challenges that anyone can master.
            </p>
          </div>
        </section>

        <section className="about-mission">
          <div className="section-container">
            <h3 className="section-header">Our Mission</h3>
            <p className="section-subtitle">
              Empower every digital citizen with the knowledge and skills to protect themselves
              online through immersive, real-world scenarios.
            </p>
            <div className="about-grid">
              <div className="about-card">
                <span className="icon">🎯</span>
                <h4>Accessible Learning</h4>
                <p>No jargon, no gate-keeping – just clear, practical cyber-safety skills.</p>
              </div>
              <div className="about-card">
                <span className="icon">🚀</span>
                <h4>Gamified Experience</h4>
                <p>Levels, points, badges – learn while you play, play while you learn.</p>
              </div>
              <div className="about-card">
                <span className="icon">🛡️</span>
                <h4>Real-World Impact</h4>
                <p>Every challenge mirrors actual threats you’ll face online.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-team">
          <div className="section-container">
            <h3 className="section-header">Meet the Team</h3>
            <p className="section-subtitle">
              A small group of security engineers, educators and designers passionate about safer digital lives.
            </p>
            <div className="about-grid">
              <div className="about-card">
                <span className="icon">👩‍💻</span>
                <h4>Engineering</h4>
                <p>Security-first developers who build and break systems for a living.</p>
              </div>
              <div className="about-card">
                <span className="icon">🎨</span>
                <h4>Design & UX</h4>
                <p>Making complex topics feel simple and delightful to interact with.</p>
              </div>
              <div className="about-card">
                <span className="icon">📚</span>
                <h4>Education</h4>
                <p>Teachers and curriculum experts who know how people actually learn.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-contact">
          <div className="section-container">
            <h3 className="section-header">Get in Touch</h3>
            <p className="section-subtitle">
              Questions, feedback, partnership ideas? We’d love to hear from you.
            </p>
            <div className="about-actions">
              <a href="mailto:contact@cyberquest.app" className="btn primary large">Email Us</a>
              <a href="https://twitter.com/CyberQuestApp" target="_blank" rel="noopener noreferrer" className="btn secondary">Twitter</a>
            </div>
          </div>
        </section>
      </main>

      {/* =====  SAME FOOTER AS HOME  ===== */}
      <footer>
        <div className="footer-content">
          <div className="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href="mailto:contact@coderunner.app">Contact Us</a>
            <Link to="/about">About Us</Link>
          </div>
          <p>© 2025 Cyber Defender Quest – Crafted for safer digital lives</p>
        </div>
      </footer>
    </>
  );
};

export default About;