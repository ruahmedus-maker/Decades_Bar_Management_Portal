'use client';

import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';
import { useState, useEffect, useRef } from 'react';

// Define the section color for bar cleanings
const SECTION_COLOR = '#38B2AC'; // Teal color for cleaning
const SECTION_COLOR_RGB = '56, 178, 172';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - teal theme for cleaning
  const glowColors = [
    'linear-gradient(45deg, #38B2AC, #4FD1C7, transparent)', // Teal
    'linear-gradient(45deg, #319795, #38B2AC, transparent)', // Dark Teal
    'linear-gradient(45deg, #2C7A7B, #319795, transparent)', // Deeper Teal
    'linear-gradient(45deg, #285E61, #2C7A7B, transparent)'  // Deep Teal
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #4FD1C7, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(56, 178, 172, 0.1)' 
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
        cursor: 'pointer'
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
              cursor: 'pointer'
            }}
            onClick={handlePlay}
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
          style={{ color: SECTION_COLOR }}
        >
          Open in YouTube
        </a></span>
      </div>
    </AnimatedCard>
  );
}

const BAR_CLEANING_VIDEOS = [
  {
    id: 'pfcYoAOTRjA',
    title: 'Bar Cleaning Procedures',
    description: 'Step-by-step guide to proper bar cleaning',
    category: 'Bar Maintenance',
    duration: '2:45'
  }
];

