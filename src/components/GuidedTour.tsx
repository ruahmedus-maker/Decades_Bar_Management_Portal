'use client';

import { useState, useEffect, useRef } from 'react';
import { Joyride, STATUS, Step } from 'react-joyride';
import { useApp } from '@/contexts/AppContext';

export default function GuidedTour() {
  const { currentUser, isAdmin, setActiveSection } = useApp();
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // Optional ref to keep track of any internal async logic
  const tourRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!currentUser || !isClient) return;

    // Check if the user has already seen the tour (V2 - Programmatic Walkthrough)
    const tourKey = `decades_tour_v2_seen_${currentUser.email}`;
    const hasSeenTour = localStorage.getItem(tourKey);
    
    if (!hasSeenTour) {
      // Delay slightly to let the UI finish animating in (glass panels etc)
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isClient]);

  const handleJoyrideCallback = (data: any) => {
    const { status, type, index, action } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // --- PROGRAMMATIC NAVIGATION ENGINE ---
    // If the user advances or reverses, dynamically change the application routing in the background
    // This allows the tour to walk them through multiple discrete views
    if (isAdmin && type === 'step:after') {
      if (action === 'next') {
        if (index === 1) setActiveSection('welcome'); // Back to hub if they were clicking around
        if (index === 2) setActiveSection('employee-counselings'); // Jump exactly to Counselings for Step 4 (Index 3)
        if (index === 3) setActiveSection('performance-report'); // Jump to KPIs for Step 5 (Index 4)
        if (index === 4) setActiveSection('admin-panel'); // Jump to Admin for Step 6 (Index 5)
        if (index === 5) setActiveSection('welcome'); // Reset before signoff
      } else if (action === 'prev') {
        if (index === 3) setActiveSection('welcome'); // Reverting back to sidebar/hub
        if (index === 4) setActiveSection('employee-counselings');
        if (index === 5) setActiveSection('performance-report');
      }
    }

    // Mark as completed once they finish or skip
    if (finishedStatuses.includes(status) && currentUser) {
      localStorage.setItem(`decades_tour_v2_seen_${currentUser.email}`, 'true');
      setRun(false);
      // Reset view to normal once they finish
      setActiveSection('welcome');
    }
  };

  // --- ADVANCED OWNER-CENTRIC PRESENTATION ---
  const adminSteps: Step[] = [
    {
      id: 'admin1',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>Digital Headquarters</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            Welcome to the Decades Bar Management System! This platform is designed to revolutionize how your staff is trained and how operations are tracked.<br/><br/>Let's take a quick tour.
          </p>
        </div>
      ),
      skipBeacon: true,
    },
    {
      id: 'admin2',
      target: '.sidebar',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>The Command Center</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Every operational procedure, training manual, and management tool is organized here. Access is dynamically filtered so staff only see what pertains to their level.</p>
        </div>
      ),
    },
    {
      id: 'admin3',
      target: '[data-tour="procedures"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Digitized Accountability</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Say goodbye to paper checklists. Staff read policies and complete interactive closing duties right from their phones, giving you a timestamped digital paper trail.</p>
        </div>
      ),
    },
    {
      id: 'admin4',
      target: '[data-tour="employee-counselings"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Structured Communication</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>We've seamlessly jumped to the <b>Employee Counselings</b> section. This tool allows managers to log verbal and written warnings securely. All disciplinary records are permanently tied directly to the employee's profile.</p>
        </div>
      ),
    },
    {
      id: 'admin5',
      target: '[data-tour="performance-report"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Eagle-Eye Overview</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>We are now in the <b>Performance KPIs</b> dashboard. This gives you real-time analytics on staff training completion rates across the entire venue. Instantly spot who is falling behind.</p>
        </div>
      ),
    },
    {
      id: 'admin6',
      target: '[data-tour="admin-panel"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Secure Administration</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Finally, the <b>Admin Panel</b> allows you absolute control over role assignments, password auditing, and generating fresh registration codes for new hires.</p>
        </div>
      ),
    },
    {
      id: 'admin7',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>You're In Control</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            The Decades Management System is engineered to automate compliance, elevate your operations, and save you countless hours.<br/><br/>Enjoy your new platform!
          </p>
        </div>
      ),
    }
  ];

  // Generic employee tour for non-owner staff
  const staffSteps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>Welcome to Decades</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            This quick tour will show you how to navigate your training and operations portal.
          </p>
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.sidebar',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Main Navigation</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Access all your assigned training modules and operational checklists right here.</p>
        </div>
      ),
    },
    {
      target: '#welcome',
      placement: 'left',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Training Hub & Progress</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Your dashboard. As you complete and read sections, your progress saves automatically.</p>
        </div>
      ),
    },
    {
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>Ready to Start!</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            Explore the portal and begin your Decades journey.
          </p>
        </div>
      ),
    }
  ];

  if (!isClient) return null;

  return (
    <Joyride
      steps={isAdmin ? adminSteps : staffSteps}
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
