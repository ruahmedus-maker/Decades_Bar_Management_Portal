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

// Floor Gallery Component
function FloorCard({ title, image, desc }: { title: string, image: string, desc: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        background: uiBackground,
        border: isHovered ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: isHovered ? '0 30px 60px rgba(0, 0, 0, 0.5)' : '0 10px 30px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        transform: isHovered ? 'scale(1.02) translateY(-5px)' : 'scale(1)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        height: '240px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img 
          src={image} 
          alt={title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            opacity: isHovered ? 0.9 : 1
          }} 
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <h4 style={{
            ...premiumWhiteStyle,
            margin: 0,
            fontSize: '1.2rem',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            {title}
          </h4>
        </div>
      </div>
      <div style={{ padding: '15px 20px', background: 'rgba(255,255,255,0.02)' }}>
        <p style={{ ...premiumBodyStyle, fontSize: '0.85rem', margin: 0, opacity: 0.8 }}>
          {desc}
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

      <div style={{ padding: '25px' }}>
        <DecadesIntroduction />

        <p style={{
          fontSize: '1.2rem',
          ...premiumBodyStyle,
          marginTop: '30px',
          marginBottom: '30px',
          textAlign: 'center',
          opacity: 0.9,
          letterSpacing: '1px'
        }}>
          Explore your specialized dashboard below to track your journey. 
          Detailed curriculum and roadmap are now available in the <strong>Training Library</strong>.
        </p>

        {/* Floor Gallery Section */}
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <h3 style={{ 
            ...sectionHeaderStyle, 
            ...premiumWhiteStyle, 
            textAlign: 'center', 
            fontSize: '1.5rem',
            letterSpacing: '5px',
            marginBottom: '30px'
          }}>
            Explore Decades
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            <FloorCard 
              title="Rooftop" 
              image="/images/floors/rooftop.webp" 
              desc="Open-air vibes and premium service under the stars."
            />
            <FloorCard 
              title="2000's Floor" 
              image="/images/floors/2000s_floor.webp" 
              desc="Nostalgic hits and a vibrant high-energy atmosphere."
            />
            <FloorCard 
              title="Hip Hop Floor" 
              image="/images/floors/hiphop_floor.webp" 
              desc="The best of urban music in a sleek, underground setting."
            />
            <FloorCard 
              title="VIP & Lounge" 
              image="/images/floors/vip_lounge.webp" 
              desc="Exclusive service and luxury seating for our elite guests."
            />
          </div>
        </div>

        <ProgressSection />
      </div>
    </div>
  );
}