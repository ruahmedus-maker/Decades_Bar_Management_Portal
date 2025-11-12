// page.tsx
'use client';

import { AppProvider, useApp } from '@/contexts/AppContext';
import LoginBarrier from '@/components/LoginBarrier';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SectionRouter from '@/components/SectionRouter';
import Toast from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary'; 
import { ENABLE_TESTS } from '@/lib/constants';
import FullScreenTest from '@/components/FullScreenTest';
import SafariLoader from '@/components/SafariLoader'; // Add this

function MainApp() {
  const { currentUser, isLoading, toast, hideToast } = useApp();

  console.log('MainApp - Current User:', currentUser);
  console.log('MainApp - Is Loading:', isLoading);

  // Check if we should show only the test
  const shouldShowOnlyTest = ENABLE_TESTS && currentUser && 
    (currentUser.position === 'Bartender' || currentUser.position === 'Trainee');

  if (isLoading) {
    return (
      <>
        <SafariLoader />
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: 'white'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3>Loading Decades Bar Training Portal...</h3>
            <div style={{ marginTop: '20px' }}>Please wait</div>
          </div>
        </div>
      </>
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
      <div className="container">
        <Header />
        <Sidebar />
        <div className="main-content">
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