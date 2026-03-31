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
    // Safety fallback: if anything crashes during initial mount, force it off
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
      // Delay slightly to let the UI finish animating in (glass panels etc)
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
    if (isAdmin && type === 'step:after') {
      if (action === 'next') {
        // Navigation triggers as we move from one step to the next
        if (index === 14) setActiveSection('admin-panel');
        if (index === 15) setActiveSection('employee-counselings');
        if (index === 16) setActiveSection('performance-report');
        if (index === 17) setActiveSection('maintenance');
        if (index === 18) setActiveSection('welcome'); // Reset on outro
      } else if (action === 'prev') {
        if (index === 16) setActiveSection('admin-panel');
        if (index === 17) setActiveSection('employee-counselings');
        if (index === 18) setActiveSection('performance-report');
        if (index === 19) setActiveSection('maintenance');
      }
    }

    // Mark as completed once they finish or skip
    if (finishedStatuses.includes(status) && currentUser) {
      localStorage.setItem(`decades_tour_v3_seen_${currentUser.email}`, 'true');
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
            Welcome to the Decades Bar Management System! This platform is designed to revolutionize how your staff is trained and how operations are tracked.<br/><br/>Let's explore every feature together.
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Your Operational Dashboard – Overview of tasks, announcements, and personal progress at a glance.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Knowledge Base – Digital library containing all mandatory training modules and core documentation.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Compliance Certification – Integrated assessment system to verify staff knowledge and ensure house standards.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Consistency Engine – Centralized repository for opening and closing checklists to maintain operational excellence.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Technical Guide – Visual tutorials and troubleshooting for the point-of-sale system to minimize errors.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Quality Control – Standardized beverage build-sheets to ensure every drink is poured to perfection.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Promotional Hub – Real-time updates on current specials, seasonal offerings, and happy hour deals.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Visual Standards – Reference for correct glass selection, reinforcing premium branding.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Appearance Standards – Clear guidelines for staff presentation to maintain a professional atmosphere.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Sanitation Standards – Specialized checklists for daily and weekly deep-cleaning tasks to ensure a spotless bar.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Brand Amplification – Guidelines and assets for staff to assist with digital marketing and outreach.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Operational Calendar – Central hub for private bookings, holiday hours, and special events.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Financial Protocol – Clear standards for handling transaction adjustments and documentation.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>House Standards – The official handbook covering legal requirements, conduct, and safety.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Management Hub – Backend controls for user accounts, registration codes, and global settings.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Performance Tracking – Secure system for logging staff feedback, professional development, and disciplinary actions.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Operational Analytics – Real-time data on training completion and staff engagement venue-wide.</p>
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300 }}>Facility Care – Reporting tool for equipment issues and tracking repair statuses.</p>
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
            You've seen the full power of the Decades Bar Management System. Use these tools to drive efficiency and excellence in your venue.<br/><br/>Enjoy your platform!
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
