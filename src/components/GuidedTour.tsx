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
    
    console.log('🏁 GuidedTour check:', { 
      email: currentUser.email, 
      hasSeenTour, 
      isAdmin,
      isClient 
    });

    if (!hasSeenTour) {
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
    if (type === 'step:after') {
      if (action === 'next') {
        // Admin Navigation
        if (isAdmin) {
          if (index === 14) setActiveSection('admin-panel');
          if (index === 15) setActiveSection('employee-counselings');
          if (index === 16) setActiveSection('performance-report');
          if (index === 17) setActiveSection('maintenance');
          if (index === 18) setActiveSection('welcome'); // Reset on outro
        } 
        // Staff Navigation (Bartender/Trainee)
        else {
          if (index === 1) setActiveSection('training');
          if (index === 2) setActiveSection('tests');
          if (index === 3) setActiveSection('procedures');
          if (index === 4) setActiveSection('aloha-pos');
          if (index === 5) setActiveSection('cocktails');
          if (index === 6) setActiveSection('drinks-specials');
          if (index === 7) setActiveSection('glassware-guide');
          if (index === 8) setActiveSection('uniform-guide');
          if (index === 9) setActiveSection('bar-cleanings');
          if (index === 10) setActiveSection('social-media');
          if (index === 11) setActiveSection('special-events');
          if (index === 12) setActiveSection('comps-voids');
          if (index === 13) setActiveSection('policies');
          if (index === 14) setActiveSection('maintenance');
          if (index === 15) setActiveSection('welcome'); // Reset on outro
        }
      } else if (action === 'prev') {
        if (isAdmin) {
          if (index === 16) setActiveSection('admin-panel');
          if (index === 17) setActiveSection('employee-counselings');
          if (index === 18) setActiveSection('performance-report');
          if (index === 19) setActiveSection('maintenance');
        } else {
          if (index === 2) setActiveSection('training');
          if (index === 3) setActiveSection('tests');
          if (index === 4) setActiveSection('procedures');
          if (index === 5) setActiveSection('aloha-pos');
          if (index === 6) setActiveSection('cocktails');
          if (index === 7) setActiveSection('drinks-specials');
          if (index === 8) setActiveSection('glassware-guide');
          if (index === 9) setActiveSection('uniform-guide');
          if (index === 10) setActiveSection('bar-cleanings');
          if (index === 11) setActiveSection('social-media');
          if (index === 12) setActiveSection('special-events');
          if (index === 13) setActiveSection('comps-voids');
          if (index === 14) setActiveSection('policies');
          if (index === 15) setActiveSection('maintenance');
        }
      }
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Your Operational Dashboard – Overview of tasks and progress.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Digital library containing all mandatory training modules.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Integrated assessment system to verify staff knowledge.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Centralized repository for opening and closing checklists.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Technical Guide for the point-of-sale system.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Standardized beverage build-sheets for quality control.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Real-time updates on current specials and deals.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Visual Standards for correct glass selection.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Guidelines for staff presentation and professional atmosphere.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Sanitation standards and deep-cleaning tasks.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Brand amplification guidelines for staff.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Financial Protocol for handling adjustments.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>The official handbook covering legal requirements and safety.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Backend controls for user accounts and global settings.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Performance tracking and disciplinary actions logs.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Operational Analytics on training completion.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Facility care reporting and status tracking.</p>
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
            You've seen the full power of the Decades Bar Management System.<br/><br/>Enjoy your platform!
          </p>
        </div>
      ),
    }
  ];

  const staffSteps: Step[] = [
    {
      id: 'staff_intro',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>Welcome to Decades</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            This portal is your primary tool for mastering your role.<br/><br/>Let's see what's available to you.
          </p>
        </div>
      ),
      skipBeacon: true,
    },
    {
      id: 'staff_welcome',
      target: '[data-tour="welcome"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Dashboard</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Your home screen for announcements and progress.</p>
        </div>
      ),
    },
    {
      id: 'staff_training',
      target: '[data-tour="training"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Training Library</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Review mandatory training modules and core documentation.</p>
        </div>
      ),
    },
    {
      id: 'staff_tests',
      target: '[data-tour="tests"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Knowledge Tests</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Complete assessments to certify your expertise.</p>
        </div>
      ),
    },
    {
      id: 'staff_procedures',
      target: '[data-tour="procedures"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Daily Procedures</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Opening and closing checklists for shift consistency.</p>
        </div>
      ),
    },
    {
      id: 'staff_aloha',
      target: '[data-tour="aloha-pos"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Aloha POS</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Visual tutorials to master our point-of-sale system.</p>
        </div>
      ),
    },
    {
      id: 'staff_cocktails',
      target: '[data-tour="cocktails"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Cocktail Recipes</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Standardized recipes to guarantee consistency.</p>
        </div>
      ),
    },
    {
      id: 'staff_specials',
      target: '[data-tour="drinks-specials"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Current Specials</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Stay updated on seasonal offerings and deals.</p>
        </div>
      ),
    },
    {
      id: 'staff_glassware',
      target: '[data-tour="glassware-guide"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Glassware Guide</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Reference for correct serving vessels.</p>
        </div>
      ),
    },
    {
      id: 'staff_uniform',
      target: '[data-tour="uniform-guide"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Professionalism</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Guidelines for staff appearance and grooming.</p>
        </div>
      ),
    },
    {
      id: 'staff_cleaning',
      target: '[data-tour="bar-cleanings"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Sanitation</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Cleaning schedules to maintain our world-class environment.</p>
        </div>
      ),
    },
    {
      id: 'staff_social',
      target: '[data-tour="social-media"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Social Hub</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Marketing assets and guidelines for staff.</p>
        </div>
      ),
    },
    {
      id: 'staff_events',
      target: '[data-tour="special-events"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Events Calendar</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Check the schedule for private events and holiday hours.</p>
        </div>
      ),
    },
    {
      id: 'staff_comps',
      target: '[data-tour="comps-voids"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Comps & Voids</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Required protocols for transactions and documentation.</p>
        </div>
      ),
    },
    {
      id: 'staff_policies',
      target: '[data-tour="policies"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>House Policies</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Handbook on conduct, safety, and compliance.</p>
        </div>
      ),
    },
    {
      id: 'staff_maintenance',
      target: '[data-tour="maintenance"]',
      placement: 'right',
      content: (
        <div>
          <h3 style={{ color: '#FFD700', marginBottom: '8px', fontWeight: 300, letterSpacing: '1px', textTransform: 'uppercase' }}>Maintenance</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Report equipment issues or tracking requests here.</p>
        </div>
      ),
    },
    {
      id: 'staff_outro',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 300 }}>Ready to Start</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: '1.5', fontWeight: 300 }}>
            You're all set! Let's make every shift legendary.<br/><br/>Welcome to Decades!
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
