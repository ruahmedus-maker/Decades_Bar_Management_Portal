import { useEffect, useState} from 'react'; // Add this if not present
import { useApp } from '@/contexts/AppContext'; // Add this if not present
import ProgressSection from '../ProgressSection'; // Adjust path if necessary
import { trackSectionVisit } from '@/lib/progress'; // Add this import

  const TRAINING_VIDEOS = [
    {
      id: 'QkMhy-grvO8',
      title: 'Aloha POS functions',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '0:27'
    },
    {
      id: 'H3JPBhvbNqc', 
      title: 'Aloha POS functions',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '0:19'
    },
    {
      id: 'WFXIrzqOZvM',
      title: 'Aloha POS functions',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '0:31'
    },
    {
      id: '',
      title: 'Aloha POS functions',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '0:15'
    },
    {
      id: 'YOUR_VIDEO_ID_5',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
    {
      id: 'YOUR_VIDEO_ID_6',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
    {
      id: 'YOUR_VIDEO_ID_7',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
    {
      id: 'YOUR_VIDEO_ID_8',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
    {
      id: 'YOUR_VIDEO_ID_9',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
    {
      id: 'YOUR_VIDEO_ID_10',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
    {
      id: 'YOUR_VIDEO_ID_11',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
    {
      id: 'YOUR_VIDEO_ID_12',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
    {
      id: 'YOUR_VIDEO_ID_13',
      title: '',
      description: 'Step-by-step guide to ',
      category: 'Aloha POS',
      duration: '6:20'
    },
  ];
  
  // YouTube Video Player Component
  function YouTubeVideo({ videoId, title, description, duration }: { 
    videoId: string; 
    title: string; 
    description: string;
    duration: string;
  }) {
    return (
      <div className="card" style={{ marginBottom: '25px' }}>
        <div className="card-header">
          <h4>{title}</h4>
          <span className="badge" style={{ background: '#4a5568', color: 'white' }}>
            {duration}
          </span>
        </div>
        <div className="card-body">
          <p style={{ marginBottom: '15px', color: '#666' }}>{description}</p>
          
          {/* YouTube Video Embed */}
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
            borderRadius: '8px',
            backgroundColor: '#000'
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`}
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
          </div>
          
          <div style={{ 
            marginTop: '10px', 
            fontSize: '0.9rem', 
            color: '#666',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>🔗 <a 
              href={`https://youtu.be/${videoId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3182ce' }}
            >
              Open in YouTube
            </a></span>
            <span>📺 YouTube</span>
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
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: activeCategory === category ? '#d4af37' : '#f7fafc',
              color: activeCategory === category ? 'white' : '#4a5568',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeCategory === category ? '600' : '400',
              border: '1px solid #e2e8f0'
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
      <div className="section active" id="aloha-pos">
      <div className="section-header">
        <h3>Aloha POS System Guide</h3>
          <span className="badge">{TRAINING_VIDEOS.length} AlohaPosSection</span>
          <div>
      <p>Aloha POS section content will be implemented here.</p>
       <ProgressSection />
    </div>
    </div>
        
  
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-body">
            <p style={{ margin: 0 }}>
              Welcome to the Decades Bar video training library. Here you'll find all the training videos 
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
        <div>
          {filteredVideos.length === 0 ? (
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center', color: '#666' }}>
                <p>No videos found in this category.</p>
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
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <h4>Training Progress</h4>
          </div>
          <div className="card-body">
            <ProgressSection />
          </div>
        </div>
  
        {/* Help Section */}
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#f0f9ff', 
          borderRadius: '6px', 
          border: '1px solid #bee3f8' 
        }}>
          <h4 style={{ marginTop: 0, color: '#2b6cb0' }}>💡 Video Tips</h4>
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            <li>Click the fullscreen button for better viewing</li>
            <li>Use the playback speed controls if you want to watch faster/slower</li>
            <li>Take notes on important procedures</li>
            <li>Contact a manager if you have questions after watching</li>
          </ul>
        </div>
      </div>
    );
  }

  
