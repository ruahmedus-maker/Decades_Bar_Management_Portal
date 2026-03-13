// WelcomeSection.tsx - ALOHA STYLE UNIFORMITY
'use client';

import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';


function DecadesIntroduction() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
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
      {/* Subtle White Glow Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '18px',
          background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent)',
          zIndex: -1,
          opacity: 0.6,
        }} />
      )}

      <div style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{
            fontFamily: brandFont,
            fontSize: '2.2rem',
            margin: 0,
            ...premiumWhiteStyle,
            letterSpacing: '6px', // Match Sidebar Logo
            fontWeight: 100 // Match Sidebar Logo
          }}>
            Welcome to Decades
          </h1>
          <p style={{
            ...premiumBodyStyle,
            fontSize: '1.2rem',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            opacity: 0.8,
            marginTop: '10px'
          }}>
            Where Every Floor is a Different Era
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{
            fontSize: '1.1rem',
            ...premiumBodyStyle,
            maxWidth: '800px',
            margin: '0 auto'
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

// Card Component with Subtle UI Consistency
function AnimatedCard({ title, description, items, footer, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
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
      {/* Colored Glow Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '18px',
          background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent)',
          zIndex: 0,
          opacity: 0.7,
        }} />
      )}

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
          padding: '15px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          fontSize: '0.8rem',
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

// Week Day Component with Sidebar Consistency
function WeekDay({ icon, day, title, desc, index }: any) {
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
          background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent)',
          zIndex: 0,
          opacity: 0.6
        }} />
      )}

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

export default function WelcomeSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Wait 60 seconds then mark as complete
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'welcome', 60);
      console.log('Section auto-completed after 60 seconds');
    }, 60000);

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
      title: '🏢 Floor Training',
      description: 'Learn unique requirements and service styles for each floor.',
      items: ['2000\'s Floor procedures', 'Hip Hop Floor service', 'Rooftop bottle service', 'Floor-specific cocktails'],
      footer: { left: 'All Floors', right: '📍 Environment' }
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

  return (
    <div style={{
      marginBottom: '30px',
      borderRadius: '20px',
      overflow: 'hidden',
      background: uiBackground,
      backdropFilter: uiBackdropFilter,
      WebkitBackdropFilter: uiBackdropFilterWebkit,
      border: '1px solid rgba(255, 255, 255, 0.22)',
      boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
      animation: 'fadeIn 0.5s ease'
    }} className="active" id="welcome">

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
        <h3 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
          Training Hub
        </h3>
        <span style={{
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 300,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          Portal Active
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        <DecadesIntroduction />

        <p style={{
          fontSize: '1.1rem',
          ...premiumBodyStyle,
          marginBottom: '25px',
          textAlign: 'center',
          opacity: 0.9
        }}>
          Welcome to the Decades Bar Management System, your comprehensive guide to excellence.
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
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: uiBackdropFilter,
          WebkitBackdropFilter: uiBackdropFilterWebkit,
          border: '1px solid rgba(255, 255, 255, 0.12)',
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
            background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent)',
            zIndex: 0,
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }} className="quick-start-glow" />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)'
            }}>
              <h4 style={{ ...cardHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
                🎯 Your First Week
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