
import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { goldTextStyle, brandFont, sectionHeaderStyle, cardHeaderStyle } from '@/lib/brand-styles';

// Define the section color for drinks specials
const SECTION_COLOR = '#4CAF50'; // Green color for drinks specials
const SECTION_COLOR_RGB = '76, 175, 80';

// Animated Card Component without Hover Effects
function AnimatedCard({ title, description, items, footer, index, children }: CardProps) {
  // Different glow colors for different cards - green theme for drinks specials
  const glowColors = [
    'linear-gradient(45deg, #4CAF50, #66BB6A, transparent)', // Green
    'linear-gradient(45deg, #66BB6A, #81C784, transparent)', // Light Green
    'linear-gradient(45deg, #43A047, #4CAF50, transparent)', // Dark Green
    'linear-gradient(45deg, #2E7D32, #4CAF50, transparent)'  // Deeper Green
  ];

  //const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #66BB6A, transparent)`;

  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        transition: 'none', // Removed cubic-bezier - caused browser crashes
        transform: 'translateY(0) scale(1)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.25), rgba(${SECTION_COLOR_RGB}, 0.1))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={cardHeaderStyle}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '20px' }}>
          {children || (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>{description}</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '0', marginTop: '15px' }}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '15px 20px',
            background: 'rgba(237, 242, 247, 0.15)',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Special Card Component without Hover Effects
function SpecialCard({ title, description, specials, hours, notes, index }: any) {
  const specialColors = [
    'linear-gradient(45deg, #4CAF50, transparent)', // Green
    'linear-gradient(45deg, #66BB6A, transparent)', // Light Green
    'linear-gradient(45deg, #43A047, transparent)', // Dark Green
    'linear-gradient(45deg, #2E7D32, transparent)'  // Deeper Green
  ];

  const specialColor = specialColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, transparent)`;

  return (
    <div
      style={{
        textAlign: 'left',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'none', // Removed - caused scroll crashes
        transform: 'translateY(0)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h5 style={{
          color: 'white',
          marginBottom: '15px',
          fontSize: '1.1rem',
          fontWeight: 600,
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
          paddingBottom: '8px',
          transition: 'all 0.3s ease'
        }}>
          {title}
        </h5>

        {description && (
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '15px',
            lineHeight: 1.5
          }}>
            {description}
          </p>
        )}

        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: SECTION_COLOR,
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Specials:
          </div>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {specials.map((special: string, idx: number) => (
              <li key={idx} style={{
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '4px',
                lineHeight: 1.4,
                fontSize: '0.9rem'
              }}>
                {special}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: SECTION_COLOR,
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Hours:
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontSize: '0.9rem'
          }}>
            {hours}
          </p>
        </div>

        {notes && (
          <div>
            <div style={{
              color: SECTION_COLOR,
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Note:
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              fontSize: '0.9rem',
              lineHeight: 1.4
            }}>
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

    // Wait 30 seconds then mark as complete
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'drinks-specials', 60);
      console.log('Section auto-completed after 60 seconds');
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentUser]);

  return (
    <div
      id="drinks-specials"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        WebkitBackdropFilter: 'blur(15px) saturate(170%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.5s ease'
      }}
      className="active"
    >

      {/* Section Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
        padding: '20px',
        borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={sectionHeaderStyle}>
            Drink Specials & Promotions
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Current weekly specials and promotional offers
          </p>
        </div>
        <span style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          color: 'white',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          Current
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <AnimatedCard
          title="🏷️ Decades Drink Specials"
          description="Stay updated with our current weekly specials and promotional offers. These specials are designed to enhance customer experience and drive sales during peak hours."
          items={[
            'Weekly rotating specials',
            'Happy hour promotions',
            'Seasonal offerings',
            'Floor-specific deals'
          ]}
          footer={{ left: 'Updated weekly', right: '💰 Promotions' }}
          index={0}
        />

        {/* Weekly Specials */}
        <AnimatedCard
          title="🎯 Weekly Specials Schedule"
          index={1}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <SpecialCard
              title="Thursday Night"
              specials={[
                '$5 Miller Lites',
                '$6 Green Tea Shots',
                '$10 Margaritas'
              ]}
              hours="Until Midnight"
              notes="Drink Tickets are for Rail Drinks Only"
              index={0}
            />

            {/* You can add more special cards for other days */}
            <SpecialCard
              title="Friday Happy Hour"
              specials={[
                '$4 Domestic Beers',
                '$6 Well Drinks',
                '$8 House Wines'
              ]}
              hours="5:00 PM - 8:00 PM"
              notes="Available on all floors"
              index={1}
            />

            <SpecialCard
              title="Saturday Specials"
              specials={[
                '$7 Craft Beers',
                '$9 Premium Cocktails',
                '$12 Premium Margaritas'
              ]}
              hours="All Night"
              notes="Rooftop exclusive after 10 PM"
              index={2}
            />
          </div>
        </AnimatedCard>

        {/* Promotional Guidelines */}
        <AnimatedCard
          title="📢 Promotion Guidelines"
          description="Follow these guidelines when promoting and serving specials to ensure consistency and excellent customer service."
          items={[
            'Always announce current specials to customers',
            'Upsell specials during peak hours',
            'Ensure proper pricing in POS system',
            'Follow portion control guidelines',
            'Report any promotion issues to manager'
          ]}
          footer={{ left: 'Essential procedures', right: '📋 Guidelines' }}
          index={2}
        />

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
