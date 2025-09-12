import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const knowledgeCards = [
  { id: 1, title: 'Strong Passwords', desc: 'Master creating 12+ character passwords.', icon: '🔐' },
  { id: 2, title: 'Phishing Detection', desc: 'Learn to spot fake emails in action.', icon: '🎣' },
  { id: 3, title: 'Data Privacy', desc: 'Control what you share online.', icon: '🔐' },
  { id: 4, title: 'Encryption Basics', desc: 'Decode secrets to secure data.', icon: '🔑' },
  { id: 5, title: 'Social Engineering', desc: 'Defend against manipulation tricks.', icon: '🧠' },
];

const featureCards = [
  { id: 1, title: 'Real-World Scenarios', desc: 'Face challenges like phishing emails.', icon: '🎯' },
  { id: 2, title: 'Instant Feedback', desc: 'Get tips after every move.', icon: '💡' },
  { id: 3, title: 'Jump-In Mode', desc: 'Start Cyber Defender Quest instantly.', icon: '🚀' },
  { id: 4, title: 'Progress Tracking', desc: 'Track points and unlock levels.', icon: '📈' },
];

const cyberConcepts = [
  { title: 'Confidentiality', summary: 'Protect sensitive data.', icon: '🛡️', detail: 'Learn to secure data with strong passwords and encryption in Cyber Defender Quest (Level 1 & 4).' },
  { title: 'Integrity', summary: 'Ensure data accuracy.', icon: '✅', detail: 'Understand data protection through phishing detection in Cyber Defender Quest (Level 2).' },
  { title: 'Availability', summary: 'Keep systems accessible.', icon: '⚡', detail: 'Explore system security basics via interactive levels in Cyber Defender Quest.' },
  { title: 'Authentication', summary: 'Verify your identity.', icon: '🔍', detail: 'Master authentication through password tasks in Cyber Defender Quest (Level 1).' },
  { title: 'Authorization', summary: 'Control access rights.', icon: '🚪', detail: 'Learn access control concepts through game scenarios.' },
  { title: 'Non-Repudiation', summary: 'Prove actions taken.', icon: '📋', detail: 'Understand evidence in digital transactions via Cyber Defender Quest (Level 5).' },
];

const threatTypes = [
  { name: 'Malware', description: 'Malicious software threats.', examples: ['Ransomware', 'Viruses'], icon: '🦠' },
  { name: 'Social Engineering', description: 'Tricks to steal info.', examples: ['Phishing emails', 'Baiting'], icon: '🎭' },
  { name: 'Network Attacks', description: 'Threats to networks.', examples: ['DDoS', 'Sniffing'], icon: '🌐' },
  { name: 'Physical Attacks', description: 'Physical security risks.', examples: ['Theft', 'USB drops'], icon: '🔓' },
];

const securityPrinciples = [
  { principle: 'Defense in Depth', description: 'Layered security approach.', details: 'Experience multiple defenses in Cyber Defender Quest levels.', icon: '🛡️' },
  { principle: 'Least Privilege', description: 'Minimum access needed.', details: 'Learn through Cyber Defender Quest access controls.', icon: '🔐' },
  { principle: 'Zero Trust', description: 'Verify everything.', details: 'Applied in Cyber Defender Quest Level 5 social engineering.', icon: '❌' },
  { principle: 'Security by Design', description: 'Built-in security.', details: 'See this in Cyber Defender Quest design principles.', icon: '🏗️' },
];

export default function Home() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      const el = carouselRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const next = scrollLeft >= scrollWidth - clientWidth ? 0 : scrollLeft + 290;
      el.scrollTo({ left: next, behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <header>
        <h1>CYBER QUEST</h1>
        <Link to="/login" className="btn secondary">Login</Link>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h2>Master Cyber-Safety with Cyber Quest</h2>
            <p>
              Every level of our Cyber Defender Quest teaches you to protect your digital life through fun, interactive challenges.
              Start with passwords, tackle phishing, and unlock advanced skills!
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">of breaches involve human error</span>
              </div>
              <div className="stat">
                <span className="stat-number">$4.45M</span>
                <span className="stat-label">average cost of a data breach</span>
              </div>
            </div>
          </div>
          <div className="hero-action">
            <Link to="/login" className="btn primary large">Play Cyber Defender Quest</Link>
            <p className="hero-subtext">Join now to learn!</p>
          </div>
        </div>
      </section>

      <section className="carousel-section">
        <h3 className="section-header">Skills You'll Master in Cyber Defender Quest</h3>
        <div className="carousel-container">
          <div className="carousel" ref={carouselRef}>
            {knowledgeCards.map(c => (
              <div className="carousel-card" key={c.id}>
                <span className="icon">{c.icon}</span>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <h3 className="section-header">Why Choose Cyber Defender Quest?</h3>
        <div className="features-grid">
          {featureCards.map(c => (
            <div className="feature-card" key={c.id}>
              <span className="icon">{c.icon}</span>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="learning-section">
        <div className="section-container">
          <h3 className="section-header">Cybersecurity Fundamentals</h3>
          <p className="section-subtitle">Essential concepts every digital citizen should understand</p>

          <div className="fundamentals-vertical">
            <div className="fundamentals-subsection">
              <h4 className="subheading">Core Concepts</h4>
              <div className="cards-horizontal">
                {cyberConcepts.map((item, idx) => (
                  <div key={`concept-${idx}`} className="fundamental-card">
                    <span className="icon">{item.icon}</span>
                    <h5>{item.title}</h5>
                    <p>{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fundamentals-subsection">
              <h4 className="subheading">Common Threats</h4>
              <div className="cards-horizontal">
                {threatTypes.map((t, idx) => (
                  <div key={`threat-${idx}`} className="threat-card">
                    <span className="icon">{t.icon}</span>
                    <h5>{t.name}</h5>
                    <p>{t.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fundamentals-subsection">
              <h4 className="subheading">Security Principles</h4>
              <div className="cards-horizontal">
                {securityPrinciples.map((p, idx) => (
                  <div key={`principle-${idx}`} className="principle-card">
                    <span className="icon">{p.icon}</span>
                    <h5>{p.principle}</h5>
                    <p>{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container cta-split">
          <div className="cta-text">
            <h3>Ready to Become a Cyber Defender?</h3>
            <p>Join others in mastering cybersecurity through Cyber Defender Quest.</p>
          </div>
          <div className="cta-actions">
            <Link to="/login" className="btn primary large">Start Cyber Defender Quest</Link>
            <Link to="/about" className="btn secondary">Learn More</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-content">
          <div className="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">X (Twitter)</a>
            <a href="mailto:xyz@aston.ac.uk">Contact Us</a>
            <Link to="/about">About Us</Link>
          </div>
          <p>© 2025 Cyber Defender Quest – Crafted for safer digital lives</p>
        </div>
      </footer>
    </>
  );
}