'use client';

import { useEffect, useState } from 'react';

export default function VersionDisplay() {
  const [version, setVersion] = useState('');
  
  useEffect(() => {
    const buildId = process.env.NEXT_PUBLIC_BUILD_ID || `build-${Date.now()}`;
    const storedBuild = localStorage.getItem('app-build');
    setVersion(`Current: ${buildId} | Stored: ${storedBuild}`);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 10000,
    }}>
      {version}
    </div>
  );
}