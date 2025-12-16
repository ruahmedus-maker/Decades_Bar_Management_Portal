'use client';

import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { currentUser, logout } = useApp();

  const headerStyle = {
    position: 'fixed' as const,
    top: '0', // Changed to top of page
    left: '0', // Span full width from left
    right: '0', // Span full width to right
    height: '80px',
    zIndex: 90,
    padding: '0 30px',
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 32px rgba(45, 212, 191, 0.1)
    `,
    borderRadius: '0 0 20px 20px', // Rounded bottom corners only
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2DD4BF, #0D9488)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  };

  const userNameStyle = {
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '1rem',
  };

  const logoutButtonStyle = {
    background: 'transparent',
    border: '1px solid #2DD4BF',
    color: '#2DD4BF',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'none', // Removed - caused scroll crashes
  };

  const logoutButtonHoverStyle = {
    background: '#2DD4BF',
    color: 'white',
  };

  return (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        Decades Bar Management System
      </h2>

      <div style={userInfoStyle}>
        <div style={avatarStyle}>
          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        <span style={userNameStyle}>
          {currentUser?.name} ({currentUser?.position})
        </span>

        <button
          onClick={logout}
          style={logoutButtonStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, logoutButtonHoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, logoutButtonStyle);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}