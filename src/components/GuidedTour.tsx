'use client';

import { useState, useEffect, useRef } from 'react';
import { Joyride, STATUS, Step } from 'react-joyride';
import { useApp } from '@/contexts/AppContext';

export default function GuidedTour() {
  const { currentUser, isAdmin, setActiveSection } = useApp();
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const tourRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    return () => setRun(false);
  }, []);

  useEffect(() => {
    if (!currentUser || !isClient) return;

    // Check if the user has already seen the tour (V4 - Forced Reset)
    const tourKey = `decades_tour_v4_seen_${currentUser.email}`;
    const hasSeenTour = localStorage.getItem(tourKey);
    const isTestAdmin = currentUser.email === 'admin@decadesbar.com';
    
    console.log('🏁 GuidedTour check:', { 
      email: currentUser.email, 
      hasSeenTour, 
      isAdmin,
      isClient,
      isTestAdmin
    });

    // Tour is ONLY for Admin users
    if (!isAdmin) return;

    // Force tour for Test Admin, or show once for other Admins
    if (isTestAdmin || !hasSeenTour) {
      console.log('🚀 Scheduling tour start in 3s...');
      const timer = setTimeout(() => {
        console.log('🔥 Starting tour now!');
        setRun(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isClient, isAdmin]);

  const handleJoyrideCallback = (data: any) => {
    const { status, type, index, action } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // --- PROGRAMMATIC NAVIGATION ENGINE ---
    if (type === 'step:after' && action === 'next') {
      if (index === 14) setActiveSection('admin-panel');
      if (index === 15) setActiveSection('employee-counselings');
      if (index === 16) setActiveSection('performance-report');
      if (index === 17) setActiveSection('maintenance');
      if (index === 18) setActiveSection('welcome'); // Reset on outro
    }

    // Mark as completed once they finish or skip
    if (finishedStatuses.includes(status) && currentUser) {
      const tourKey = `decades_tour_v4_seen_${currentUser.email}`;
      localStorage.setItem(tourKey, 'true');
      setRun(false);
      setActiveSection('welcome');
    }
  };

  // --- COMPREHENSIVE 18-STEP OWNER-CENTRIC PRESENTATION ---
  const adminSteps: Step[] = [
    {
      id: 'step_intro',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>Digital Headquarters</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            Welcome to the Decades Bar Management System!<br/><br/>Let's explore every feature together.
          </p>
        </div>
      ),
      skipBeacon: true,
    },
    {
      id: 'step_welcome',
      target: '[data-tour="welcome"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Welcome & Dashboard</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Welcome page describing the concept and visual overview of the venue.</p>
        </div>
      ),
    },
    {
      id: 'step_training',
      target: '[data-tour="training"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Training Materials</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Training road map for new hires outlines the training modules and a brief description of each module.</p>
        </div>
      ),
    },
    {
      id: 'step_tests',
      target: '[data-tour="tests"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Training Tests</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>This is a where we can enable pop up tests for staff memebers. When a test is enabled the staff member will only see the test upon login, abstracting away the entire application.</p>
        </div>
      ),
    },
    {
      id: 'step_procedures',
      target: '[data-tour="procedures"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Standard Procedures</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Centralized repository for opening and closing checklists and a checkouy notification function that ensures onec all closing steps are checked off a manager will recieve an alert.</p>
        </div>
      ),
    },
    {
      id: 'step_aloha',
      target: '[data-tour="aloha-pos"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Aloha POS Guide</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Technical Guide for the point-of-sale system, includes video guides of how to perform basic functions on the POS.</p>
        </div>
      ),
    },
    {
      id: 'step_cocktails',
      target: '[data-tour="cocktails"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Cocktail Recipes</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>An entire database library of hundreds of popular cocktails for an employee to reference.</p>
        </div>
      ),
    },
    {
      id: 'step_specials',
      target: '[data-tour="drinks-specials"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Drinks Specials</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Active current specials and deals.</p>
        </div>
      ),
    },
    {
      id: 'step_glassware',
      target: '[data-tour="glassware-guide"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Glassware Guide</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Presentation Standards for correct glass selection.</p>
        </div>
      ),
    },
    {
      id: 'step_uniform',
      target: '[data-tour="uniform-guide"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Uniform Guide</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Guidelines for staff presentation and grooming standards.</p>
        </div>
      ),
    },
    {
      id: 'step_cleaning',
      target: '[data-tour="bar-cleanings"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Bar Cleanings</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Bar cleaning procedures and calendar for scheduled cleanings.</p>
        </div>
      ),
    },
    {
      id: 'step_social',
      target: '[data-tour="social-media"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Social Media</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Social media guidelines for staff, including resources, strategy and requirements.</p>
        </div>
      ),
    },
    {
      id: 'step_events',
      target: '[data-tour="special-events"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Special Events</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Operational calendar for private bookings and events.</p>
        </div>
      ),
    },
    {
      id: 'step_comps',
      target: '[data-tour="comps-voids"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Comps & Voids</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Guidelines and procedures on how to account for comps, voids and dollar limits.</p>
        </div>
      ),
    },
    {
      id: 'step_policies',
      target: '[data-tour="policies"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Policies</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Guide to Decades policies and legal parameters.</p>
        </div>
      ),
    },
    {
      id: 'step_admin',
      target: '[data-tour="admin-panel"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Admin Panel</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Amin control center where managers can monitor employee completion progress of the training modules, get pop-up test results, track and modify the status of maintenance tickets create events and tasks to attach to events.</p>
        </div>
      ),
    },
    {
      id: 'step_counseling',
      target: '[data-tour="employee-counselings"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Employee Counselings</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Managers can create and document violations of policy, poor performance and write ups for use in disciplinary action and accountability.</p>
        </div>
      ),
    },
    {
      id: 'step_kpi',
      target: '[data-tour="performance-report"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Performance KPIs</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Inactive module for now, requires integration with POS system. Deasigned to track weekly performance of bartenders</p>
        </div>
      ),
    },
    {
      id: 'step_maintenance',
      target: '[data-tour="maintenance"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Maintenance</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Employees can submit maintenance tickets upon observation of any issues throughout the venue.</p>
        </div>
      ),
    },
    {
      id: 'step_outro',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>A New Standard</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            You've seen the full power of the Decades Bar Management System which allows management to effectively communicate and train employess to the standars and benchmarks required.<br/><br/>Enjoy your platform!
          </p>
        </div>
      ),
    }
  ];

  if (!isClient) return null;

  return (
    <Joyride
      steps={adminSteps}
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
