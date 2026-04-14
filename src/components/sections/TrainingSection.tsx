import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';


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
    items: ['Review training materials & procedures', 'Study Decades-specific standards', 'Review POS system training videos', 'Learn Signature & Feature cocktail recipes'],
    footer: { left: 'Estimated: 1-2 days', right: '⭐ Essential' }
  },
  {
    title: '📖 Standard Operating Procedures',
    description: 'Learn set-up and closing procedures for all floors.',
    items: ['Set-up checklist', 'Closing checklist', 'Cleaning checklist'],
    footer: { left: 'Procedure tracking and notifications', right: '📖 Reading' }
  },
  {
    title: '🎬 Video Training Library',
    description: 'Watch comprehensive training videos covering operations and mixology.',
    items: ['POS system tutorials', 'Cleaning procedures'],
    footer: { left: '20+ training videos', right: '📺 Visual' }
  },
  {
    title: '🍹 Cocktail Recipes',
    description: 'Access our complete recipe database featuring classic cocktails.',
    items: ['Signature Decades cocktails', 'Classic drink preparations', 'Seasonal specials', 'Garnishing & presentation'],
    footer: { left: '50+ recipes', right: '✨ Mixology' }
  },
  {
    title: '🍸 Glassware Guide',
    description: 'Learn about the different types of glassware used at Decades and how to present them properly.',
    items: ['All glassware used at Decades', 'How to present glassware properly'],
    footer: { left: 'Essential Reference', right: '🍸 Presentation' }
  },
  {
    title: '👔 Uniform & Appearance',
    description: 'Learn about the uniform and appearance standards at Decades.',
    items: ['Uniform standards', 'Appearance standards'],
    footer: { left: 'Dress Code', right: '👔 Professional' }
  },
  {
    title: '🧹 Bar Cleanings',
    description: 'Learn about the bar cleaning procedures at Decades.',
    items: ['Bar cleaning checklist', 'Bar cleaning procedures and scheduled dates'],
    footer: { left: 'Sanitation Focus', right: '🧹 Cleaning' }
  },
  {
    title: '📱 Social Media',
    description: 'Learn about required social media posts and how to post them.',
    items: ['Social Media resources', 'Brand guidelines'],
    footer: { left: 'Digital Presence', right: '📱 Marketing' }
  },
  {
    title: '💰 Comps and Voids',
    description: 'Learn how to create comp tabs and procedures for voids.',
    items: ['Required format for comp tabs', 'Void procedures', 'Authorization limits'],
    footer: { left: 'Financial Protocol', right: '💰 Transactions' }
  },
  {
    title: '📄 Policies',
    description: 'Learn about the official policies and guidelines at Decades.',
    items: ['Decades specific policies', 'General workplace policies'],
    footer: { left: 'Official Handbook', right: '📄 Compliance' }
  },
];

const weekData = [
  { icon: '📚', day: 'Days 1-2', title: 'Portal Review', desc: 'Complete all training sections in this portal' },
  { icon: '👀', day: 'Day 3', title: 'Observational Shift', desc: 'Shadow on 2000\'s/2010\'s Floors - focus on learning work flow patterns and practicing them' },
  { icon: '🛠️', day: 'Day 4', title: 'Hands-On Training', desc: 'Work on Hip Hop & Rooftop floors' },
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


        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
