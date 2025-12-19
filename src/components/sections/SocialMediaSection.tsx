
import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { goldTextStyle, brandFont, sectionHeaderStyle, cardHeaderStyle } from '@/lib/brand-styles';

// Define the section color for social media
const SECTION_COLOR = '#9F7AEA'; // Purple color for social media
const SECTION_COLOR_RGB = '159, 122, 234';

// Animated Card Component without Hover Effects
function AnimatedCard({ title, description, items, footer, index, children }: CardProps) {
  // Different glow colors for different cards - purple theme for social media
  const glowColors = [
    'linear-gradient(45deg, #9F7AEA, #B794F4, transparent)', // Purple
    'linear-gradient(45deg, #805AD5, #9F7AEA, transparent)', // Dark Purple
    'linear-gradient(45deg, #6B46C1, #805AD5, transparent)', // Deeper Purple
    'linear-gradient(45deg, #553C9A, #6B46C1, transparent)'  // Deep Purple
  ];

  //const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #B794F4, transparent)`;

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
        cursor: 'pointer',
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

export default function SocialMediaSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Wait 60 seconds then mark as complete
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'social-media', 60);
      console.log('Section auto-completed after 30 seconds');
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentUser]);

  return (
    <div
      id="social-media"
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
            Social Media Promotions
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Marketing content and social media guidelines
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
          Marketing
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <AnimatedCard
          title="📱 Decades Social Media"
          description="Engage with our community and promote Decades through social media. Share the excitement and build our brand presence online."
          items={[
            'Instagram story highlights',
            'Facebook event promotions',
            'TikTok video content',
            'Twitter/X announcements'
          ]}
          footer={{ left: 'Brand building', right: '📊 Analytics' }}
          index={0}
        />

        {/* Content Guidelines */}
        <AnimatedCard
          title="🎯 Content Guidelines"
          description="Follow these guidelines when creating and sharing social media content for Decades."
          items={[
            'Always use high-quality photos and videos',
            'Tag @Decades in all posts',
            'Use approved hashtags: #DecadesNightlife #DecadesEvents',
            'Share behind-the-scenes content',
            'Promote upcoming events and specials'
          ]}
          footer={{ left: 'Best practices', right: '📝 Guidelines' }}
          index={1}
        />

        {/* Platform Specifics */}
        <AnimatedCard
          title="🌐 Platform Specifications"
          description="Optimize your content for each social media platform."
          items={[
            'Instagram: Square/vertical formats work best',
            'Facebook: Event-focused content with clear CTAs',
            'TikTok: Short, engaging videos with trending audio',
            'Twitter/X: Quick updates and engagement with followers'
          ]}
          footer={{ left: 'Multi-platform', right: '⚡ Optimized' }}
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
