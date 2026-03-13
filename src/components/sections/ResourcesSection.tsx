import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, children }: CardProps) {
  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={{
            ...cardHeaderStyle,
            ...premiumWhiteStyle,
            letterSpacing: '3px',
            fontSize: '1rem'
          }}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '20px' }}>
          {description && <p style={{ ...premiumBodyStyle, marginBottom: '15px', fontSize: '0.9rem' }}>{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

// Resource Item Component - ALOHA STYLED
function ResourceItem({ title, description, icon }: any) {
  return (
    <div
      style={{
        padding: '18px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
        <div style={{ fontSize: '1.2rem', opacity: 0.7 }}>{icon}</div>
        <div>
          <h5 style={{ color: 'white', margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 300, letterSpacing: '0.5px' }}>{title}</h5>
          <p style={{ ...premiumBodyStyle, margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'resources', 60);
    }, 60000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  const resources = [
    { icon: '🍸', title: 'Cocktail Bible', description: 'Complete signature recipe database' },
    { icon: '💻', title: 'Aloha POS Guide', description: 'Terminal troubleshooting & operations' },
    { icon: '🛡️', title: 'Safety Protocols', description: 'Emergency procedures & medical response' },
    { icon: '📦', title: 'Inventory Log', description: 'Stock control and ordering guidelines' },
    { icon: '🎉', title: 'Event Standards', description: 'VIP hosting and special feature protocols' },
    { icon: '👥', title: 'Guest Excellence', description: 'Service standards & de-escalation' }
  ];

  return (
    <div
      id="resources-section"
      style={{
        marginBottom: '25px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
      }}
      className="active"
    >

      {/* Section Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
            Resource Library
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.7,
            color: 'white',
            fontSize: '0.8rem',
            marginTop: '4px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Training materials and reference documentation
          </p>
        </div>
        <span style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          color: 'white',
          fontWeight: 300,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          letterSpacing: '1px'
        }}>
          REFERENCE
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        <AnimatedCard
          title="📚 Reference Materials"
          description="Access all essential guides and documentation for your role at Decades."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
            {resources.map((resource, index) => (
              <ResourceItem key={index} {...resource} />
            ))}
          </div>
        </AnimatedCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
          {[
            { icon: '📋', label: 'Employee Handbook' },
            { icon: '🎬', label: 'Training Videos' },
            { icon: '📞', label: 'Support Contacts' }
          ].map((btn, idx) => (
            <button key={idx} style={{
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.8rem',
              letterSpacing: '1px',
              cursor: 'pointer',
              fontWeight: 300
            }}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
