import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');          // "" | "sending" | "sent" | "error"

  useEffect(() => {
    document.body.classList.add('contact-page');
    return () => document.body.classList.remove('contact-page');
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await new Promise((r) => setTimeout(r, 1000)); // mock API
      console.log('Mock send:', form);
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(''), 3000);        // auto-hide banner
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <header className="contact-header">
        <h1>CYBER QUEST</h1>
        <Link to="/" className="btn secondary home-btn">Home</Link>
      </header>

      <main className="contact-main">
        <section className="contact-hero">
          <div className="section-container">
            <h2 className="contact-title">Contact Us</h2>
            <p className="contact-lead">
              Have questions, feedback, or partnership ideas? Drop us a message
              and we’ll get back to you ASAP.
            </p>
          </div>
        </section>

        <section className="contact-body">
          <div className="section-container contact-grid">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <div className="info-item">
                <span className="icon">📧</span>
                <a href="mailto:xyz@aston.ac.uk">xyz@aston.ac.uk</a>
              </div>
              <div className="info-item">
                <span className="icon">📍</span>
                <span>Aston University, Birmingham, UK</span>
              </div>
              <div className="info-item">
                <span className="icon">🕒</span>
                <span>Mon – Fri 09:00-17:00 (GMT)</span>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <input name="name" type="text" placeholder="Your Name" required
                     value={form.name} onChange={handleChange} />
              <input name="email" type="email" placeholder="Your Email" required
                     value={form.email} onChange={handleChange} />
              <input name="subject" type="text" placeholder="Subject" required
                     value={form.subject} onChange={handleChange} />
              <textarea name="message" rows="5" placeholder="Your Message" required
                        value={form.message} onChange={handleChange} />
              <button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              {status === 'sent' && (
                <p className="success-msg">Thanks! We’ll be in touch shortly.</p>
              )}
              {status === 'error' && (
                <p className="error-msg">Something went wrong – please try again.</p>
              )}
            </form>
          </div>
        </section>
      </main>

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