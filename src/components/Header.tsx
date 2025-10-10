'use client';

import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { currentUser, logout } = useApp();

  return (
    <div className="header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    }}>
      <h2 style={{ 
        color: '#1a365d', 
        fontSize: '1.8rem', 
        margin: 0,
        fontWeight: '600'
      }}>
        Welcome to the Decades Bar Resource Center
      </h2>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #1a365d, #2d3748)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <span style={{ 
          fontWeight: '600',
          color: '#2d3748',
          fontSize: '1rem'
        }}>
          {currentUser?.name} ({currentUser?.position})
        </span>
        
        <button 
          onClick={logout}
          style={{
            background: 'none',
            border: '2px solid #d4af37',
            color: '#d4af37',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d4af37';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d4af37';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}