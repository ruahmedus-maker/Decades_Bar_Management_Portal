'use client';

import { useEffect, useState } from 'react';

export default function SafariLoader() {
  const [isSafari, setIsSafari] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect Safari
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(safari);

    if (safari) {
      // Force Safari to render by using a timeout
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!isSafari || !isLoading) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a365d 0%, #2d4bf 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      color: 'white',
      fontSize: '18px',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>🎭 Bar Manager</h2>
        <p>Loading Management System...</p>
      </div>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}