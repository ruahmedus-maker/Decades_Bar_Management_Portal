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

// Glassware Card - ALOHA STYLED
function GlasswareCard({ title, primaryUse, includes, note }: any) {
  return (
    <div
      style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h5 style={{
          ...premiumWhiteStyle,
          marginBottom: '18px',
          fontSize: '1rem',
          letterSpacing: '2px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px'
        }}>
          {title}
        </h5>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ color: 'white', fontSize: '0.75rem', fontWeight: 400, marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.6 }}>
            Primary Use:
          </div>
          <p style={{ ...premiumBodyStyle, margin: 0, fontSize: '0.95rem', fontWeight: 300 }}>
            {primaryUse}
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ color: 'white', fontSize: '0.75rem', fontWeight: 400, marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.6 }}>
            Drink Selection:
          </div>
          <ul style={{ margin: '8px 0', paddingLeft: '18px' }}>
            {includes.map((item: string, idx: number) => (
              <li key={idx} style={{ ...premiumBodyStyle, marginBottom: '4px', fontSize: '0.85rem', fontWeight: 300, opacity: 0.85 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {note && (
          <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
            <p style={{ ...premiumBodyStyle, margin: 0, fontSize: '0.8rem', fontStyle: 'italic', fontWeight: 300, opacity: 0.7 }}>
              {note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GlasswareGuideSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'glassware-guide', 60);
    }, 60000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  const glasswareData = [
    {
      title: 'Large Branded Glass',
      primaryUse: 'High-volume cocktails and refreshments',
      includes: [
        'Soft drinks, Water, and Juices',
        'Long Island Iced Tea variations',
        'All cocktails containing Red Bull',
        'Signature Decades features',
        'Double liquor-count cocktails'
      ],
      note: 'Can serve as a double shooter vessel upon specific request'
    },
    {
      title: 'Frosted Spirit Glass',
      primaryUse: 'Spirit-forward serves and rocks pours',
      includes: [
        'Single/Double neat spirit pours',
        'Single-pour mixed drinks (e.g. Soda/Cola)',
        'Rocks pours (Ice only)',
        'Straight-up chilled spirit pours'
      ]
    },
    {
      title: 'Precision Shot Glass',
      primaryUse: 'Fixed-measure spirit and shooter serves',
      includes: [
        'Single liquor shots',
        'Multi-ingredient shooters'
      ],
      note: 'Protocol: Pours should arrive just below the rim'
    },
    {
      title: 'Neon Shot Glass',
      primaryUse: 'Comp shots and promotions',
      includes: [
        'Complimentary (Comp) shots',
        'All Birthday Package shots at the request of a Host or management',
        'All staff shots'
      ],
      note: 'Any and all comp shots should go in these shot glasses unless specified otherwise by management'
    }
  ];

  return (
    <div
      id="glassware-guide"
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
            Glassware Standards
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
            Vessel selection and presentation protocols
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
          PRESENTATION
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        <AnimatedCard
          title="🥃 Proper Selection"
          description="Master the art of presentation. Correct glassware ensures optimal flavor profiles and professional guest service."
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginTop: '10px'
        }}>
          {glasswareData.map((glass, index) => (
            <GlasswareCard
              key={index}
              title={glass.title}
              primaryUse={glass.primaryUse}
              includes={glass.includes}
              note={glass.note}
            />
          ))}
        </div>


        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
