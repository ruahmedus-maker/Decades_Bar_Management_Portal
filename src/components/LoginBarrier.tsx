'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { validatePasswordStrength } from '@/lib/auth';

export default function LoginBarrier() {
  const { login, register } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    position: 'Bartender' as 'Bartender' | 'Admin' | 'Trainee',
    code: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Update password strength
    if (field === 'password' || field === 'confirmPassword') {
      if (field === 'password') {
        const strength = validatePasswordStrength(value);
        setPasswordStrength(strength || 'Strong password');
      }
      
      if (formData.password && formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          setPasswordStrength('Passwords do not match');
        } else if (!validatePasswordStrength(formData.password)) {
          setPasswordStrength('Strong password');
        }
      }
    }
  };

  return (
    <div id="login-barrier">
      <div className="login-container">
        <div className="login-header">
          <h2>🔐 Decades Bar Training</h2>
          <p>Please log in to access the training materials</p>
        </div>

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="your.email@domain.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="your.email@decadesbar.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                disabled={isLoading}
              />
              {passwordStrength && (
                <div className={`password-strength ${
                  passwordStrength.includes('Strong') ? 'strong' : 
                  passwordStrength.includes('match') ? 'error' : 'warning'
                }`}>
                  {passwordStrength}
                </div>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <select
                value={formData.position}
                onChange={(e) => updateFormData('position', e.target.value)}
                disabled={isLoading}
              >
                <option value="Bartender">Bartender</option>
                <option value="Admin">Admin (Code Required)</option>
                <option value="Trainee">Trainee</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Registration Code"
                value={formData.code}
                onChange={(e) => updateFormData('code', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        <div className="login-toggle">
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={isLoading}
            className="btn-toggle"
          >
            {isRegistering ? 'Back to Login' : 'Need an account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
}