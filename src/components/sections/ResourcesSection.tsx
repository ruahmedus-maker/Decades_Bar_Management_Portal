import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define the section color for resources
const SECTION_COLOR = '#8B5CF6'; // Purple color for resources
const SECTION_COLOR_RGB = '139, 92, 246';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - purple theme for resources
  const glowColors = [
    'linear-gradient(45deg, #8B5CF6, #A78BFA, transparent)',
    'linear-gradient(45deg, #A78BFA, #C4B5FD, transparent)',
    'linear-gradient(45deg, #7C3AED, #8B5CF6, transparent)',
    'linear-gradient(45deg, #6D28D9, #8B5CF6, transparent)'
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #A78BFA, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(139, 92, 246, 0.1)' 
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
          {children}
        </div>
      </div>
    </div>
  );
}

// Resource Item Component
function ResourceItem({ title, description, icon, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        padding: '20px',
        background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: isHovered 
          ? '1px solid rgba(139, 92, 246, 0.4)' 
          : '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '12px',
          background: `linear-gradient(45deg, rgba(${SECTION_COLOR_RGB}, 0.3), transparent)`,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
        <div style={{
          fontSize: '1.5rem',
          color: isHovered ? SECTION_COLOR : 'rgba(255, 255, 255, 0.7)',
          transition: 'color 0.3s ease',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div>
          <h5 style={{ 
            color: isHovered ? SECTION_COLOR : 'white', 
            margin: '0 0 8px 0',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'color 0.3s ease'
          }}>
            {title}
          </h5>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            margin: 0,
            fontSize: '0.9rem',
            lineHeight: 1.5
          }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesSection() {
  const { currentUser } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (!currentUser) return;

  // Wait 30 seconds then mark as complete
  timerRef.current = setTimeout(() => {
    trackSectionVisit(currentUser.email, 'resources', 30);
    console.log('Section auto-completed after 30 seconds');
  }, 30000);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [currentUser]);
  const resources = [
    {
      icon: '🍸',
      title: 'Cocktail Recipes',
      description: 'Complete guide to signature cocktails and classic recipes with measurements and preparation steps.'
    },
    {
      icon: '💻',
      title: 'POS Manual',
      description: 'Point of Sale system operation, troubleshooting, and best practices for efficient service.'
    },
    {
      icon: '🛡️',
      title: 'Safety Procedures',
      description: 'Emergency protocols, safety guidelines, and incident reporting procedures.'
    },
    {
      icon: '📦',
      title: 'Inventory Guide',
      description: 'Stock management, ordering procedures, and inventory control best practices.'
    },
    {
      icon: '🎉',
      title: 'Event Protocols',
      description: 'Special event procedures, checklists, and customer service standards.'
    },
    {
      icon: '👥',
      title: 'Customer Service',
      description: 'Guest interaction standards, conflict resolution, and service excellence guidelines.'
    },
    {
      icon: '🍺',
      title: 'Beer & Wine Guide',
      description: 'Comprehensive guide to our beer selection, wine list, and pairing recommendations.'
    },
    {
      icon: '🔧',
      title: 'Equipment Manuals',
      description: 'Operating instructions and troubleshooting for all venue equipment.'
    }
  ];

  return (
    <div 
      id="resources-section"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        WebkitBackdropFilter: 'blur(15px) saturate(170%)',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isHovered 
          ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(139, 92, 246, 0.15)'
          : '0 16px 50px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        animation: 'fadeIn 0.5s ease'
      }}
      className="active"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            Additional Resources
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Training materials, reference guides, and essential documentation
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
          Reference
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Resources Grid */}
        <AnimatedCard
          title="📚 Training & Reference Materials"
          description="Access all essential resources for your role at Decades Bar"
          index={0}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            {resources.map((resource, index) => (
              <ResourceItem
                key={index}
                title={resource.title}
                description={resource.description}
                icon={resource.icon}
                index={index}
              />
            ))}
          </div>
        </AnimatedCard>

        {/* Quick Access */}
        <AnimatedCard
          title="⚡ Quick Access"
          index={1}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            <button style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 15px rgba(${SECTION_COLOR_RGB}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              📋 Download Handbook
            </button>
            <button style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 15px rgba(${SECTION_COLOR_RGB}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              🎬 Training Videos
            </button>
            <button style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 15px rgba(${SECTION_COLOR_RGB}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              📞 Contact Support
            </button>
          </div>
        </AnimatedCard>

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}