import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define the section color for Aloha POS - Green theme
const SECTION_COLOR = '#38A169'; // Green color for POS
const SECTION_COLOR_RGB = '56, 161, 105';

const TRAINING_VIDEOS = [
  {
    id: 'QkMhy-grvO8',
    title: 'Aloha POS functions',
    description: 'Step-by-step guide to split a check - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:27'
  },
  {
    id: 'H3JPBhvbNqc', 
    title: 'Aloha POS functions',
    description: 'Step-by-step guide to splitting payment Card/Cash - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:31'
  },
  {
    id: 'WFXIrzqOZvM',
    title: 'Aloha POS functions',
    description: 'Step-by-step guide to reprinting a CC receipt before closing the check - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:15'
  },
  {
    id: '4LYA10HUWek',
    title: 'Aloha POS functions',
    description: 'Step-by-step guide to reprinting a check after its been closed - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:21'
  },
  {
    id: 'LAxlHa7Y6aU',
    title: 'Card Reader Reboot',
    description: 'Step-by-step guide to rebooting the card reader - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:40'
  },
  {
    id: 'sGCBZewlNQo',
    title: 'Fix Item Hold',
    description: 'Step-by-step guide to fixing the HOLD on an item - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:16'
  },
  {
    id: 'neqSRTdVGaw',
    title: 'Cash Transactions',
    description: 'Step-by-step guide to cash transactions - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:19'
  },
  {
    id: 'LgWaFdrAw9M',
    title: 'POS Reboot',
    description: 'Step-by-step guide to how to reboot POS - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:34'
  },
  {
    id: 'Y-g-U6YpGGY',
    title: 'Start Comp Tab',
    description: 'Step-by-step guide to start a comp tab - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:15'
  },
  {
    id: 'aERsDspXHsw',
    title: 'Start Tab',
    description: 'Step-by-step guide to start a tab - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:22'
  },
  {
    id: 'e8Ms-UY4_7E',
    title: 'Close Tab',
    description: 'Step-by-step guide to close a tab - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:25'
  },
  {
    id: 'YZdPIyqYCSA',
    title: 'Handle Overring',
    description: 'Step-by-step guide to handle overring - Open in YouTube for full instructions',
    category: 'Aloha POS',
    duration: '0:23'
  }
];

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - green theme for POS
  const glowColors = [
    'linear-gradient(45deg, #38A169, #48BB78, transparent)', // Green
    'linear-gradient(45deg, #2F855A, #38A169, transparent)', // Dark Green
    'linear-gradient(45deg, #276749, #2F855A, transparent)', // Deeper Green
    'linear-gradient(45deg, #22543D, #276749, transparent)'  // Deep Green
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #48BB78, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(56, 161, 105, 0.1)' 
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

// Checklist Item Component
function ChecklistItem({ children, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.08)',
      borderRadius: '8px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      marginBottom: '8px',
      ...(isHovered && {
        background: `rgba(${SECTION_COLOR_RGB}, 0.15)`,
        borderColor: `rgba(${SECTION_COLOR_RGB}, 0.3)`,
        transform: 'translateX(5px)'
      })
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <input type="checkbox" style={{
        width: '18px',
        height: '18px',
        marginTop: '2px',
        cursor: 'pointer',
        accentColor: SECTION_COLOR
      }} />
      <span style={{ 
        color: 'rgba(255, 255, 255, 0.9)', 
        lineHeight: 1.4,
        fontSize: '0.9rem',
        flex: 1
      }}>
        {children}
      </span>
    </label>
  );
}

// YouTube Video Player with Single Click
function YouTubeVideo({ videoId, title, description, duration }: { 
  videoId: string; 
  title: string; 
  description: string;
  duration: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const baseVideoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`;
  const autoplayUrl = `${baseVideoUrl}&autoplay=1`;

  const handlePlay = () => {
    setShowOverlay(false);
    if (iframeRef.current) {
      iframeRef.current.src = autoplayUrl;
    }

    const getDurationInMs = () => {
      try {
        const [minutes, seconds] = duration.split(':').map(Number);
        return (minutes * 60 + seconds + 1) * 1000;
      } catch {
        return 61000;
      }
    };

    setTimeout(() => {
      setShowOverlay(true);
      if (iframeRef.current) {
        iframeRef.current.src = baseVideoUrl;
      }
    }, getDurationInMs());
  };

  return (
    <AnimatedCard title={title} index={0}>
      <p style={{ marginBottom: '15px', color: 'rgba(255, 255, 255, 0.9)' }}>{description}</p>
      
      <div style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#000'
      }}>
        <iframe
          ref={iframeRef}
          src={baseVideoUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
        
        {showOverlay && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={handlePlay}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${SECTION_COLOR_RGB}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '10px' }}>▶️</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>Click to Play</div>
            <div style={{ marginTop: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
              Duration: {duration}
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '10px', 
        fontSize: '0.9rem', 
        color: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>🔗 <a 
          href={`https://youtu.be/${videoId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: SECTION_COLOR,
            textDecoration: 'none',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.color = '#48BB78';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
            e.currentTarget.style.color = SECTION_COLOR;
          }}
        >
          Open in YouTube
        </a></span>
      </div>
    </AnimatedCard>
  );
}

