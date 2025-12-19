
import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { goldTextStyle, brandFont, sectionHeaderStyle, cardHeaderStyle } from '@/lib/brand-styles';
import GoldHeading from '../ui/GoldHeading';

// Card Component without Hover Effects
function AnimatedCard({ title, children, glowColor = 'linear-gradient(45deg, var(--accent), #c19b2a, transparent)' }: CardProps) {
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
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.1))',
          padding: '20px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={cardHeaderStyle}>
            <GoldHeading text={title} />
          </h4>
        </div>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Week Day Component without Hover Effects
function WeekDay({ title, children, index, highlight }: any) {
  const dayColors = [
    'linear-gradient(45deg, #48bb78, transparent)', // Green
    'linear-gradient(45deg, #ed8936, transparent)', // Orange
    'linear-gradient(45deg, #4299e1, transparent)', // Blue
    'linear-gradient(45deg, #9f7aea, transparent)'  // Purple
  ];

  const dayColor = dayColors[index] || 'linear-gradient(45deg, var(--accent), transparent)';

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
          marginBottom: '12px',
          fontSize: '1.1rem',
          fontWeight: 600
        }}>
          {title}
        </h5>
        {highlight && (
          <div style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: 'var(--accent)',
            background: 'rgba(212, 175, 55, 0.2)',
            padding: '8px 12px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {highlight}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default function TrainingMaterials() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Wait 60 seconds then mark as complete
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'training', 60);
      console.log('Section auto-completed after 60 seconds');
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentUser]);
  return (
    <div style={{
      marginBottom: '30px',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px) saturate(170%)',
      WebkitBackdropFilter: 'blur(15px) saturate(170%)',
      border: '1px solid rgba(255, 255, 255, 0.22)',
      boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
      animation: 'fadeIn 0.5s ease'
    }} className="active" id="training">

      {/* Section Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.15))',
        padding: '20px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={sectionHeaderStyle}>
          <GoldHeading text="Training Materials" />
        </h3>
        <span style={{
          background: 'linear-gradient(135deg, var(--accent), #c19b2a)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
        }}>
          Updated
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Getting Started Card */}
        <AnimatedCard
          title="🎯 Getting Started - Your Training Roadmap"
          glowColor="linear-gradient(45deg, #48bb78, #38a169, transparent)"
        >
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.1rem',
            marginBottom: '20px',
            lineHeight: '1.6'
          }}>
            Welcome to Decades! Follow this structured learning path to master your role as a bartender in our high-volume night club environment.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            <WeekDay title="📚 Phase 1: Foundation Knowledge" index={0}>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li>Review this Training Section</li>
                <li>Study Drink Recipes & Glassware Guide</li>
                <li>Learn Bar Cleaning Procedures</li>
                <li>Understand POS System Basics</li>
              </ul>
            </WeekDay>
            <WeekDay title="🛠️ Phase 2: Practical Training" index={1}>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li>Shadow experienced bartenders</li>
                <li>Practice pouring techniques</li>
                <li>Learn floor-specific workflows</li>
                <li>Master closing procedures</li>
              </ul>
            </WeekDay>
            <WeekDay title="🎓 Phase 3: Mastery & Independence" index={2}>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li>Solo shifts with support</li>
                <li>Speed and efficiency training</li>
                <li>Customer service excellence</li>
                <li>Final proficiency assessment</li>
              </ul>
            </WeekDay>
          </div>
        </AnimatedCard>

        {/* Decades Standards Card */}
        <AnimatedCard
          title="⚡ Decades Bar Standards"
          glowColor="linear-gradient(45deg, #4299e1, #3182ce, transparent)"
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            <WeekDay title="Pouring Standards" index={0}>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li><strong>Standard Cocktail Pour:</strong> 1.5oz</li>
                <li><strong>Straight Shot Pour:</strong> ~1.25oz (just below shot glass rim)</li>
                <li><strong>Premium Pour:</strong> 2oz (for top-shelf spirits)</li>
                <li><strong>Wine Pour:</strong> 6oz (5oz for sparkling)</li>
              </ul>
            </WeekDay>
            <WeekDay title="Speed Expectations" index={1}>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li><strong>Simple Cocktails:</strong> 30-45 seconds</li>
                <li><strong>Complex Cocktails:</strong> 60-90 seconds</li>
                <li><strong>Beer/Shot Orders:</strong> 15-20 seconds</li>
                <li><strong>Rush Hour Goal:</strong> 2-3 customers/minute</li>
              </ul>
            </WeekDay>
            <WeekDay title="Quality Standards" index={2}>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li>All drinks measured (no free pouring)</li>
                <li>Garnishes fresh and consistent</li>
                <li>Glassware spotless and chilled when required</li>
                <li>Station organized and clean at all times</li>
              </ul>
            </WeekDay>
          </div>
        </AnimatedCard>

        {/* Training Schedule Card */}
        <AnimatedCard
          title="📅 Training Schedule & Floor Assignments"
          glowColor="linear-gradient(45deg, #9f7aea, #805ad5, transparent)"
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
          }}>
            <WeekDay title="Friday Training" index={0} highlight="2000's Floor">
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li>Focus on mainstream cocktails</li>
                <li>High-volume service training</li>
                <li>Group ordering techniques</li>
                <li>Time management skills</li>
              </ul>
            </WeekDay>
            <WeekDay title="Saturday Training" index={1} highlight="Hip Hop & Rooftop">
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li>Premium service techniques</li>
                <li>Bottle service protocols</li>
                <li>VIP customer handling</li>
                <li>Upselling strategies</li>
              </ul>
            </WeekDay>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            marginTop: '20px'
          }}>
            <h5 style={{
              color: 'white',
              marginBottom: '15px',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              🎯 First Shift Focus: Watch & Learn
            </h5>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>
              <strong>Your primary goal during the first shift is OBSERVATION.</strong> Pay close attention to how experienced bartenders:
            </p>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '15px'
            }}>
              <li>Handle multiple drink orders simultaneously</li>
              <li>Manage customer interactions during peak hours</li>
              <li>Maintain organization in their workspace</li>
              <li>Use the POS system efficiently</li>
              <li>Communicate with barbacks and other staff</li>
              <li>Handle difficult situations or customers</li>
            </ul>
            <p style={{
              fontStyle: 'italic',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              Take mental notes and ask thoughtful questions during slower moments.
            </p>
          </div>
        </AnimatedCard>

        {/* Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '25px',
          margin: '25px 0'
        }}>
          {/* Bartending Fundamentals Card */}
          <AnimatedCard
            title="🧪 Bartending Fundamentals"
            glowColor="linear-gradient(45deg, #ed8936, #dd6b20, transparent)"
          >
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>
              <strong>Learning Path:</strong> Start with basic techniques before moving to complex cocktails
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <h5 style={{
                color: 'white',
                marginBottom: '10px',
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Practice Sequence:
              </h5>
              <ol style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li>Master pouring accuracy with water bottles</li>
                <li>Learn Decades signature drink recipes</li>
                <li>Practice multi-drink order workflow</li>
                <li>Speed building under supervision</li>
              </ol>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <strong>Pouring Techniques:</strong> Always use jiggers - 1.5oz standard pour, 1.25oz for straight shots
              </li>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <strong>Mixing Methods:</strong> Shake until tin frosts, stir for 30 seconds for spirit-forward drinks
              </li>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <strong>Glassware Knowledge:</strong> Refer to Glassware Guide section for proper glass selection
              </li>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <strong>Garnishing:</strong> Citrus wheels cut fresh daily, herbs inspected for freshness
              </li>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <strong>Product Knowledge:</strong> Focus on top 20 most used spirits first
              </li>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 0'
              }}>
                <strong>Speed & Efficiency:</strong> "Two-hand" working - always be doing two things at once
              </li>
            </ul>
          </AnimatedCard>

          {/* Add more cards here following the same pattern */}
        </div>
      </div>

      <ProgressSection />

    </div>

  );

}
