// WelcomeSection.tsx - WITH COLORED GLOW EFFECTS
'use client';

import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

function DecadesIntroduction() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(212, 175, 55, 0.1)' 
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
      {/* Gold Glow Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '18px',
          background: 'linear-gradient(45deg, var(--accent), #c19b2a, transparent)',
          zIndex: -1,
          opacity: 0.6,
          animation: 'pulse 2s infinite'
        }} />
      )}
      
      <div style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{
            color: 'white', 
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            fontSize: '2.5rem',
            marginBottom: '10px',
            fontWeight: 700
          }}>
            🎵 Welcome to Decades 🎵
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.3rem',
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
            Where Every Floor is a Different Era
          </p>
        </div>
        
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <p style={{
            fontSize: '1.1rem', 
            color: 'rgba(255, 255, 255, 0.9)', 
            lineHeight: '1.6',
            textShadow: '0 1px 1px rgba(0, 0, 0, 0.1)'
          }}>
            Your journey to becoming an exceptional Decades bartender starts here. 
            This comprehensive training portal will guide you through everything you need to know 
            to excel in our high-volume, multi-floor nightclub environment.
          </p>
        </div>
      </div>
    </div>
  );
}

// Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards
  const glowColors = [
    'linear-gradient(45deg, #48bb78, #38a169, transparent)', // Green - Getting Started
    'linear-gradient(45deg, #4299e1, #3182ce, transparent)', // Blue - Video Training  
    'linear-gradient(45deg, #9f7aea, #805ad5, transparent)', // Purple - Cocktails
    'linear-gradient(45deg, #ed8936, #dd6b20, transparent)', // Orange - Operations
    'linear-gradient(45deg, #f56565, #e53e3e, transparent)', // Red - Floor Training
    'linear-gradient(45deg, #0bc5ea, #00b5d8, transparent)'  // Cyan - Progress Tracking
  ];

  const glowColor = glowColors[index] || 'linear-gradient(45deg, var(--accent), #c19b2a, transparent)';

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(212, 175, 55, 0.1)' 
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
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.1))',
          padding: '20px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
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
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>{description}</p>
          <ul style={{paddingLeft: '20px', marginBottom: '0', marginTop: '15px'}}>
            {items.map((item: string, i: number) => (
              <li key={i} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>{item}</li>
            ))}
          </ul>
        </div>
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
      </div>
    </div>
  );
}

// Week Day Component with Individual Colored Glows
function WeekDay({ icon, day, title, desc, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different colors for each day like original CSS
  const dayColors = [
    'linear-gradient(45deg, #48bb78, transparent)', // Green - Day 1
    'linear-gradient(45deg, #ed8936, transparent)', // Orange - Day 2
    'linear-gradient(45deg, #4299e1, transparent)', // Blue - Day 3
    'linear-gradient(45deg, #9f7aea, transparent)'  // Purple - Day 4
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
      {/* Individual Day Color Glow */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '14px',
          background: dayColor,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: '2.5rem', marginBottom: '15px', display: 'block' }}>{icon}</span>
        <h5 style={{
          color: 'white',
          marginBottom: '12px',
          fontSize: '1.1rem',
          fontWeight: 600
        }}>
          {day}
        </h5>
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          <strong>{title}</strong><br/>{desc}
        </p>
      </div>
    </div>
  );
}

export default function WelcomeSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!currentUser) return;
  
    // Wait 30 seconds then mark as complete
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'welcome', 30);
      console.log('Section auto-completed after 30 seconds');
    }, 30000);
  
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentUser]);

  const cardsData = [
    {
      title: '🚀 Getting Started Guide',
      description: 'Begin your Decades journey with our structured training program.',
      items: ['Review training materials & procedures', 'Study Decades-specific standards', 'Complete POS system training', 'Practice signature cocktail recipes'],
      footer: { left: 'Estimated: 2-3 days', right: '⭐ Essential' }
    },
    {
      title: '🎬 Video Training Library', 
      description: 'Watch our comprehensive training videos covering everything from Aloha POS operations to advanced mixology.',
      items: ['POS system tutorials', 'Pouring technique demonstrations', 'Cocktail preparation videos', 'Customer service scenarios'],
      footer: { left: '20+ training videos', right: '📺 Visual Learning' }
    },
    {
      title: '🍹 Decades Cocktail Recipes',
      description: 'Access our complete recipe database featuring Decades signature cocktails and classic preparations.',
      items: ['Signature Decades cocktails', 'Classic drink preparations', 'Seasonal specials', 'Garnishing & presentation guides'],
      footer: { left: '50+ recipes', right: '✨ Mixology' }
    },
    {
      title: '⚡ Bar Operations',
      description: 'Master the operational side of Decades including cleaning procedures and inventory management.',
      items: ['Daily cleaning checklists', 'Inventory & cost control', 'Closing procedures', 'Rush hour strategies'],
      footer: { left: 'Essential Procedures', right: '🛠️ Operations' }
    },
    {
      title: '🎵 Floor-Specific Training',
      description: 'Learn the unique requirements and service styles for each Decades floor.',
      items: ['2000\'s Floor procedures', 'Hip Hop Floor service', 'Rooftop bottle service', 'Floor-specific cocktails'],
      footer: { left: 'Multi-floor expertise', right: '🏢 Environment' }
    },
    {
      title: '📊 Progress Tracking',
      description: 'Monitor your training progress and completion status across all sections.',
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
    }} className="active" id="welcome">
      
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
        <h3 style={{
          color: '#ffffff',
          fontSize: '1.4rem',
          fontWeight: 700,
          margin: 0,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}>
          Welcome to Your Training Hub
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
          New
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        <DecadesIntroduction />

        <p style={{
          fontSize: '1.1rem', 
          lineHeight: '1.6', 
          marginBottom: '25px',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          Welcome to the Decades Bar Resource Center, your comprehensive guide to excellence in high-volume nightclub bartending. 
          This portal contains everything you need to master our procedures, signature cocktails, customer service standards, and more.
        </p>
        
        {/* Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '25px',
          margin: '25px 0'
        }}>
          {cardsData.map((card, index) => (
            <AnimatedCard key={index} {...card} index={index} />
          ))}
        </div>

        {/* Quick Start Guide */}
        <div style={{
          borderRadius: '16px',
          margin: '25px 0 0 0',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transition: 'all 0.4s ease',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Gold Glow for Quick Start Card */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            borderRadius: '18px',
            background: 'linear-gradient(45deg, var(--accent), #c19b2a, transparent)',
            zIndex: 0,
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }} className="quick-start-glow" />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.1))',
              padding: '20px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <h4 style={{
                color: '#ffffff',
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: 600
              }}>
                🎯 Your First Week at Decades
              </h4>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {weekData.map((week, index) => (
                  <WeekDay key={index} {...week} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProgressSection />
    </div>
  );
}