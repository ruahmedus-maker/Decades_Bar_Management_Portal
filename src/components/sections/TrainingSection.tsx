import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

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

// Card Component for Operational Overview
function OverviewCard({ title, description, items, footer }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '10px 0',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(255, 255, 255, 0.05)'
          : '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: uiBackground,
        backdropFilter: isHovered ? 'blur(20px) saturate(180%)' : uiBackdropFilter,
        WebkitBackdropFilter: isHovered ? 'blur(20px) saturate(180%)' : uiBackdropFilterWebkit,
        border: isHovered
          ? '1px solid rgba(255, 255, 255, 0.3)'
          : '1px solid rgba(255, 255, 255, 0.18)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
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
          <p style={{ ...premiumBodyStyle, marginBottom: '15px', fontSize: '0.95rem' }}>{description}</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '0', marginTop: '15px' }}>
            {items.map((item: string, i: number) => (
              <li key={i} style={{ ...premiumBodyStyle, marginBottom: '8px', fontSize: '0.9rem' }}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{
          padding: '12px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          <span>{footer.left}</span>
          <span>{footer.right}</span>
        </div>
      </div>
    </div>
  );
}

// Week Day Component
function WeekDay({ icon, day, title, desc }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        textAlign: 'left',
        padding: '20px',
        background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: isHovered ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: '2rem', marginBottom: '15px', display: 'block', opacity: 0.9 }}>{icon}</span>
        <h5 style={{
          ...premiumWhiteStyle,
          marginBottom: '8px',
          fontSize: '0.9rem',
          letterSpacing: '2px',
          fontWeight: 400
        }}>
          {day}
        </h5>
        <p style={{
          ...premiumBodyStyle,
          margin: 0,
          fontSize: '0.9rem'
        }}>
          <strong>{title}</strong><br />{desc}
        </p>
      </div>
    </div>
  );
}

const cardsData = [
  {
    title: '🚀 Getting Started Guide',
    description: 'Begin your Decades journey with our structured training program.',
    items: ['Review training materials & procedures', 'Study Decades-specific standards', 'Complete POS system training', 'Practice signature cocktail recipes'],
    footer: { left: 'Estimated: 2-3 days', right: '⭐ Essential' }
  },
  {
    title: '🎬 Video Training Library',
    description: 'Watch comprehensive training videos covering operations and mixology.',
    items: ['POS system tutorials', 'Pouring technique demonstrations', 'Cocktail preparation videos', 'Customer service scenarios'],
    footer: { left: '20+ training videos', right: '📺 Visual' }
  },
  {
    title: '🍹 Cocktail Recipes',
    description: 'Access our complete recipe database featuring signature cocktails.',
    items: ['Signature Decades cocktails', 'Classic drink preparations', 'Seasonal specials', 'Garnishing & presentation'],
    footer: { left: '50+ recipes', right: '✨ Mixology' }
  },
  {
    title: '⚡ Bar Operations',
    description: 'Master the operational side including cleaning and inventory.',
    items: ['Daily cleaning checklists', 'Inventory & cost control', 'Closing procedures', 'Rush hour strategies'],
    footer: { left: 'Essential', right: '🛠️ Operations' }
  },
  {
    title: '📊 Progress Tracking',
    description: 'Monitor your training progress and completion status.',
    items: ['Section completion tracking', 'Training progress overview', 'Skill assessment readiness', 'Performance metrics'],
    footer: { left: 'Real-time tracking', right: '📈 Analytics' }
  }
];

const weekData = [
  { icon: '📚', day: 'Days 1-2', title: 'Portal Review', desc: 'Complete all training sections in this portal' },
  { icon: '👀', day: 'Day 3', title: 'Observation Shift', desc: 'Shadow on 2000\'s Floor - focus on learning' },
  { icon: '🛠️', day: 'Day 4', title: 'Hands-On Training', desc: 'Practice on Hip Hop & Rooftop floors' },
  { icon: '🎓', day: 'Day 5', title: 'Assessment', desc: 'Final test and evaluation for shift readiness' }
];

export default function TrainingMaterials() {
  const { currentUser } = useApp();
  const [isOverviewVisible, setIsOverviewVisible] = useState(true);
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
            TRAINING OVERVIEW
          </h3>
          <p style={{ margin: 0, opacity: 0.7, color: 'white', fontSize: '0.8rem', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Structured learning paths and proficiency stages
          </p>
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        {/* New Training Overview Content (Migrated from Welcome) */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ ...premiumWhiteStyle, fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 300 }}>🚀 Core Curriculum</h4>
          </div>
          
          {isOverviewVisible && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {cardsData.map((card, index) => (
                  <OverviewCard key={index} {...card} />
                ))}
              </div>

              <AnimatedCard title="🎯 Your First Week Roadmap">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px'
                }}>
                  {weekData.map((week, index) => (
                    <WeekDay key={index} {...week} />
                  ))}
                </div>
              </AnimatedCard>
            </div>
          )}
        </div>

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
