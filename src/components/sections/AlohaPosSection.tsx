import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';

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

// SIMPLE Card Component - NO HOVER EFFECTS
function SimpleCard({ title, description, items, footer, index, children }: any) {
  return (
    <div 
      style={{
        borderRadius: '12px',
        margin: '15px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Static Glow Effect - No Animation */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '3px',
        background: `linear-gradient(90deg, ${SECTION_COLOR}, #48BB78)`,
        zIndex: 1
      }} />
      
      <div style={{ position: 'relative', zIndex: 1, marginTop: '3px' }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.2), rgba(${SECTION_COLOR_RGB}, 0.1))`,
          padding: '16px 20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.2)`,
        }}>
          <h4 style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 600
          }}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '16px 20px' }}>
          {children || (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '12px' }}>{description}</p>
              <ul style={{paddingLeft: '18px', marginBottom: '0', marginTop: '12px'}}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '12px 20px',
            background: 'rgba(237, 242, 247, 0.1)',
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

// Simple Checklist Item - NO HOVER
function ChecklistItem({ children, index }: any) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      marginBottom: '6px',
    }}>
      <input type="checkbox" style={{
        width: '16px',
        height: '16px',
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

// YouTube Video Player - SIMPLIFIED
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
    <SimpleCard title={title} index={0}>
      <p style={{ marginBottom: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>{description}</p>
      
      <div style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        borderRadius: '6px',
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
              borderRadius: '6px',
              cursor: 'pointer',
            }}
            onClick={handlePlay}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>▶️</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Click to Play</div>
            <div style={{ marginTop: '6px', fontSize: '0.85rem', opacity: 0.8 }}>
              Duration: {duration}
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '8px', 
        fontSize: '0.85rem', 
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
        >
          Open in YouTube
        </a></span>
      </div>
    </SimpleCard>
  );
}

// Simple Category Filter - NO HOVER
function CategoryFilter({ activeCategory, onCategoryChange }: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  const categories = ['All', ...new Set(TRAINING_VIDEOS.map(video => video.category))];
  
  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      margin: '16px',
      flexWrap: 'wrap'
    }}>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          style={{
            padding: '10px 16px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: activeCategory === category 
              ? `rgba(${SECTION_COLOR_RGB}, 0.2)` 
              : 'rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.9)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '500',
            borderColor: activeCategory === category 
              ? `rgba(${SECTION_COLOR_RGB}, 0.4)` 
              : 'rgba(255, 255, 255, 0.2)',
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
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      }}
      className="active"
    >
      
      {/* Section Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.3), rgba(${SECTION_COLOR_RGB}, 0.15))`,
        padding: '16px 20px',
        borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.3rem',
            fontWeight: 700,
            margin: 0,
          }}>
            Aloha POS System Guide
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.9rem',
            marginTop: '4px'
          }}>
            Complete video training library for POS operations
          </p>
        </div>
        <span style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '0.85rem',
          color: 'white',
          fontWeight: '600',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {TRAINING_VIDEOS.length} Videos
        </span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Welcome Card */}
        <SimpleCard
          title="🎯 Welcome to Aloha POS Training"
          index={1}
        >
          <p style={{ 
            margin: 0, 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.5,
            fontSize: '0.95rem'
          }}>
            Welcome to the Aloha POS Video Library. Here you'll find all the training videos 
            covering procedures and systems you'll use during your shift. Click on any video to start learning.
          </p>
        </SimpleCard>

        {/* Category Filter */}
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />

        {/* Videos Grid */}
        <div>
          {filteredVideos.length === 0 ? (
            <SimpleCard
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

        {/* POS Procedures Checklist */}
        <SimpleCard
          title="✅ Essential POS Procedures Checklist"
          index={3}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <ChecklistItem>Clock in using the POS system at start of shift</ChecklistItem>
            <ChecklistItem>Check daily specials and event board for updates</ChecklistItem>
            <ChecklistItem>Review reservation list and any special requests</ChecklistItem>
            <ChecklistItem>Verify card reader is functioning properly</ChecklistItem>
            <ChecklistItem>Test printer connectivity and paper levels</ChecklistItem>
            <ChecklistItem>Know how to split checks and process payments</ChecklistItem>
            <ChecklistItem>Understand how to handle comps and voids</ChecklistItem>
            <ChecklistItem>Complete end-of-shift reporting accurately</ChecklistItem>
          </div>
        </SimpleCard>

        {/* Troubleshooting Checklist */}
        <SimpleCard
          title="🔧 POS Troubleshooting Checklist"
          index={4}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <ChecklistItem>Reboot POS system if unresponsive</ChecklistItem>
            <ChecklistItem>Check network connectivity for card processing</ChecklistItem>
            <ChecklistItem>Verify card reader cables are securely connected</ChecklistItem>
            <ChecklistItem>Restart printer and check paper levels</ChecklistItem>
            <ChecklistItem>Use card reader cleaner if cards aren't reading</ChecklistItem>
            <ChecklistItem>Contact manager for system override needs</ChecklistItem>
            <ChecklistItem>Document any persistent issues for IT</ChecklistItem>
          </div>
        </SimpleCard>

        {/* Video Tips */}
        <SimpleCard
          title="💡 Video Learning Tips"
          index={5}
        >
          <ul style={{ 
            margin: 0, 
            paddingLeft: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.5
          }}>
            <li>Click the fullscreen button for better viewing experience</li>
            <li>Use playback speed controls to watch at your preferred pace</li>
            <li>Take notes on important procedures and shortcuts</li>
            <li>Practice the steps shown in the videos during slow periods</li>
            <li>Contact a manager if you have questions after watching</li>
            <li>Bookmark frequently used procedures for quick reference</li>
          </ul>
        </SimpleCard>

        {/* Reset Button */}
        <button 
          onClick={resetChecklists}
          style={{
            background: `linear-gradient(135deg, ${SECTION_COLOR}, #2F855A)`,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            marginTop: '12px',
          }}
        >
          Reset All Checklists
        </button>

        {/* Progress Section */}
        <div style={{ marginTop: '20px' }}>
          <SimpleCard
            title="📊 Training Progress"
            index={6}
          >
            <ProgressSection />
          </SimpleCard>
        </div>
      </div>
    </div>
  );
}