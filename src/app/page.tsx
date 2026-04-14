import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import LoginBarrier from '@/components/LoginBarrier';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SectionRouter from '@/components/SectionRouter';
import Toast from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ENABLE_TESTS } from '@/lib/test-utils';
import FullScreenTest from '@/components/FullScreenTest';
import SafariLoader from '@/components/SafariLoader'; 
import GuidedTour from '@/components/GuidedTour';

function LoadingFallback() {
  const { forceReset } = useApp();
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowEmergency(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SafariLoader />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(26, 54, 93, 0.9)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '300px' }}>
          <h3 style={{ fontWeight: 300, letterSpacing: '2px', marginBottom: '20px' }}>INITIALIZING SYSTEM...</h3>
          <div className="loader-ring"></div>
          
          {showEmergency && (
            <div style={{ marginTop: '40px', animation: 'fadeIn 0.5s ease' }}>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '15px' }}>
                Taking longer than expected? There might be a connection or cache issue.
              </p>
              <button 
                onClick={forceReset}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  letterSpacing: '1px'
                }}
              >
                EMERGENCY RESET
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .loader-ring {
          width: 50px;
          height: 50px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top: 2px solid #D4AF37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}

function MainApp() {
  const { currentUser, isLoading, toast, hideToast } = useApp();

  // Check if we should show only the test
  const shouldShowOnlyTest = ENABLE_TESTS && currentUser &&
    (currentUser.position === 'Bartender' || currentUser.position === 'Trainee');


  if (isLoading) {
    return (
      <LoadingFallback />
    );
  }

  if (!currentUser) {
    return (
      <>
        <SafariLoader />
        <LoginBarrier />
        <Toast
          message={toast.message}
          show={toast.show}
          onHide={hideToast}
        />
      </>
    );
  }

  // Show full-screen test for bartenders/trainees when tests are enabled
  if (shouldShowOnlyTest) {
    return (
      <>
        <SafariLoader />
        <FullScreenTest />
        <Toast
          message={toast.message}
          show={toast.show}
          onHide={hideToast}
        />
      </>
    );
  }

  // Normal app layout for admins or when tests are disabled
  return (
    <>
      <SafariLoader />
      <ErrorBoundary>
        <GuidedTour />
      </ErrorBoundary>
      <div className="container">
        <Header />
        <Sidebar />
        <div className="main-content glass-panel" style={{ '--ui-bg': 'rgba(26, 54, 93, 0.4)' } as React.CSSProperties}>
          <div className="content-wrapper">
            <ErrorBoundary>
              <SectionRouter />
            </ErrorBoundary>
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        show={toast.show}
        onHide={hideToast}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}