'use client';

import { AppProvider, useApp } from '@/contexts/AppContext';
import LoginBarrier from '@/components/LoginBarrier';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SectionRouter from '@/components/SectionRouter';
import Toast from '@/components/Toast';


function MainApp() {
  const { currentUser, isLoading, toast, hideToast } = useApp();

  console.log('MainApp - Current User:', currentUser); // Debug
  console.log('MainApp - Is Loading:', isLoading); // Debug

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            color: 'white'
          }}>
            <h3>Loading Decades Bar Training Portal...</h3>
            <div style={{ marginTop: '20px' }}>Please wait</div>
          </div>
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
  console.log('MainApp - Showing Main Interface'); // Debug
  return (
    <>
      <div className="container">
        <Sidebar />
        <div className="main-content">
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


