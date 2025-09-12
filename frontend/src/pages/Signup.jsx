import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('signup-page');
    return () => document.body.classList.remove('signup-page');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert('Passwords do not match');
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/signup', { email, password });
      if (response.data.success) {
        navigate('/login', { state: { username: email.split('@')[0] } }); // Use email prefix as username
      } else {
        alert('Signup failed. Email may already exist.');
      }
    } catch (err) {
      console.error(err);
      alert('Signup error. Check your input or server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="signup-header">
        <h1>CYBER QUEST</h1>
        <Link to="/" className="btn secondary home-btn">Home</Link>
      </header>

      <div className="signup-form">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={isLoading}
            aria-label="Email address"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isLoading}
            aria-label="Password"
          />

          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Password"
            required
            disabled={isLoading}
            aria-label="Confirm Password"
          />

          <button
            type="submit"
            disabled={isLoading}
            aria-label={isLoading ? 'Signing up…' : 'Sign Up'}
          >
            {isLoading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>

        <p>
          Already have an account?{' '}
          <Link to="/login" aria-label="Go to login page">Login</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;