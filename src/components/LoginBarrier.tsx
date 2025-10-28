'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { validatePasswordStrength, initializeTestUsers } from '@/lib/auth';

// Tropical Teal/Blue color scheme to match sidebar
const SIDEBAR_COLOR = '#2DD4BF'; // Tropical teal
const SIDEBAR_COLOR_RGB = '45, 212, 191';
const SIDEBAR_COLOR_DARK = '#0D9488'; // Darker teal

// Test credentials
const TEST_CREDENTIALS = [
  { email: 'bartender@decadesbar.com', password: 'password123', role: 'Bartender' },
  { email: 'trainee@decadesbar.com', password: 'password123', role: 'Trainee' },
  { email: 'admin@decadesbar.com', password: 'admin123', role: 'Admin' }
];

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

  // Initialize test users on component mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initializeTestUsers();
    }
  }, []);

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

  // Quick login for test credentials
  const handleQuickLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Simplified form data update with proper password validation
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };
      
      // Validate password strength and matching
      if (field === 'password' || field === 'confirmPassword') {
        validatePasswords(newFormData.password, newFormData.confirmPassword);
      }
      
      return newFormData;
    });
  };

  // FIXED: Separate function to validate passwords with current state
  const validatePasswords = (password: string, confirmPassword: string) => {
    if (!password && !confirmPassword) {
      setPasswordStrength('');
      return;
    }

    // Check password strength first
    const strengthError = validatePasswordStrength(password);
    if (strengthError) {
      setPasswordStrength(strengthError);
      return;
    }

    // Then check if passwords match
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordStrength('Passwords do not match');
      return;
    }

    // If we get here, passwords are strong and match
    if (password && confirmPassword && password === confirmPassword) {
      setPasswordStrength('Strong password');
    } else if (password && !confirmPassword) {
      setPasswordStrength('Strong password - confirm your password');
    } else {
      setPasswordStrength('');
    }
  };

  // PERFORMANCE OPTIMIZED Style objects
  const loginBarrierStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(26, 54, 93, 0.4)', // Slightly more opaque to compensate for reduced blur
    // REDUCED BLUR: from 8px to 3px
    backdropFilter: 'blur(3px) saturate(140%)',
    WebkitBackdropFilter: 'blur(3px) saturate(140%)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    // Performance optimization
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)',
  };

  const loginContainerStyle = {
    background: 'rgba(255, 255, 255, 0.2)', // More opaque to compensate for reduced blur
    // REDUCED BLUR: from 12px to 6px
    backdropFilter: 'blur(6px) saturate(160%)',
    WebkitBackdropFilter: 'blur(6px) saturate(160%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: `
      0 20px 60px rgba(0, 0, 0, 0.3),
      0 8px 32px rgba(45, 212, 191, 0.1)
    `,
    textAlign: 'center' as const,
    maxWidth: '450px',
    width: '100%',
    // Performance optimization
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)',
  };

  const loginHeaderStyle = {
    marginBottom: '30px',
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: '10px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '1rem',
    margin: 0,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    marginBottom: '25px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  };

  const inputStyle = {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.15)', // More opaque background
    color: '#ffffff',
    fontSize: '1rem',
    // REDUCED BLUR: from 8px to 2px or remove
    backdropFilter: 'blur(2px)',
    transition: 'all 0.3s ease',
    outline: 'none',
    // Performance optimization
    transform: 'translateZ(0)',
  };

  const inputHoverStyle = {
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.2)',
  };

  const inputFocusStyle = {
    border: `1px solid ${SIDEBAR_COLOR}`,
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: `0 0 0 2px rgba(${SIDEBAR_COLOR_RGB}, 0.2)`,
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const loginButtonStyle = {
    background: `linear-gradient(135deg, ${SIDEBAR_COLOR}, ${SIDEBAR_COLOR_DARK})`,
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 15px rgba(${SIDEBAR_COLOR_RGB}, 0.3)`,
    // REDUCED BLUR: from 8px to 2px
    backdropFilter: 'blur(2px)',
    // Performance optimization
    transform: 'translateZ(0)',
  };

  const loginButtonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px rgba(${SIDEBAR_COLOR_RGB}, 0.4)`,
    background: `linear-gradient(135deg, ${SIDEBAR_COLOR_DARK}, ${SIDEBAR_COLOR})`,
  };

  const toggleButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: SIDEBAR_COLOR,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'underline',
    transition: 'all 0.3s ease',
    transform: 'translateZ(0)',
  };

  const toggleButtonHoverStyle = {
    color: '#ffffff',
  };

  const testButtonStyle = {
    background: 'rgba(255, 255, 255, 0.15)', // More opaque
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    // REDUCED BLUR: from 8px to 2px
    backdropFilter: 'blur(2px)',
    width: '100%',
    transform: 'translateZ(0)',
  };

  const testButtonHoverStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-1px)',
  };

  const passwordStrengthStyle = {
    fontSize: '0.8rem',
    padding: '4px 8px',
    borderRadius: '4px',
    marginTop: '4px',
  };

  const getPasswordStrengthColor = (strength: string) => {
    if (strength.includes('Strong')) return { background: 'rgba(56, 161, 105, 0.2)', color: '#48bb78' };
    if (strength.includes('match')) return { background: 'rgba(229, 62, 62, 0.2)', color: '#fc8181' };
    return { background: 'rgba(214, 158, 46, 0.2)', color: '#f6e05e' };
  };

  return (
    <div id="login-barrier" style={loginBarrierStyle}>
      <div style={loginContainerStyle}>
        <div style={loginHeaderStyle}>
          <h2 style={titleStyle}>🔐 Decades Bar Training</h2>
          <p style={subtitleStyle}>Please log in to access the training materials</p>
        </div>

        {/* Test Credentials Section - Only show in development */}
        {process.env.NODE_ENV === 'development' && !isRegistering && (
          <div style={{ marginBottom: '25px' }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '15px',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <p style={{ 
                margin: '0 0 10px 0', 
                fontSize: '0.9rem', 
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600
              }}>
                🚀 TEST CREDENTIALS
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TEST_CREDENTIALS.map((cred, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickLogin(cred.email, cred.password)}
                    disabled={isLoading}
                    style={testButtonStyle}
                    onMouseEnter={(e) => !isLoading && Object.assign(e.currentTarget.style, testButtonHoverStyle)}
                    onMouseLeave={(e) => !isLoading && Object.assign(e.currentTarget.style, testButtonStyle)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{cred.role}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        opacity: 0.7,
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {cred.email}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLogin} style={formStyle}>
            <div style={formGroupStyle}>
              <input
                type="email"
                placeholder="your.email@domain.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, inputHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>
            <div style={formGroupStyle}>
              <input
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, inputHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              style={loginButtonStyle}
              onMouseEnter={(e) => !isLoading && Object.assign(e.currentTarget.style, loginButtonHoverStyle)}
              onMouseLeave={(e) => !isLoading && Object.assign(e.currentTarget.style, loginButtonStyle)}
            >
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={formStyle}>
            <div style={formGroupStyle}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, inputHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>
            <div style={formGroupStyle}>
              <input
                type="email"
                placeholder="your.email@decadesbar.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, inputHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>
            <div style={formGroupStyle}>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, inputHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
              {passwordStrength && (
                <div style={{ ...passwordStrengthStyle, ...getPasswordStrengthColor(passwordStrength) }}>
                  {passwordStrength}
                </div>
              )}
            </div>
            <div style={formGroupStyle}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, inputHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>
            <div style={formGroupStyle}>
              <select
                value={formData.position}
                onChange={(e) => updateFormData('position', e.target.value)}
                disabled={isLoading}
                style={selectStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, { ...selectStyle, ...inputHoverStyle })}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, selectStyle)}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...selectStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, selectStyle)}
              >
                <option value="Bartender">Bartender</option>
                <option value="Admin">Admin (Code Required)</option>
                <option value="Trainee">Trainee</option>
              </select>
            </div>
            <div style={formGroupStyle}>
              <input
                type="password"
                placeholder="Registration Code"
                value={formData.code}
                onChange={(e) => updateFormData('code', e.target.value)}
                required
                disabled={isLoading}
                style={inputStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, inputHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              style={loginButtonStyle}
              onMouseEnter={(e) => !isLoading && Object.assign(e.currentTarget.style, loginButtonHoverStyle)}
              onMouseLeave={(e) => !isLoading && Object.assign(e.currentTarget.style, loginButtonStyle)}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center' as const }}>
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={isLoading}
            style={toggleButtonStyle}
            onMouseEnter={(e) => !isLoading && Object.assign(e.currentTarget.style, toggleButtonHoverStyle)}
            onMouseLeave={(e) => !isLoading && Object.assign(e.currentTarget.style, toggleButtonStyle)}
          >
            {isRegistering ? 'Back to Login' : 'Need an account? Register here'}
          </button>
        </div>

        {/* Development info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginTop: '20px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '0.75rem', 
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center'
            }}>
              🔧 Development Mode - Test credentials available above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}