import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaMusic, FaCheck, FaTimes } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const badWords = ['fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'hell', 'bastard', 'dick', 'pussy', 'cock', 'slut', 'whore', 'nigger', 'nigga', 'fag', 'retard'];

  const containsProfanity = (text) => {
    const lowerText = text.toLowerCase();
    return badWords.some(word => lowerText.includes(word));
  };

  const checkPasswordStrength = () => {
    const password = formData.password;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return {
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      isLongEnough,
      isStrong: hasUpperCase && hasLowerCase && hasNumber && isLongEnough
    };
  };

  const passwordStrength = checkPasswordStrength();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Username validation
    if (formData.username.length < 3 || formData.username.length > 20) {
      setError('Username must be between 3-20 characters');
      return;
    }

    if (containsProfanity(formData.username)) {
      setError('Username contains inappropriate language');
      return;
    }

    // Display name validation
    const displayName = formData.displayName || formData.username;
    if (displayName.length > 20) {
      setError('Display name must be 20 characters or less');
      return;
    }

    if (containsProfanity(displayName)) {
      setError('Display name contains inappropriate language');
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordStrength.isStrong) {
      setError('Password must be at least 8 characters and contain uppercase, lowercase, and a number');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.username,
      formData.password,
      displayName
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaMusic className="auth-logo" />
          <h1>Join BriTunes</h1>
          <p>Create your account to start streaming</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username (3-20 characters)"
              maxLength={20}
              required
            />
            <small style={{ color: '#888', fontSize: '12px' }}>No inappropriate language allowed</small>
          </div>

          <div className="input-group">
            <label>Display Name (Optional)</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="How should we call you?"
              maxLength={20}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            {formData.password && (
              <div style={{ marginTop: '8px', fontSize: '13px' }}>
                <div style={{ color: passwordStrength.isLongEnough ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {passwordStrength.isLongEnough ? <FaCheck /> : <FaTimes />} At least 8 characters
                </div>
                <div style={{ color: passwordStrength.hasUpperCase ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {passwordStrength.hasUpperCase ? <FaCheck /> : <FaTimes />} One uppercase letter
                </div>
                <div style={{ color: passwordStrength.hasLowerCase ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {passwordStrength.hasLowerCase ? <FaCheck /> : <FaTimes />} One lowercase letter
                </div>
                <div style={{ color: passwordStrength.hasNumber ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {passwordStrength.hasNumber ? <FaCheck /> : <FaTimes />} One number
                </div>
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
