import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

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

// Style objects for consistent styling
const styles = {
  mainContainer: {
    marginBottom: '30px',
    borderRadius: '20px',
    overflow: 'hidden' as const,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px) saturate(170%)',
    border: '1px solid rgba(255, 255, 255, 0.22)',
    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
  },
  header: {
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.15))',
    padding: '20px',
    borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#ffffff',
    fontSize: '1.4rem',
    fontWeight: 700,
    margin: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  },
  subtitle: {
    margin: 0,
    opacity: 0.9,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.95rem',
    marginTop: '4px'
  },
  badge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    color: 'white',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px) saturate(160%)',
    borderRadius: '12px',
    overflow: 'hidden' as const,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    marginBottom: '20px'
  },
  cardHeader: {
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    color: '#ffffff',
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 600
  },
  cardBody: {
    padding: '20px'
  },
  categoryButton: (isActive: boolean) => ({
    padding: '12px 18px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: isActive ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    borderColor: isActive ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.2)'
  }),
  videoBadge: {
    background: 'linear-gradient(135deg, #d4af37, #c19b2a)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
  },
  tipCard: {
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    margin: '20px',
    backdropFilter: 'blur(10px)'
  },
  noItemsCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px) saturate(160%)',
    borderRadius: '12px',
    overflow: 'hidden' as const,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.7)'
  }
};

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

  // Base YouTube URL
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

  const videoCardStyle = {
    ...styles.card,
    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(212, 175, 55, 0.2)' 
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  return (
    <div 
      style={videoCardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.cardHeader}>
        <h4 style={styles.cardTitle}>{title || 'Aloha POS Training'}</h4>
        <span style={styles.videoBadge}>
          {duration}
        </span>
      </div>
      <div style={styles.cardBody}>
        <p style={{ 
          marginBottom: '15px', 
          color: 'rgba(255, 255, 255, 0.9)',
          lineHeight: 1.5 
        }}>
          {description}
        </p>
        
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
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '10px' }}>▶️</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>Click to Play</div>
            </div>
          )}
        </div>

        <div style={{ 
          marginTop: '15px', 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>🔗 <a 
            href={`https://youtu.be/${videoId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#d4af37',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Open in YouTube
          </a></span>
        </div>
      </div>
    </div>
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
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          style={styles.categoryButton(activeCategory === category)}
          onMouseEnter={(e) => {
            if (activeCategory !== category) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeCategory !== category) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
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

  return (
    <div 
      id="aloha-pos"
      style={styles.mainContainer}
    >
      {/* Header Section */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h3 style={styles.title}>
              Aloha POS System Guide
            </h3>
            <p style={styles.subtitle}>
              Complete video training library for POS operations
            </p>
          </div>
          <div style={styles.badge}>
            {TRAINING_VIDEOS.length} Videos
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div style={{...styles.card, margin: '20px'}}>
        <div style={styles.cardBody}>
          <p style={{ 
            margin: 0, 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}>
            Welcome to the Aloha POS Video Library. Here you'll find all the training videos 
            covering procedures and systems you'll use during your shift. Click on any video to start learning.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {/* Videos Grid */}
      <div style={{ margin: '0 20px' }}>
        {filteredVideos.length === 0 ? (
          <div style={styles.noItemsCard}>
            <div style={{padding: '40px 20px'}}>
              <p style={{margin: 0}}>No videos found in this category.</p>
            </div>
          </div>
        ) : (
          filteredVideos.map(video => (
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

      {/* Video Stats */}
      <div style={{...styles.card, margin: '20px'}}>
        <div style={styles.cardHeader}>
          <h4 style={styles.cardTitle}>Training Progress</h4>
        </div>
        <div style={styles.cardBody}>
          <ProgressSection />
        </div>
      </div>

      {/* Help Section */}
      <div style={styles.tipCard}>
        <h4 style={{ 
          marginTop: 0, 
          color: '#d4af37',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '15px'
        }}>
          💡 Video Tips
        </h4>
        <ul style={{ 
          marginBottom: 0, 
          paddingLeft: '20px',
          color: 'rgba(255, 255, 255, 0.9)',
          lineHeight: 1.6
        }}>
          <li>Click the fullscreen button for better viewing</li>
          <li>Use the playback speed controls if you want to watch faster/slower</li>
          <li>Take notes on important procedures</li>
          <li>Contact a manager if you have questions after watching</li>
        </ul>
      </div>
    </div>
  );
}