'use client';

import { useApp } from '@/contexts/AppContext';
import NotificationCenter from './NotificationCenter';

// Gold theme to match Sidebar
const THEME_COLOR = '#D4AF37';
const THEME_COLOR_RGB = '212, 175, 55';

export default function Header() {
  const { currentUser, logout } = useApp();

  const headerStyle = {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    right: '0',
    height: '80px',
    zIndex: 999,
    padding: '0 30px',
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 32px rgba(${THEME_COLOR_RGB}, 0.1)
    `,
    borderRadius: '0 0 20px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    color: THEME_COLOR, // Gold Title
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)', // Added shadow for contrast
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
    background: `linear-gradient(135deg, ${THEME_COLOR}, #B8860B)`, // Gold gradient
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black', // Black text on gold is readable
    fontWeight: 'bold',
    fontSize: '1.1rem',
    boxShadow: `0 4px 10px rgba(${THEME_COLOR_RGB}, 0.3)`,
  };

  const userNameStyle = {
    color: THEME_COLOR, // Gold Name
    fontWeight: 600,
    fontSize: '1rem',
  };

  const logoutButtonStyle = {
    background: 'transparent',
    border: `1px solid ${THEME_COLOR}`, // Gold Border
    color: THEME_COLOR, // Gold Text
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'none',
  };

  const logoutButtonHoverStyle = {
    background: THEME_COLOR, // Gold Background
    color: 'black', // Black text on hover
  };

  return (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        Decades Bar Management System
      </h2>

      <div style={userInfoStyle}>
        {/* Only render for admins/managers */}
        <NotificationCenter />

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
    </div>
  );
}