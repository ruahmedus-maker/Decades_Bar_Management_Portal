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
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
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

  // Cinematic Gold Text Effect
  const goldTextStyle = {
    background: 'linear-gradient(180deg, #FFF7CC 0%, #FFD700 50%, #B8860B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0px 2px 0px rgba(0,0,0,0.5))',
  };

  const titleStyle = {
    ...goldTextStyle,
    fontSize: '2rem',
    fontFamily: 'var(--font-outfit), sans-serif',
    fontWeight: 200, // Extra thin geometric look
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '4px', // Wider spacing for premium look
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
    ...goldTextStyle,
    fontFamily: 'var(--font-outfit), sans-serif',
    fontWeight: 600,
    fontSize: '0.95rem',
    letterSpacing: '1px',
  };
  const logoutButtonStyle = {
    ...goldTextStyle,
    fontFamily: 'var(--font-outfit), sans-serif',
    background: 'rgba(212, 175, 55, 0.1)',
    border: `1px solid ${THEME_COLOR}`,
    padding: '8px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
  };

  const logoutButtonHoverStyle = {
    background: THEME_COLOR, // Gold Background
    WebkitTextFillColor: 'black', // Black text on hover
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