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
      <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        width: '90%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0',
            color: '#1a1a1a',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            🔐 Decades Bar Training
          </h2>
          <p style={{ 
            margin: 0,
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Please log in to access the training materials
          </p>
        </div>

        {!isRegistering ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <input
                type="email"
                placeholder="your.email@domain.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#d4af37',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="your.email@decadesbar.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
              {passwordStrength && (
                <div style={{
                  fontSize: '0.8rem',
                  marginTop: '0.25rem',
                  color: passwordStrength.includes('Strong') ? 'green' : 
                         passwordStrength.includes('match') ? 'red' : 'orange'
                }}>
                  {passwordStrength}
                </div>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <select
                value={formData.position}
                onChange={(e) => updateFormData('position', e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                }}
              >
                <option value="Bartender">Bartender</option>
                <option value="Admin">Admin (Code Required)</option>
                <option value="Trainee">Trainee</option>
              </select>
            </div>
            <div>
              <input
                type="password"
                placeholder="Registration Code"
                value={formData.code}
                onChange={(e) => updateFormData('code', e.target.value)}
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#d4af37',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#d4af37',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textDecoration: 'underline',
            }}
          >
            {isRegistering ? 'Back to Login' : 'Need an account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
}