export default function BarCleaningsSection() {
  const { currentUser } = useApp();
  const [cleaningDays, setCleaningDays] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'bar-cleanings');
    }

    const saved = localStorage.getItem('decadesCleaningDays');
    if (saved) {
      setCleaningDays(JSON.parse(saved));
    }
  }, [currentUser]);

  const toggleCleaningDay = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${month + 1}-${day}`;
    const newCleaningDays = cleaningDays.includes(dateStr)
      ? cleaningDays.filter(d => d !== dateStr)
      : [...cleaningDays, dateStr];
    
    setCleaningDays(newCleaningDays);
    localStorage.setItem('decadesCleaningDays', JSON.stringify(newCleaningDays));
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    const calendar = [];
    
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      calendar.push(
        <div key={`header-${day}`} style={{
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.15)',
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} style={{padding: '10px'}}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${currentMonth + 1}-${day}`;
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isCleaningDay = cleaningDays.includes(dateStr);

      const dayStyle = {
  padding: '10px',
  background: isCleaningDay 
    ? `rgba(${SECTION_COLOR_RGB}, 0.3)` 
    : isToday
    ? 'rgba(212, 175, 55, 0.2)'
    : 'rgba(255, 255, 255, 0.08)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: isCleaningDay 
    ? `rgba(${SECTION_COLOR_RGB}, 0.5)` 
    : isToday
    ? 'rgba(212, 175, 55, 0.4)'
    : 'rgba(255, 255, 255, 0.15)',
  borderRadius: '8px',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

      calendar.push(
        <div
          key={`day-${day}`}
          style={dayStyle}
          onClick={() => toggleCleaningDay(currentYear, currentMonth, day)}
        >
          <div style={{ 
            fontWeight: isToday ? 'bold' : 'normal',
            color: 'white'
          }}>
            {day}
          </div>
          {isCleaningDay && (
            <div style={{
              fontSize: '0.7rem',
              background: SECTION_COLOR,
              color: 'white',
              padding: '2px 4px',
              borderRadius: '3px',
              marginTop: '5px'
            }}>
              Cleaning
            </div>
          )}
        </div>
      );
    }

    return calendar;
  };

  const changeMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

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
      id="bar-cleanings"
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
            Bar Cleaning Schedule
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Comprehensive cleaning procedures and schedules
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
          Maintenance
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Training Video */}
        {BAR_CLEANING_VIDEOS.map(video => (
          <YouTubeVideo
            key={video.id}
            videoId={video.id}
            title={video.title}
            description={video.description}
            duration={video.duration}
          />
        ))}

        {/* Opening Checklist */}
        <AnimatedCard
          title="✅ Opening Checklist"
          index={1}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ChecklistItem>Remove caps from bottles and soak in Soda water</ChecklistItem>
            <ChecklistItem>Organize bottles on back-bar display - Straight facing and filling gaps</ChecklistItem>
            <ChecklistItem>Set up well - Marry bottles and gather the required bottles for the shift</ChecklistItem>
            <ChecklistItem>Set up drink menus on Bar</ChecklistItem>
            <ChecklistItem>Check paper in the printer and make sure you have back up rolls</ChecklistItem>
            <ChecklistItem>Make sure you have enough checkbooks for the shift - HH & Roof get additional light ones from office</ChecklistItem>
            <ChecklistItem>Collect bank from office</ChecklistItem>
            <ChecklistItem>Ensure you register is assigned</ChecklistItem>
          </div>
        </AnimatedCard>

        {/* Closing Procedures */}
        <AnimatedCard
          title="🧹 Closing Procedures Checklist"
          index={2}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ChecklistItem>Soak guns for 10-15 mins in hot water (if available) then wipe and return to holder. Soak the guns as soon as the lights go up on your floor and start entering tips, etc while they're soaking.</ChecklistItem>
            <ChecklistItem>Soak bottle caps in hot water/soda water as you remove them from bottles at the start of your shift.</ChecklistItem>
            <ChecklistItem>Soda-gun holders should be cleaned and if they have a spill cup underneath, that should also be cleaned and free of standing water</ChecklistItem>
            <ChecklistItem>The black box from which the soda-guns hose extends is visible in some bars, this will get splashed throughout the night and should be wiped down as well and the hose</ChecklistItem>
            <ChecklistItem>Rim around ice bin should be cleaned and free of any standing water</ChecklistItem>
            <ChecklistItem>Bottles wiped including the pour spouts and then capped</ChecklistItem>
            <ChecklistItem>All wells and rails that hold bottles should be thoroughly cleaned and free of any standing water</ChecklistItem>
            <ChecklistItem>Books wiped down and left to dry standing</ChecklistItem>
            <ChecklistItem>POS system should be cleaned in its entirety, this includes wiping down the cash register, printer, credit card machine and the whole display, not just the screen</ChecklistItem>
            <ChecklistItem>Screen should be cleaned with a wet beverage napkin and then dried, using only water.</ChecklistItem>
            <ChecklistItem>Drinks menus should be wiped down and then dried using a beverage napkin to avoid streaking and lint.</ChecklistItem>
            <ChecklistItem>Area surrounding POS should be free of clutter/trash (receipt paper, etc) and surface should be wiped down</ChecklistItem>
          </div>
        </AnimatedCard>

        {/* Cleaning Calendar */}
        <AnimatedCard
          title="📅 Bar Cleans Schedule"
          index={3}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px'
          }}>
            <button style={{
              background: SECTION_COLOR,
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }} onClick={() => changeMonth(-1)}>
              ← Previous
            </button>
            <h4 style={{ 
              color: 'white', 
              margin: 0,
              fontSize: '1.1rem'
            }}>
              {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <button style={{
              background: SECTION_COLOR,
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }} onClick={() => changeMonth(1)}>
              Next →
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '5px',
            marginTop: '10px'
          }}>
            {generateCalendar()}
          </div>
        </AnimatedCard>

        {/* Monthly/Quarterly Cleans */}
        <AnimatedCard
          title="✅ Monthly / Quarterly Bar Cleans"
          index={4}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ChecklistItem>Remove caps/ pour spouts from all bottles and soak hot water</ChecklistItem>
            <ChecklistItem>Remove bottles from back-bar displays and clean</ChecklistItem>
            <ChecklistItem>Clean all shelving and restore wiped bottles</ChecklistItem>
            <ChecklistItem>restore cleaned pour spots and caps to bottles</ChecklistItem>
            <ChecklistItem>Empty all beer coolers and clean thoroughly then restoring beer/water/redbull(Check for expiration)</ChecklistItem>
            <ChecklistItem>Clean POS system thoroughly</ChecklistItem>
            <ChecklistItem>Spot clean anywhere mold is forming (Generally in areas that collect a lot of water like rim around ice bins)</ChecklistItem>
            <ChecklistItem>Once complete move to another floor and help complete the work there</ChecklistItem>
          </div>
        </AnimatedCard>

        {/* Reset Button */}
        <button style={{
          background: 'linear-gradient(135deg, var(--accent), #c19b2a)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          marginTop: '15px',
          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
        }} onClick={resetChecklists}>
          Reset All Checklists
        </button>

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}