// Category filter component
function CategoryFilter({ activeCategory, onCategoryChange }: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  const categories = ['All', ...new Set(TRAINING_VIDEOS.map(video => video.category))];
  
  return (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      margin: '20px',
      flexWrap: 'wrap'
    }}>
      {categories.map(category => {
        const [isHovered, setIsHovered] = useState(false);
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            style={{
              padding: '12px 18px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: activeCategory === category 
                ? `rgba(${SECTION_COLOR_RGB}, 0.2)` 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              borderColor: activeCategory === category 
                ? `rgba(${SECTION_COLOR_RGB}, 0.4)` 
                : 'rgba(255, 255, 255, 0.2)',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isHovered && activeCategory !== category 
                ? '0 4px 12px rgba(56, 161, 105, 0.2)' 
                : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default function AlohaPosSection() {
  const { currentUser } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  // Track section visit
  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'aloha-pos');
    }
  }, [currentUser]);

  // Filter videos by category
  const filteredVideos = TRAINING_VIDEOS.filter(video => 
    activeCategory === 'All' || video.category === activeCategory
  );

  const resetChecklists = () => {
    if (confirm('Reset all checklists?')) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        (checkbox as HTMLInputElement).checked = false;
      });
    }
  };

  return (
    <div 
      id="aloha-pos"
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
            Aloha POS System Guide
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Complete video training library for POS operations
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
          {TRAINING_VIDEOS.length} Videos
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Welcome Card */}
        <AnimatedCard
          title="🎯 Welcome to Aloha POS Training"
          index={1}
        >
          <p style={{ 
            margin: 0, 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}>
            Welcome to the Aloha POS Video Library. Here you'll find all the training videos 
            covering procedures and systems you'll use during your shift. Click on any video to start learning.
          </p>
        </AnimatedCard>

        {/* Category Filter */}
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />

        {/* Videos Grid */}
        <div>
          {filteredVideos.length === 0 ? (
            <AnimatedCard
              title="No Videos Found"
              index={2}
            >
              <p style={{ 
                textAlign: 'center', 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontStyle: 'italic',
                margin: 0
              }}>
                No videos found in this category.
              </p>
            </AnimatedCard>
          ) : (
            filteredVideos.map((video, index) => (
              <YouTubeVideo
                key={video.id}
                videoId={video.id}
                title={video.title}
                description={video.description}
                duration={video.duration}
              />
            ))
          )}
        </div>

        {/* POS Procedures Checklist */}
        <AnimatedCard
          title="✅ Essential POS Procedures Checklist"
          index={3}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ChecklistItem>Clock in using the POS system at start of shift</ChecklistItem>
            <ChecklistItem>Check daily specials and event board for updates</ChecklistItem>
            <ChecklistItem>Review reservation list and any special requests</ChecklistItem>
            <ChecklistItem>Verify card reader is functioning properly</ChecklistItem>
            <ChecklistItem>Test printer connectivity and paper levels</ChecklistItem>
            <ChecklistItem>Know how to split checks and process payments</ChecklistItem>
            <ChecklistItem>Understand how to handle comps and voids</ChecklistItem>
            <ChecklistItem>Complete end-of-shift reporting accurately</ChecklistItem>
          </div>
        </AnimatedCard>

        {/* Troubleshooting Checklist */}
        <AnimatedCard
          title="🔧 POS Troubleshooting Checklist"
          index={4}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ChecklistItem>Reboot POS system if unresponsive</ChecklistItem>
            <ChecklistItem>Check network connectivity for card processing</ChecklistItem>
            <ChecklistItem>Verify card reader cables are securely connected</ChecklistItem>
            <ChecklistItem>Restart printer and check paper levels</ChecklistItem>
            <ChecklistItem>Use card reader cleaner if cards aren't reading</ChecklistItem>
            <ChecklistItem>Contact manager for system override needs</ChecklistItem>
            <ChecklistItem>Document any persistent issues for IT</ChecklistItem>
          </div>
        </AnimatedCard>

        {/* Video Tips */}
        <AnimatedCard
          title="💡 Video Learning Tips"
          index={5}
        >
          <ul style={{ 
            margin: 0, 
            paddingLeft: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.6
          }}>
            <li>Click the fullscreen button for better viewing experience</li>
            <li>Use playback speed controls to watch at your preferred pace</li>
            <li>Take notes on important procedures and shortcuts</li>
            <li>Practice the steps shown in the videos during slow periods</li>
            <li>Contact a manager if you have questions after watching</li>
            <li>Bookmark frequently used procedures for quick reference</li>
          </ul>
        </AnimatedCard>

        {/* Reset Button */}
        <button 
          onClick={resetChecklists}
          style={{
            background: `linear-gradient(135deg, ${SECTION_COLOR}, #2F855A)`,
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            marginTop: '15px',
            boxShadow: '0 4px 15px rgba(56, 161, 105, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(56, 161, 105, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(56, 161, 105, 0.3)';
          }}
        >
          Reset All Checklists
        </button>

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <AnimatedCard
            title="📊 Training Progress"
            index={6}
          >
            <ProgressSection />
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}