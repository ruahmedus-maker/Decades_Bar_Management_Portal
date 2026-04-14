'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { validatePasswordStrength, APPROVED_CODES, ADMIN_CODES } from '@/lib/supabase-auth';
import { goldTextStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit } from '@/lib/brand-styles';

// Gold theme matching Sidebar
const THEME_COLOR = '#D4AF37';
const THEME_COLOR_RGB = '212, 175, 55';
const THEME_COLOR_DARK = '#B8860B';

// Test credentials
const TEST_CREDENTIALS = [
  { email: 'bartender@decadesbar.com', password: 'password123', role: 'Bartender' },
  { email: 'trainee@decadesbar.com', password: 'password123', role: 'Trainee' },
  { email: 'admin@decadesbar.com', password: 'admin123', role: 'Admin' }
];

export default function LoginBarrier() {
  const { login, register, forceReset } = useApp();
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

  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagResults, setDiagResults] = useState<{
    status: 'idle' | 'running' | 'done';
    reachable?: boolean;
    canQuery?: boolean;
    latency?: number;
    error?: string;
  }>({ status: 'idle' });

  const runDiagnostics = async () => {
    setDiagResults({ status: 'running' });
    const { checkSupabaseReachability } = await import('@/lib/supabase-auth');
    const result = await checkSupabaseReachability();
    setDiagResults({ status: 'done', ...result, error: result.error || undefined });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout. Please refresh your browser and try again.")), 20000));
      await Promise.race([login(formData.email, formData.password), timeout]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Login failed';
      alert(msg);
      if (msg.includes('timeout')) setShowDiagnostics(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate registration code before attempting registration
      if (!APPROVED_CODES.includes(formData.code as any)) {
        throw new Error('Invalid registration code. Please contact your manager.');
      }

      // Admin registration safeguards
      if (formData.position === 'Admin' && !ADMIN_CODES.includes(formData.code as any)) {
        throw new Error('Administrative positions require manager authorization codes.');
      }

      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout. Please refresh your browser.")), 20000));
      await Promise.race([register(formData), timeout]);
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
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout. Please refresh your browser to clear caches.")), 20000));
      await Promise.race([login(email, password), timeout]);
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
    background: uiBackground,
    backdropFilter: uiBackdropFilter,
    WebkitBackdropFilter: uiBackdropFilterWebkit,
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)',
  };

  const loginContainerStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px) saturate(180%)',
    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: `
      0 30px 60px rgba(0, 0, 0, 0.5),
      0 8px 32px rgba(${THEME_COLOR_RGB}, 0.1)
    `,
    textAlign: 'center' as const,
    maxWidth: '500px',
    width: '90%',
    margin: '0 auto',
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)',
  };

  const loginHeaderStyle = {
    marginBottom: '30px',
  };

  const titleStyle = {
    background: 'linear-gradient(180deg, #FFF7CC 0%, #FFD700 50%, #B8860B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0px 2px 0px rgba(0,0,0,0.5))',
    fontSize: '2.4rem',
    fontFamily: 'var(--font-outfit), sans-serif',
    fontWeight: 200,
    marginBottom: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '4px',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-outfit), sans-serif',
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
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
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontSize: '1rem',
    backdropFilter: 'blur(2px)',
    transition: 'none', // Removed - caused scroll crashes
    outline: 'none',
    transform: 'translateZ(0)',
  };

  const inputHoverStyle = {
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.2)',
  };

  const inputFocusStyle = {
    border: `1px solid ${THEME_COLOR}`,
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: `0 0 0 2px rgba(${THEME_COLOR_RGB}, 0.2)`,
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const loginButtonStyle = {
    background: `linear-gradient(135deg, ${THEME_COLOR}, ${THEME_COLOR_DARK})`,
    color: 'black',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: 700,
    fontFamily: 'var(--font-outfit), sans-serif',
    fontSize: '1rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    boxShadow: `0 10px 30px rgba(${THEME_COLOR_RGB}, 0.3)`,
    transition: 'all 0.3s ease',
  };

  const loginButtonHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: `0 15px 40px rgba(${THEME_COLOR_RGB}, 0.4)`,
    filter: 'brightness(1.1)',
  };

  const toggleButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: THEME_COLOR,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-outfit), sans-serif',
    fontWeight: 500,
    textDecoration: 'none',
    letterSpacing: '1px',
  };

  const toggleButtonHoverStyle = {
    color: '#ffffff',
    textDecoration: 'underline',
  };

  const testButtonStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'none', // Removed - caused scroll crashes
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
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔐</div>
          <h2 style={titleStyle}>Decades Bar</h2>
          <p style={{ ...subtitleStyle, ...goldTextStyle }}>Management System</p>
        </div>

        {/* Test Credentials Section */}
        {!isRegistering && (
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
                🚀 QUICK ACCESS CREDENTIALS
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

        {/* Quick Access Info */}
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
            🔧 Quick access credentials available above
          </p>
        </div>
        {/* Troubleshooting and Reset */}
        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
            Connection issues?
          </p>
          <button 
            onClick={forceReset}
            style={toggleButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = THEME_COLOR;
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            TROUBLESHOOT & RESET APP
          </button>

          {/* Diagnostic Link */}
          <button 
            onClick={() => { setShowDiagnostics(true); runDiagnostics(); }}
            style={{ ...toggleButtonStyle, marginTop: '10px', display: 'block', width: '100%', fontSize: '0.75rem', opacity: 0.6 }}
          >
            RUN NETWORK DIAGNOSTICS
          </button>
        </div>

        {/* Diagnostic Overlay */}
        {showDiagnostics && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#1a365d',
              padding: '30px',
              borderRadius: '20px',
              maxWidth: '400px',
              width: '100%',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: THEME_COLOR }}>CONNECTION DIAGNOSTICS</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Network Reachable:</span>
                  <span style={{ color: diagResults.reachable ? '#48bb78' : '#fc8181' }}>
                    {diagResults.status === 'running' ? 'Checking...' : (diagResults.reachable ? '✅ YES' : '❌ NO')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Supabase Query:</span>
                  <span style={{ color: diagResults.canQuery ? '#48bb78' : '#fc8181' }}>
                    {diagResults.status === 'running' ? 'Checking...' : (diagResults.canQuery ? '✅ OK' : '❌ FAILED')}
                  </span>
                </div>
                {diagResults.latency && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Latency:</span>
                    <span style={{ color: diagResults.latency < 500 ? '#48bb78' : '#ecc94b' }}>
                      {diagResults.latency}ms
                    </span>
                  </div>
                )}
                {diagResults.error && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '10px', 
                    background: 'rgba(252, 129, 129, 0.1)', 
                    color: '#fc8181', 
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    wordBreak: 'break-word'
                  }}>
                    <strong>Error:</strong> {diagResults.error}
                  </div>
                )}

                <div style={{ marginTop: '20px', fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.4' }}>
                  {!diagResults.reachable ? (
                    <p style={{ color: '#fc8181' }}>
                      ⚠️ Your network is blocking Supabase. Please disable any VPN, Firewall, or Ad-blockers and try again.
                    </p>
                  ) : diagResults.canQuery === false ? (
                    <p>⚠️ Connection exists but database requests are hanging. Try clearing your browser cache below.</p>
                  ) : diagResults.status === 'done' ? (
                    <p style={{ color: '#48bb78' }}>✅ All systems operative. If you still see timeouts, try the manual reset below.</p>
                  ) : null}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button 
                    onClick={() => { forceReset(); setShowDiagnostics(false); }}
                    style={{ ...loginButtonStyle, flex: 1, fontSize: '0.8rem', padding: '10px' }}
                  >
                    CLEAR & RESET
                  </button>
                  <button 
                    onClick={() => setShowDiagnostics(false)}
                    style={{ ...testButtonStyle, flex: 1, fontSize: '0.8rem', padding: '10px' }}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}