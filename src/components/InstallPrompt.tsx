'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(15, 35, 65, 0.95)',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '12px',
      border: '1px solid #2DD4BF',
      zIndex: 10000,
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)',
      maxWidth: '90%',
      width: '400px'
    }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📱 Install Decades Bar App</p>
      <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.8 }}>
        Add to your home screen for quick access!
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={installApp}
          style={{
            background: '#2DD4BF',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          style={{
            background: 'transparent',
            color: '#2DD4BF',
            border: '1px solid #2DD4BF',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Later
        </button>
      </div>
    </div>
  );
}