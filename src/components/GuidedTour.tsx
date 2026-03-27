'use client';

import { useState, useEffect } from 'react';
import { Joyride, STATUS, Step } from 'react-joyride';
import { useApp } from '@/contexts/AppContext';

export default function GuidedTour() {
  const { currentUser, isAdmin } = useApp();
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!currentUser || !isClient) return;

    // Check if the user has already seen the tour
    const tourKey = `decades_tour_seen_${currentUser.email}`;
    const hasSeenTour = localStorage.getItem(tourKey);
    
    if (!hasSeenTour) {
      // Delay slightly to let the UI finish animating in (glass panels etc)
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isClient]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Mark as completed once they finish or skip
    if (finishedStatuses.includes(status) && currentUser) {
      localStorage.setItem(`decades_tour_seen_${currentUser.email}`, 'true');
      setRun(false);
    }
  };

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>Welcome to Decades</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            This quick tour will show you how to navigate your new Management and Training Portal.
          </p>
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.sidebar',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase' }}>Main Navigation</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Access all your training materials, operational procedures, and settings right here.</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="procedures"]',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase' }}>Standard Procedures</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Find crucial daily checklists, like opening and closing duties, automatically organized by your role.</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="bar-cleanings"]',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase' }}>Deep Cleanings</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Interactive weekly and monthly deep-cleaning checklists that sync directly to management.</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '#welcome', 
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase' }}>Training Hub</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Your main dashboard. Progress tracking is entirely automatic as you read through assigned modules!</p>
        </div>
      ),
      placement: 'left',
    }
  ];

  // Add Admin specific step if the user is an admin
  if (isAdmin) {
    steps.push({
      target: '[data-tour="admin-panel"]',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase' }}>Admin Dashboard</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Managers can review staff progress, track module completion, and audit training records securely.</p>
        </div>
      ),
      placement: 'right',
    });
  }

  // Final confirmation
  steps.push({
    target: 'body',
    placement: 'center',
    content: (
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>You're All Set!</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
          Explore the portal. Don't forget that your progress saves automatically!
        </p>
      </div>
    ),
  });

  if (!isClient) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleJoyrideCallback}
      options={{
        showProgress: true,
        buttons: ['back', 'skip', 'primary'],
        arrowColor: 'rgba(26, 54, 93, 0.98)',
        backgroundColor: 'rgba(26, 54, 93, 0.98)',
        primaryColor: '#FFD700',
        textColor: '#FFFFFF',
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 10000,
      }}
      styles={{
        tooltipContainer: {
          textAlign: 'left',
          fontSize: '15px',
          fontFamily: 'var(--font-outfit), sans-serif',
        },
        tooltip: {
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          padding: '15px',
        },
        buttonPrimary: {
          background: 'linear-gradient(180deg, #FFF7CC 0%, #FFD700 50%, #B8860B 100%)',
          color: '#1a365d',
          fontWeight: 600,
          borderRadius: '8px',
          padding: '10px 20px',
          border: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        },
        buttonBack: {
          color: '#FFD700',
          marginRight: '15px',
          fontWeight: 300,
        },
        buttonSkip: {
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: 300,
        }
      }}
    />
  );
}
