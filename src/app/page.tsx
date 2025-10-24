// page.tsx
'use client';

import { AppProvider, useApp } from '@/contexts/AppContext';
import LoginBarrier from '@/components/LoginBarrier';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SectionRouter from '@/components/SectionRouter';
import Toast from '@/components/Toast';

function MainApp() {
  const { currentUser, isLoading, toast, hideToast } = useApp();

  console.log('MainApp - Current User:', currentUser);
  console.log('MainApp - Is Loading:', isLoading);

  if (isLoading) {
    return (
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
    );
  }

  if (!currentUser) {
    return (
      <>
        <LoginBarrier />
        <Toast 
          message={toast.message} 
          show={toast.show} 
          onHide={hideToast} 
        />
      </>
    );
  }

  return (
    <>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'transparent',
        position: 'relative',
        zIndex: 10,
      }}>
        <Sidebar />
        <div style={{
          flex: 1,
          marginLeft: '280px',
          padding: '30px',
          minHeight: '100vh',
          background: 'transparent',
          width: 'calc(100% - 280px)',
        }}>
          <Header />
          <SectionRouter />
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