import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, items, children }: any) {
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

// Category Card - ALOHA STYLED
function CategoryCard({ title, items }: any) {
  return (
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h5 style={{ ...premiumWhiteStyle, fontSize: '1rem', marginBottom: '15px', fontWeight: 300, letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>{title}</h5>
      <ul style={{ ...premiumBodyStyle, fontSize: '0.85rem', paddingLeft: '18px', margin: 0 }}>
        {items.filter((i: string) => i.trim()).map((item: string, idx: number) => (
          <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function UniformGuideSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'uniform-guide', 60);
    }, 60000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  return (
    <div
      id="uniform-guide"
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
            Appearance SOPs
          </h3>
          <p style={{ margin: 0, opacity: 0.7, color: 'white', fontSize: '0.8rem', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Professional branding and grooming standards
          </p>
        </div>
        <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', color: 'white', fontWeight: 300, border: '1px solid rgba(255, 255, 255, 0.2)', letterSpacing: '1px' }}>DRESS CODE</span>
      </div>

      <div style={{ padding: '25px' }}>
        <AnimatedCard
          title="👔 Decades Attire Guidelines"
          description="Maintain the Decades brand image. Each team member represents our commitment to excellence in premium nightlife hospitality."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <CategoryCard title="🤵 Men" items={['Black Decades branded shirt', 'Concept/Genre Culture T-shirts', 'Trending urban wear (Premium/Fly)', 'No sweat pants', 'No shorts', 'Groomed styling required']} />
            <CategoryCard title="👸 Women" items={['Concept themed (Optional)', 'Fashion-forward personal choice', 'No cocktail waitress generic look', 'No sweat pants', 'Hair and makeup polished']} />
          </div>
        </AnimatedCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <AnimatedCard title="✨ Grooming & Presentation">
            <ul style={{ ...premiumBodyStyle, fontSize: '0.9rem', paddingLeft: '18px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>Uniforms must be pressed and immaculate</li>
              <li style={{ marginBottom: '8px' }}>Facial hair must be precision groomed</li>
              <li style={{ marginBottom: '8px' }}>Personal hygiene strictly enforced (Deodorant/Antiperspirant)</li>
              <li style={{ marginBottom: '8px' }}>Event-specific attire communicated prior to event</li>
            </ul>
          </AnimatedCard>

          <AnimatedCard title="📋 Compliance Notes" items={['Cleanliness is non-negotiable', 'Follow floor-specific culture themes', 'Appearance checks performed at clock-in']} />
        </div>

        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
