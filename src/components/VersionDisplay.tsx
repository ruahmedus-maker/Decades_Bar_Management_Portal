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

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(26, 54, 93, 0.95)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '11px',
      zIndex: 10000,
      maxWidth: '220px',
      fontFamily: 'var(--font-outfit), monospace',
      border: '1px solid rgba(255,215,0,0.3)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <div style={{ opacity: 0.8, marginBottom: '4px' }}>
        <strong>Build:</strong> {info.current}
      </div>
      <div style={{ opacity: 0.8, marginBottom: '6px' }}>
        <strong>Time:</strong> {info.time}
      </div>
      <div style={{ 
        color: '#4ADE80', 
        fontSize: '12px', 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%' }}></span>
        SYSTEM CURRENT
      </div>
      
      {currentUser && (
        <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
          <ResetTourButton />
        </div>
      )}
    </div>
  );
}