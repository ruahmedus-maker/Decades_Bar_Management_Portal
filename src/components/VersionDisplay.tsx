'use client';

import { useEffect, useState } from 'react';
import { getBuildInfo } from '@/lib/build-info';
import { useApp } from '@/contexts/AppContext';

function ResetTourButton() {
  const { currentUser } = useApp();
  
  const handleReset = () => {
    if (!currentUser) return;
    const tourKey = `decades_tour_v4_seen_${currentUser.email}`;
    localStorage.removeItem(tourKey);
    // Reload to trigger the useEffect in GuidedTour
    window.location.reload();
  };

  return (
    <button 
      onClick={handleReset}
      style={{
        marginTop: '8px',
        padding: '6px 10px',
        background: '#FFD700',
        color: '#1a365d',
        border: 'none',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}
    >
      Restart Guided Tour
    </button>
  );
}

export default function VersionDisplay() {
  const [info, setInfo] = useState({ current: '', stored: '', time: '' });
  const { currentUser } = useApp();
  
  useEffect(() => {
    const buildInfo = getBuildInfo();
    const storedBuild = localStorage.getItem('app-build');
    
    // Auto-sync build info in background
    if (storedBuild !== buildInfo.id) {
      localStorage.setItem('app-build', buildInfo.id);
      localStorage.setItem('app-build-time', buildInfo.time);
    }
    
    setInfo({
      current: buildInfo.id,
      stored: buildInfo.id,
      time: new Date(buildInfo.time).toLocaleTimeString()
    });
  }, []);

  return null;
}