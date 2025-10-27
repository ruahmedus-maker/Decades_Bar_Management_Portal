import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define the section color for social media
const SECTION_COLOR = '#9F7AEA'; // Purple color for social media
const SECTION_COLOR_RGB = '159, 122, 234';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - purple theme for social media
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
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(159, 122, 234, 0.1)' 
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

export default function SocialMediaSection() {
  const { currentUser } = useApp();

  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'social-media');
    }
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
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
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