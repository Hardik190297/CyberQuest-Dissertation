import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => document.body.classList.remove('login-page');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      if (response.data.success) {
        navigate('/play', { state: { username: response.data.username } }); // Pass username
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Check your credentials or server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="login-header">
        <h1>CYBER QUEST</h1>
        <Link to="/" className="btn secondary home-btn">Home</Link>
      </header>

      <div className="login-form">
        <h2>Login</h2>

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

          <button
            type="submit"
            disabled={isLoading}
            aria-label={isLoading ? 'Logging in…' : 'Login'}
          >
            {isLoading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p>
          Don't have an account?{' '}
          <Link to="/signup" aria-label="Go to sign up page">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;