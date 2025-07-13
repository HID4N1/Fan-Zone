import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });

      // Save tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('isAdminAuth', true);

      if (remember) {
        localStorage.setItem('rememberAdmin', true);
      }

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      {/* Image Section */}
      <div className="image-section">
        <img src="/assets/images/login.jpg" alt="Eventify Background" className="auth-image" />
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Login</h2>
              <p>Enter your details to access your account</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <div className="form-errors">
                  <div className="alert alert-danger">
                    <strong>{error}</strong>
                  </div>
                </div>
              )}

              {/* Username */}
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="password-actions">
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
              </div>

              {/* Remember Me */}
              <div className="form-group remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn btn-primary">Login</button>
                <div className="register-link">
                  {/* Optional Register Link */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
