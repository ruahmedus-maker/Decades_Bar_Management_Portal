import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, items, footer, children }: CardProps) {
  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
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
          backdropFilter: 'none'
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
        <div style={{ padding: '16px 20px' }}>
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
        {footer && (
          <div style={{
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Special Card Component - ALOHA STYLED
function SpecialCard({ title, description, specials, hours, notes }: any) {
  return (
    <div
      style={{
        textAlign: 'left',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h5 style={{
          ...premiumWhiteStyle,
          color: 'white',
          marginBottom: '15px',
          fontSize: '1rem',
          letterSpacing: '2px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px'
        }}>
          {title}
        </h5>

        {description && (
          <p style={{ ...premiumBodyStyle, marginBottom: '15px', fontSize: '0.9rem' }}>
            {description}
          </p>
        )}

        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 400,
            marginBottom: '8px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.7
          }}>
            Specials:
          </div>
          <ul style={{ margin: '8px 0', paddingLeft: '18px' }}>
            {specials.map((special: string, idx: number) => (
              <li key={idx} style={{
                ...premiumBodyStyle,
                marginBottom: '4px',
                fontSize: '0.9rem',
                fontWeight: 300
              }}>
                {special}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 400,
            marginBottom: '8px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.7
          }}>
            Hours:
          </div>
          <p style={{ ...premiumBodyStyle, margin: 0, fontSize: '0.9rem', fontWeight: 300 }}>
            {hours}
          </p>
        </div>

        {notes && (
          <div>
            <div style={{
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 400,
              marginBottom: '8px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              opacity: 0.7
            }}>
              Note:
            </div>
            <p style={{ ...premiumBodyStyle, margin: 0, fontSize: '0.9rem', fontWeight: 300, fontStyle: 'italic' }}>
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DrinksSpecialsSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'drinks-specials', 60);
    }, 60000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  return (
    <div
      id="drinks-specials"
      style={{
        marginBottom: '25px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
      }}
      className="active"
    >

      {/* Section Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
            Drink Specials
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
            Current weekly promotions and offers
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
          ACTIVE
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Intro Card */}
        <AnimatedCard
          title="🏷️ Decades Promotions"
          description="Stay updated with our current weekly specials. These offers are designed to drive engagement and volume across all floors."
          items={[
            'Signature Cocktails and Seasonal features',
            'Nightly specific specials',
            'Event-based promotional deals'
          ]}
        />

        {/* Schedule Grid */}
        <AnimatedCard title="🎯 Weekly Schedule">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <SpecialCard
              title="Thursday Night Specials"
              specials={[
                '$5 Miller Lites',
                '$6 Green Tea Shots',
                '$10 Margaritas'
              ]}
              hours="Until Midnight"
              notes="Drink tickets valid for rail drinks only"
            />

            <SpecialCard
              title="Friday Night Open Bar"
              specials={[
                'Don Julio Silver',
                'Surfside',
                '$12 Hennessy & Casamigos All Night'
              ]}
              hours="10:00 PM – 11:00 PM"
              notes="2000's or Opening floor only"
            />

            <SpecialCard
              title="Saturday Day Party (Rooftop)"
              specials={[
                'Patron Silver'
              ]}
              hours="4:00 PM - 5:00 PM"
            />
          </div>
        </AnimatedCard>


        {/* Progress Section */}
        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
