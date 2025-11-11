
'use client';

import { useState, useEffect } from 'react';

export default function FullScreenTest() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const enterFullScreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  if (!isFullScreen) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        margin: '20px 0'
      }}>
        <h3>Full Screen Test</h3>
        <p>This test requires full screen mode for security.</p>
        <button
          onClick={enterFullScreen}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Start Test in Full Screen
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a, #2d1b69)',
      color: 'white',
      padding: '40px',
      overflow: 'auto',
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '30px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Decades Training Test</h1>
          <button
            onClick={exitFullScreen}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Exit Full Screen
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Test Content Would Appear Here</h2>
          <p style={{ fontSize: '16px', opacity: 0.8 }}>
            This is where the actual test questions and interface would be displayed.
            The full screen mode prevents looking up answers during the test.
          </p>
        </div>
      </div>
    </div>
  );
}
