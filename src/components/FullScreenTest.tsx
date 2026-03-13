
'use client';

import { useState, useEffect } from 'react';
import TestsSection from './sections/TestsSection';
import { useApp } from '@/contexts/AppContext';
import { 
  premiumWhiteStyle, 
  brandFont, 
  sectionHeaderStyle, 
  goldTextStyle,
  uiBackground,
  uiBackdropFilter,
  uiBackdropFilterWebkit
} from '@/lib/brand-styles';

export default function FullScreenTest() {
  const { logout, currentUser } = useApp();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Check for bypass flag in URL for testing
    const shouldBypass = typeof window !== 'undefined' && window.location.search.includes('bypassFullscreen=true');
    if (shouldBypass) {
      setIsFullScreen(true);
    }

    const handleFullScreenChange = () => {
      if (!shouldBypass) {
        setIsFullScreen(!!document.fullscreenElement);
      }
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

  if (!isFullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#0B1120', // Deepest Aloha blue
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          background: uiBackground,
          backdropFilter: uiBackdropFilter,
          WebkitBackdropFilter: uiBackdropFilterWebkit,
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧪</div>
          <h2 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, marginBottom: '15px' }}>
            SECURE EVALUATION MODE
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px', lineHeight: '1.6' }}>
            This assessment requires Full Screen mode. 
            Navigation to other sections is restricted during the exam to ensure integrity.
          </p>
          <button
            onClick={enterFullScreen}
            style={{
              width: '100%',
              padding: '16px',
              background: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '1px',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            START SECURE EXAM
          </button>
          
          <button 
            onClick={logout}
            style={{
              marginTop: '20px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Exit and Log Out
          </button>
        </div>
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
      background: '#0B1120',
      color: 'white',
      overflow: 'auto',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Locked Down Top Bar */}
      <div style={{
        padding: '20px 40px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: '#EF4444', 
            boxShadow: '0 0 10px #EF4444' 
          }} />
          <h1 style={{ ...goldTextStyle, margin: 0, fontSize: '1.2rem', fontFamily: brandFont, fontWeight: 700, letterSpacing: '4px' }}>
            SECURE EXAMINATION
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.6, letterSpacing: '2px' }}>CANDIDATE</div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser?.name}</div>
        </div>
      </div>

      <div style={{
        flex: 1,
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 20px',
      }}>
        <TestsSection standalone={true} />
      </div>
      
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontSize: '0.7rem',
        opacity: 0.3,
        letterSpacing: '1px'
      }}>
        DECADES BAR MANAGEMENT SYSTEM • SECURE GATEWAY v2.0
      </div>
    </div>
  );
}
