import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define the section color for glassware guide
const SECTION_COLOR = '#4299E1'; // Blue color for glassware
const SECTION_COLOR_RGB = '66, 153, 225';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - blue theme for glassware
  const glowColors = [
    'linear-gradient(45deg, #4299E1, #63B3ED, transparent)', // Blue
    'linear-gradient(45deg, #3182CE, #4299E1, transparent)', // Dark Blue
    'linear-gradient(45deg, #2B6CB0, #3182CE, transparent)', // Deeper Blue
    'linear-gradient(45deg, #2C5282, #2B6CB0, transparent)'  // Navy Blue
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #63B3ED, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(66, 153, 225, 0.1)' 
          : '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: isHovered ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: isHovered ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(160%)',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.18)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Colored Glow Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '18px',
          background: glowColor,
          zIndex: 0,
          opacity: 0.7,
          animation: 'pulse 2s infinite'
        }} />
      )}
      
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

// Glassware Card Component with Enhanced Glow Effects
function GlasswareCard({ title, primaryUse, includes, note, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  const glasswareColors = [
    'linear-gradient(45deg, #4299E1, transparent)', // Blue
    'linear-gradient(45deg, #3182CE, transparent)', // Dark Blue
    'linear-gradient(45deg, #2B6CB0, transparent)'  // Deeper Blue
  ];

  const glasswareColor = glasswareColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, transparent)`;

  return (
    <div 
      style={{
        textAlign: 'left',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        backdropFilter: isHovered ? 'blur(15px)' : 'blur(8px)',
        WebkitBackdropFilter: isHovered ? 'blur(15px)' : 'blur(8px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Individual Glassware Color Glow */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '14px',
          background: glasswareColor,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h5 style={{
          color: isHovered ? SECTION_COLOR : 'white',
          marginBottom: '15px',
          fontSize: '1.1rem',
          fontWeight: 600,
          borderBottom: `1px solid ${isHovered ? `rgba(${SECTION_COLOR_RGB}, 0.6)` : `rgba(${SECTION_COLOR_RGB}, 0.3)`}`,
          paddingBottom: '8px',
          transition: 'all 0.3s ease',
          textShadow: isHovered ? `0 0 10px rgba(${SECTION_COLOR_RGB}, 0.3)` : 'none'
        }}>
          {title}
        </h5>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: SECTION_COLOR,
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Primary Use:
          </div>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            margin: 0,
            lineHeight: 1.5,
            fontSize: '0.9rem'
          }}>
            {primaryUse}
          </p>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: SECTION_COLOR,
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Includes:
          </div>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {includes.map((item: string, idx: number) => (
              <li key={idx} style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '4px', 
                lineHeight: 1.4,
                fontSize: '0.9rem'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        {note && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: `rgba(${SECTION_COLOR_RGB}, 0.1)`,
            border: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
            borderRadius: '8px'
          }}>
            <div style={{
              color: SECTION_COLOR,
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              Note:
            </div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              margin: 0,
              fontSize: '0.85rem',
              lineHeight: 1.4,
              fontStyle: 'italic'
            }}>
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

  // Wait 30 seconds then mark as complete
  timerRef.current = setTimeout(() => {
    trackSectionVisit(currentUser.email, 'glassware-guide', 30);
    console.log('Section auto-completed after 30 seconds');
  }, 30000);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [currentUser]);

  const glasswareData = [
    {
      title: 'Decades Large Branded Glass',
      primaryUse: 'High-volume cocktails and mixed drinks',
      includes: [
        'Water, Juice, and Soda',
        'Any Long Island Iced Tea variations',
        'Any cocktail with Red Bull',
        'Bombs for Red Bull',
        'Decades Signature/Seasonal feature cocktails',
        'Any "double" cocktail'
      ],
      note: 'May be used as a double shooter upon specific customer request'
    },
    {
      title: 'Decades Frosted Glass',
      primaryUse: 'Spirit-forward drinks served without large-volume mixers',
      includes: [
        'Single or double "neat" pours of any liquor',
        'Single-pour cocktails (e.g., Vodka & Soda, Rum & Coke)',
        'Single or double pours of liquor "on the rocks"',
        'Any request for a Neat/Straight Up shot (e.g., Bourbon Neat, Scotch Straight Up)'
      ],
      note: null
    },
    {
      title: 'Decades Shot Glass',
      primaryUse: 'All shot servings',
      includes: [
        'Shots of liquor',
        'All shooters'
      ],
      note: 'All shots are to be poured below the rim'
    }
  ];

  return (
    <div 
      id="glassware-guide"
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
            Glassware Guide
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Proper glassware selection and usage guidelines
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
          3 Glass Types
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <AnimatedCard
          title="🥃 Decades Glassware Standards"
          description="Master the art of proper glassware selection. Each glass type is specifically designed for different drink categories to ensure optimal presentation and customer experience."
          items={[
            'Large Branded Glass - High-volume cocktails',
            'Frosted Glass - Spirit-forward drinks', 
            'Shot Glass - All shot servings',
            'Thursday security protocols'
          ]}
          footer={{ left: 'Essential knowledge', right: '📋 Standards' }}
          index={0}
        />

        {/* Glassware Grid */}
        <AnimatedCard
          title="🍶 Glassware Types & Uses"
          index={1}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {glasswareData.map((glassware, index) => (
              <GlasswareCard
                key={index}
                title={glassware.title}
                primaryUse={glassware.primaryUse}
                includes={glassware.includes}
                note={glassware.note}
                index={index}
              />
            ))}
          </div>
        </AnimatedCard>

        {/* Thursday Policy */}
        <AnimatedCard
          title="⚠️ Important Thursday Policy"
          description="Security & Underage Drinking Protocol"
          items={[
            'On Thursdays, all cocktails normally served in Large Branded Glass must use Frosted Glass',
            'This includes Long Island Iced Teas, cocktails with Red Bull, and double cocktails',
            'Please adhere to this policy for the entire Thursday night operation'
          ]}
          footer={{ left: 'Security protocol', right: '🔒 Required' }}
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