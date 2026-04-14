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

export default function SocialMediaSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'social-media', 60);
    }, 60000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  return (
    <div
      id="social-media"
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
            Social Promotions
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
            Marketing content and brand propagation
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
          MARKETING
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        <AnimatedCard
          title="📱 Decades Digital Presence"
          description="Engage with our community. Your participation in our social media strategy drives venue energy and guest retention."
          items={[
            'Instagram story tagging @decades',
            'Facebook event propagation',
            'TikTok behind-the-scenes content',
            'Real-time venue atmosphere updates'
          ]}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <AnimatedCard title="🎯 Content Standards">
            <ul style={{ ...premiumBodyStyle, fontSize: '0.9rem', paddingLeft: '18px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>Use high-fidelity visuals only</li>
              <li style={{ marginBottom: '8px' }}>Tag official @Decades accounts</li>
              <li style={{ marginBottom: '8px' }}>Leverage #DecadesNightlife #DecadesEvents</li>
              <li style={{ marginBottom: '12px' }}>Maintain professional representation</li>
              <li style={{ 
                marginTop: '15px',
                padding: '10px', 
                background: 'rgba(252, 129, 129, 0.1)', 
                borderRadius: '8px', 
                border: '1px solid rgba(252, 129, 129, 0.3)',
                color: '#fc8181',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                ⚠️ REQUIREMENT: Must post the day of your shift between 12:00 PM – 5:00 PM
              </li>
            </ul>
          </AnimatedCard>

          <AnimatedCard title="🌐 Platform Optimization">
            <ul style={{ ...premiumBodyStyle, fontSize: '0.9rem', paddingLeft: '18px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>IG: Vertical format, trending audio</li>
              <li style={{ marginBottom: '8px' }}>FB: Event links with clear calls-to-action</li>
              <li style={{ marginBottom: '8px' }}>TikTok: Rapid-cut energy clips</li>
              <li style={{ marginBottom: '8px' }}>X: Quick guest engagement & updates</li>
            </ul>
          </AnimatedCard>

          <AnimatedCard title="🎟️ Flyers & Strategy">
            <ul style={{ ...premiumBodyStyle, fontSize: '0.9rem', paddingLeft: '18px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>Weekly flyers shared ahead of time for strategy use</li>
              <li style={{ marginBottom: '8px' }}>Prioritize photo content of yourself and work Reels</li>
              <li style={{ marginBottom: '12px' }}>Follow current workplace trends for highest engagement</li>
              <li style={{ 
                marginBottom: '8px', 
                padding: '10px', 
                background: 'rgba(212, 175, 55, 0.1)', 
                borderRadius: '8px', 
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#D4AF37'
              }}>
                <strong>Call to Action:</strong> Direct followers to <strong>Posh.vip</strong> for RSVPs, tickets, and special offer details.
              </li>
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
