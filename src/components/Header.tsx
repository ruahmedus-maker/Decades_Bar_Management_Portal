'use client';

import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { currentUser, logout } = useApp();

  return (
    <div className="header">
      <h2 id="page-title">Welcome to the Decades Bar Resource Center</h2>
      <div className="user-info">
        <div id="user-display">
          <div className="avatar">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span id="user-display-name">
            {currentUser?.name} ({currentUser?.position})
          </span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}