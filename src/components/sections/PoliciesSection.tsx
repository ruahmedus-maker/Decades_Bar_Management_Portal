import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, items, children }: CardProps) {
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
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
        <div style={{ padding: '20px', flex: 1 }}>
          {children || (
            <>
              <p style={{ ...premiumBodyStyle, marginBottom: '12px', fontSize: '0.95rem' }}>{description}</p>
              <ul style={{ paddingLeft: '18px', marginBottom: '0', marginTop: '12px' }}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ ...premiumBodyStyle, marginBottom: '6px', fontSize: '0.9rem' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PoliciesSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'policies', 60);
    }, 60000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  return (
    <div
      id="policies"
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
            Workplace Policies
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
            Governance and regulatory standards
          </p>
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        <AnimatedCard
          title="📋 Decades Compliance"
          description="Fundamental operating rules for all staff. Adherence is mandatory for maintaining our professional service environment."
          items={[
            'Strict adherance to all Decades specific role based standards and procedures',
            'Conduct and professionalism',
            'Sexual harassment prevention',
            'Alcohol service compliance',
            'Safety and emergency procedures',
            'Social media marketing and branding'
          ]}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <AnimatedCard title="👔 Professional Standards">
            <ul style={{ ...premiumBodyStyle, fontSize: '0.9rem', paddingLeft: '18px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>Strict punctuality</li>
              <li style={{ marginBottom: '8px' }}>Respectful internal communication</li>
              <li style={{ marginBottom: '8px' }}>Active management conflict resolution</li>
              <li style={{ marginBottom: '8px' }}>Zero tolerance for workspace hostility</li>
            </ul>
          </AnimatedCard>

          <AnimatedCard title="🚫 Prohibited Behaviors">
            <ul style={{ ...premiumBodyStyle, fontSize: '0.9rem', paddingLeft: '18px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>Unauthorized drinking during shifts</li>
              <li style={{ marginBottom: '8px' }}>Missing counterfeit verification steps</li>
              <li style={{ marginBottom: '8px' }}>Sharing internal codes or passwords</li>
              <li style={{ marginBottom: '8px' }}>Unauthorized guest comps or voids</li>
            </ul>
          </AnimatedCard>
        </div>

        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
