

import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';

// Define the section color for uniform guide
const SECTION_COLOR = '#9F7AEA'; // Purple color for uniforms
const SECTION_COLOR_RGB = '159, 122, 234';

// Animated Card Component without Hover Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  // Different glow colors for different cards - purple theme for uniforms
  const glowColors = [
    'linear-gradient(45deg, #9F7AEA, #B794F4, transparent)', // Purple
    'linear-gradient(45deg, #805AD5, #9F7AEA, transparent)', // Dark Purple
    'linear-gradient(45deg, #6B46C1, #805AD5, transparent)', // Deeper Purple
    'linear-gradient(45deg, #553C9A, #6B46C1, transparent)'  // Deep Purple
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #B794F4, transparent)`;

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
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
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
          <h4 style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 600
          }}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '20px' }}>
          {children || (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>{description}</p>
              <ul style={{paddingLeft: '20px', marginBottom: '0', marginTop: '15px'}}>
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

// Uniform Card Component without Hover Effects
function UniformCard({ title, items, index }: any) {
  const uniformColors = [
    'linear-gradient(45deg, #9F7AEA, transparent)', // Purple
    'linear-gradient(45deg, #805AD5, transparent)', // Dark Purple
    'linear-gradient(45deg, #6B46C1, transparent)'  // Deeper Purple
  ];

  const uniformColor = uniformColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, transparent)`;

  return (
    <div 
      style={{
        textAlign: 'left',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s ease',
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
        
        <div style={{ marginBottom: '15px' }}>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {items.map((item: string, idx: number) => (
              <li key={idx} style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '8px', 
                lineHeight: 1.4,
                fontSize: '0.9rem'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function UniformGuideSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (!currentUser) return;

  // Wait 60 seconds then mark as complete
  timerRef.current = setTimeout(() => {
    trackSectionVisit(currentUser.email, 'uniform-guide', 60);
    console.log('Section auto-completed after 60 seconds');
  }, 60000);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [currentUser]);

  const uniformData = [
    {
      title: '👔 Fellas',
      items: [
        'Black Decades branded shirt',
        'Concept Themed T-shirts - Genre of Music/Culture according to floor',
        'Trending Urban Wear - Must be fly',
        'Special event attire will be communicated 1 week in advance',
        'No sweat pants',
        '',
        'Grooming Standards:',
        'Hair must be neat and styled'
      ]
    },
    {
      title: '👗 Ladies',
      items: [
        'Concept themed - Optional',
        'Mostly do your thing because you always look good',
        'Special event attire will be communicated 1 week in advance',
        'No sweat pants',
        'Must not look like Cocktail waitress\'',
        '',
        'Grooming Standards:',
        'Must have your hair did and your make up on'
      ]
    },
    {
      title: '✨ Appearance Standards',
      items: [
        'Professional Presentation:',
        'Uniform must be clean and presentable',
        'Facial hair must be well-groomed',
        '',
        'Personal Hygiene:',
        'Daily shower recommended before shift',
        'Use of deodorant/antiperspirant'
      ]
    }
  ];

  return (
    <div 
      id="uniform-guide"
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
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Uniform Guidelines
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Professional appearance standards for Decades staff
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
          Updated
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <AnimatedCard
          title="👔 Decades Uniform Standards"
          description="Maintain the Decades brand image with our professional uniform guidelines. Each team member represents our commitment to excellence in nightlife hospitality."
          items={[
            'Branded and themed attire options',
            'Professional grooming standards',
            'Floor-specific uniform requirements',
            'Special event dress codes'
          ]}
          footer={{ left: 'Professional standards', right: '✨ Appearance' }}
          index={0}
        />

        {/* Uniform Categories */}
        <AnimatedCard
          title="🎭 Uniform Categories"
          index={1}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {uniformData.map((uniform, index) => (
              <UniformCard
                key={index}
                title={uniform.title}
                items={uniform.items}
                index={index}
              />
            ))}
          </div>
        </AnimatedCard>

        {/* Additional Guidelines */}
        <AnimatedCard
          title="📋 Additional Guidelines"
          description="Important reminders for maintaining professional standards"
          items={[
            'All attire must be clean and presentable',
            'Follow floor-specific theme requirements',
            'Special event attire communicated 1 week in advance',
            'No sweat pants allowed',
            'Maintain personal hygiene standards'
          ]}
          footer={{ left: 'Essential reminders', right: '📝 Guidelines' }}
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
