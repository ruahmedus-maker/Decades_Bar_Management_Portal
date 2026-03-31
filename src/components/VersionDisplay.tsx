'use client';

import { useEffect, useState } from 'react';
import { getBuildInfo } from '@/lib/build-info';

export default function VersionDisplay() {
  const [info, setInfo] = useState({ current: '', stored: '', time: '' });
  
  useEffect(() => {
    const buildInfo = getBuildInfo();
    const storedBuild = localStorage.getItem('app-build');
    const storedTime = localStorage.getItem('app-build-time');
    
    // Automatically sync if it's different (since we disabled auto-reloading PWA)
    if (storedBuild !== buildInfo.id) {
      localStorage.setItem('app-build', buildInfo.id);
      localStorage.setItem('app-build-time', buildInfo.time);
    }
    
    setInfo({
      current: buildInfo.id,
      stored: buildInfo.id, // Set to current immediately for the UI
      time: new Date(buildInfo.time).toLocaleTimeString()
    });
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',        // Changed from top to bottom
      left: '10px',          // Changed from right to left
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '5px',
      fontSize: '11px',
      zIndex: 10000,
      maxWidth: '200px',
      fontFamily: 'monospace',
    }}>
      <div><strong>Build:</strong> {info.current}</div>
      <div><strong>Stored:</strong> {info.stored}</div>
      <div><strong>Time:</strong> {info.time}</div>
      <div><strong>Status:</strong> {info.current === info.stored ? '✅ Current' : '🔄 Update Available'}</div>
    </div>
  );
}