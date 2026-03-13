import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, children }: CardProps) {
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
          {children}
        </div>
      </div>
    </div>
  );
}

// Phase Item Component - ALOHA STYLED
function PhaseItem({ title, items, highlight }: any) {
  return (
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h5 style={{ ...premiumWhiteStyle, fontSize: '0.95rem', marginBottom: '12px', fontWeight: 300, letterSpacing: '1px' }}>{title}</h5>
      {highlight && <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '6px', fontSize: '0.75rem', color: 'white', textAlign: 'center', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>{highlight}</div>}
      <ul style={{ ...premiumBodyStyle, fontSize: '0.85rem', paddingLeft: '18px', margin: 0 }}>
        {items.map((item: string, i: number) => (
          <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function TrainingMaterials() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'training', 60);
    }, 60000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  return (
    <div
      id="training"
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
            Training Curriculum
          </h3>
          <p style={{ margin: 0, opacity: 0.7, color: 'white', fontSize: '0.8rem', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Structured learning paths and proficiency stages
          </p>
        </div>
        <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', color: 'white', fontWeight: 300, border: '1px solid rgba(255, 255, 255, 0.2)', letterSpacing: '1px' }}>CURRICULUM v2.0</span>
      </div>

      <div style={{ padding: '25px' }}>
        <AnimatedCard title="🎯 Your Training Roadmap">
          <p style={{ ...premiumBodyStyle, fontSize: '0.95rem', marginBottom: '20px' }}>Follow this structured path to master high-volume operations at Decades.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <PhaseItem title="📚 Phase 1: Foundation" items={['Study recipes & glassware', 'Learn cleaning SOPs', 'Master POS basics', 'Brand value immersion']} />
            <PhaseItem title="🛠️ Phase 2: Practical" items={['Station shadow shifts', 'Speed/accuracy practice', 'Opening/closing loops', 'Floor-specific workflow']} />
            <PhaseItem title="🎓 Phase 3: Mastery" items={['Solo shifts (supervised)', 'Conflict de-escalation', 'Upselling excellence', 'Final assessment']} />
          </div>
        </AnimatedCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <AnimatedCard title="⚡ Performance Benchmarks">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ ...premiumBodyStyle, fontSize: '0.85rem' }}>Standard Cocktail</span>
                <span style={{ ...premiumWhiteStyle, fontSize: '0.85rem' }}>45s</span>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ ...premiumBodyStyle, fontSize: '0.85rem' }}>Complex Signature</span>
                <span style={{ ...premiumWhiteStyle, fontSize: '0.85rem' }}>90s</span>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ ...premiumBodyStyle, fontSize: '0.85rem' }}>Peak Rush Target</span>
                <span style={{ ...premiumWhiteStyle, fontSize: '0.85rem' }}>3 guests/min</span>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard title="📅 Shift Floor Assignments">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PhaseItem title="Friday Training" highlight="2000's Floor" items={['Mainstream speed focus', 'Group order management']} />
              <PhaseItem title="Saturday Training" highlight="Rooftop / VIP" items={['Premium service standards', 'Bottle service pacing']} />
            </div>
          </AnimatedCard>
        </div>

        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
