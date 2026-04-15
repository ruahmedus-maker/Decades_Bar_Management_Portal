// HomeDashboard.tsx - PROFESSIONAL UTILITY DASHBOARD
'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { brandFont, goldTextStyle, uiBackground, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

function DashboardWidget({ title, icon, description, onClick }: { title: string, icon: string, description: string, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontSize: '1.8rem' }}>{icon}</span>
        <h3 style={{ ...premiumWhiteStyle, fontSize: '0.9rem', margin: 0, letterSpacing: '2px' }}>{title}</h3>
      </div>
      <p style={{ ...premiumBodyStyle, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

export default function HomeDashboard() {
  const { currentUser, setActiveSection, userProgress } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    trackSectionVisit(currentUser.email, 'welcome', 30);
  }, [currentUser]);

  const progressValue = userProgress?.overallCompletion || 0;

  return (
    <div style={{ padding: '20px', animation: 'fadeIn 0.5s ease' }} id="home">
      {/* Header Widget */}
      <div style={{ 
        background: uiBackground, 
        borderRadius: '20px', 
        padding: '30px', 
        marginBottom: '30px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ ...goldTextStyle, fontSize: '1.8rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Welcome, {currentUser?.name?.split(' ')[0]}
          </h1>
          <p style={{ ...premiumBodyStyle, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            {currentUser?.position} Dashboard • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '5px' }}>Training Completion</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF' }}>{progressValue}%</div>
          <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${progressValue}%`, height: '100%', background: '#D4AF37', transition: 'width 1s ease' }} />
          </div>
        </div>
      </div>

      <h2 style={{ ...premiumWhiteStyle, fontSize: '0.75rem', marginBottom: '20px', color: 'rgba(255,255,255,0.4)', paddingLeft: '5px' }}>
        QUICK ACCESS HUB
      </h2>

      {/* Grid of Dashboard Widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <DashboardWidget 
          title="Ready For Checkout" 
          icon="💰" 
          description="Access Comps & Voids protocols and finalize your shift numbers." 
          onClick={() => setActiveSection('comps-voids')}
        />
        <DashboardWidget 
          title="Current Specials" 
          icon="🏷️" 
          description="View tonight's drink specials and promotional pricing." 
          onClick={() => setActiveSection('drinks-specials')}
        />
        <DashboardWidget 
          title="Special Events" 
          icon="📅" 
          description="Check the venue calendar for private events and floor bookings." 
          onClick={() => setActiveSection('special-events')}
        />
        <DashboardWidget 
          title="Core Curriculum" 
          icon="🎓" 
          description="Resume your mandatory training modules and study materials." 
          onClick={() => setActiveSection('training')}
        />
        <DashboardWidget 
          title="Standard Procedures" 
          icon="📋" 
          description="Reference the master manual for operational excellence." 
          onClick={() => setActiveSection('procedures')}
        />
        <DashboardWidget 
          title="Maintenance Log" 
          icon="🔧" 
          description="Report equipment issues or broken items to management." 
          onClick={() => setActiveSection('maintenance')}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <ProgressSection />
      </div>
    </div>
  );
}