import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Standard Aloha Blue Background (No section-specific green)
const SECTION_BLUE = 'rgba(37, 99, 235, 0.2)';

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

// SIMPLE Card Component - ALOHA STYLED
function SimpleCard({ title, description, items, footer, children }: any) {
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
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
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
        <div style={{ padding: '16px 20px' }}>
          {children || (
            <>
              <p style={{ ...premiumBodyStyle, marginBottom: '12px', fontSize: '0.95rem' }}>{description}</p>
              <ul style={{ paddingLeft: '18px', marginBottom: '0', marginTop: '12px' }}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ ...premiumBodyStyle, marginBottom: '6px', fontSize: '0.9rem' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Checklist Item - ALOHA STYLED
function ChecklistItem({ children }: any) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      marginBottom: '8px',
      transition: 'all 0.2s ease'
    }}>
      <input type="checkbox" style={{
        width: '18px',
        height: '18px',
        marginTop: '2px',
        cursor: 'pointer',
        accentColor: '#3B82F6'
      }} />
      <span style={{
        ...premiumBodyStyle,
        fontSize: '0.95rem',
        flex: 1,
        fontWeight: 300
      }}>
        {children}
      </span>
    </label>
  );
}

// YouTube Video Player - ALOHA STYLED
function YouTubeVideo({ videoId, title, description, duration }: {
  videoId: string;
  title: string;
  description: string;
  duration: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);

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
    <SimpleCard title={title}>
      <p style={{ ...premiumBodyStyle, marginBottom: '12px', opacity: 0.9 }}>{description}</p>

      <div style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: '#000',
        border: '1px solid rgba(255, 255, 255, 0.1)'
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
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onClick={handlePlay}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>▶️</div>
            <div style={{
              ...premiumWhiteStyle,
              fontSize: '1rem',
              letterSpacing: '2px',
              fontWeight: 300
            }}>Click to Play</div>
            <div style={{
              marginTop: '8px',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '1px'
            }}>
              DURATION: {duration}
            </div>
          </div>
        )}
      </div>

      <div style={{
        marginTop: '12px',
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        letterSpacing: '1.5px',
        textTransform: 'uppercase'
      }}>
        <span><a
          href={`https://youtu.be/${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#FFFFFF',
            textDecoration: 'underline',
            opacity: 0.7
          }}
        >
          YouTube Link
        </a></span>
      </div>
    </SimpleCard>
  );
}

// Simple Category Filter - ALOHA STYLED
function CategoryFilter({ activeCategory, onCategoryChange }: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  const categories = ['All', ...new Set(TRAINING_VIDEOS.map(video => video.category))];

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      margin: '16px 0',
      flexWrap: 'wrap'
    }}>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: activeCategory === category
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 300,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
            boxShadow: activeCategory === category ? '0 4px 12px rgba(255, 255, 255, 0.1)' : 'none'
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default function AlohaPosSection() {
  const { currentUser } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Wait 60 seconds then mark as complete
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'aloha-pos', 60);
      console.log('Section auto-completed after 60 seconds');
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
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
        <div>
          <h3 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
            Aloha POS Guide
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.7,
            color: 'white',
            fontSize: '0.8rem',
            marginTop: '4px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Video training library for POS operations
          </p>
        </div>
        <span style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          color: 'white',
          fontWeight: 300,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          letterSpacing: '1px'
        }}>
          {TRAINING_VIDEOS.length} MODULES
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Welcome Card */}
        <SimpleCard
          title="🎯 System Training"
        >
          <p style={{
            margin: 0,
            ...premiumBodyStyle,
            fontSize: '0.95rem',
            opacity: 0.9
          }}>
            Welcome to the Aloha POS Video Library. Here you&apos;ll find all the training videos
            covering procedures and systems you&apos;ll use during your shift.
          </p>
        </SimpleCard>

        {/* Category Filter */}
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Videos Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {filteredVideos.length === 0 ? (
            <SimpleCard
              title="No Videos Found"
            >
              <p style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic',
                margin: 0
              }}>
                No modules found in this category.
              </p>
            </SimpleCard>
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

        <div style={{ marginTop: '10px' }}>
          {/* Troubleshooting Checklist */}
          <SimpleCard
            title="🔧 Troubleshooting"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <ChecklistItem>Reboot POS system if unresponsive</ChecklistItem>
              <ChecklistItem>Verify card reader cables are securely connected</ChecklistItem>
              <ChecklistItem>Restart printer and check paper levels if register won't open for cash transactions</ChecklistItem>
              <ChecklistItem>Use card reader cleaner if cards aren&apos;t reading</ChecklistItem>
              <ChecklistItem>Contact manager for system override needs</ChecklistItem>
              <ChecklistItem>Document any persistent issues and report to manager</ChecklistItem>
            </div>
          </SimpleCard>
        </div>

        {/* Video Tips */}
        <SimpleCard
          title="💡 Learning Tips"
        >
          <ul style={{
            margin: 0,
            paddingLeft: '18px',
            ...premiumBodyStyle,
            opacity: 0.9,
            fontSize: '0.9rem'
          }}>
            <li style={{ marginBottom: '8px' }}>Click the fullscreen button for better viewing experience</li>
            <li style={{ marginBottom: '8px' }}>Use playback speed controls to watch at your preferred pace</li>
            <li style={{ marginBottom: '8px' }}>Take notes on important procedures and shortcuts</li>
            <li style={{ marginBottom: '8px' }}>Practice the steps shown in the videos during slow periods</li>
          </ul>
        </SimpleCard>

        {/* Reset Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={resetChecklists}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 30px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 300,
              fontSize: '0.8rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Reset All Checklists
          </button>
        </div>

        {/* Progress Section */}
        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}