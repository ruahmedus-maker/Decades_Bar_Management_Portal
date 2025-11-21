'use client';

import { useEffect, useState } from 'react';
import { getBuildInfo } from '@/lib/build-info';

export default function VersionDisplay() {
  const [info, setInfo] = useState({ current: '', stored: '', time: '' });
  
  useEffect(() => {
    const buildInfo = getBuildInfo();
    const storedBuild = localStorage.getItem('app-build');
    const storedTime = localStorage.getItem('app-build-time');
    
    setInfo({
      current: buildInfo.id,
      stored: storedBuild || 'none',
      time: storedTime ? new Date(storedTime).toLocaleTimeString() : 'none'
    });
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
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