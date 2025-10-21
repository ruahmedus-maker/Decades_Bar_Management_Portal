'use client';

import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { currentUser, logout } = useApp();

  return (
    <div className="header">
      {/* REMOVE all inline styles from this div - let CSS handle it */}
      <h2>
        Welcome to the Decades Bar Resource Center
      </h2>
      
      <div className="user-info">
        <div className="avatar">
          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <span className="user-display-name">
          {currentUser?.name} ({currentUser?.position})
        </span>
        
        <button 
          onClick={logout}
          className="btn-logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
}