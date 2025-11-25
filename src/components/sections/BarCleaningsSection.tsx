'use client';

import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { useState, useEffect, useRef } from 'react';
import { CardProps } from '@/types';

// Define the section color for bar cleanings
const SECTION_COLOR = '#38B2AC'; // Teal color for cleaning
const SECTION_COLOR_RGB = '56, 178, 172';

// Simplified Card Component - NO HOVER EFFECTS
function AnimatedCard({ title, description, items, footer, index, children }: CardProps) {
  return (
    <div 
      style={{
        borderRadius: '12px',
        margin: '12px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.08)',
        // REMOVED: backdrop-filter entirely
        border: '1px solid rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative' }}>
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

// Simplified Checklist Item Component - NO HOVER
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
      marginBottom: '6px',
      cursor: 'pointer',
    }}>
      <input type="checkbox" style={{
        width: '16px',
        height: '16px',
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
    <AnimatedCard title={title} index={0}>
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
              cursor: 'pointer'
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
  // Load cleaning days first
  const saved = localStorage.getItem('decadesCleaningDays');
  if (saved) {
    setCleaningDays(JSON.parse(saved));
  }

  if (!currentUser) return;

  // Wait 60 seconds then mark as complete
  timerRef.current = setTimeout(() => {
    trackSectionVisit(currentUser.email, 'bar-cleanings', 60);
    console.log('Section auto-completed after 60 seconds');
  }, 60000);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [currentUser]); // ✅ FIXED: Code reorganized and properly closed

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
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '600',
          textAlign: 'center',
          fontSize: '0.85rem'
        }}>
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} style={{padding: '8px'}}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${currentMonth + 1}-${day}`;
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isCleaningDay = cleaningDays.includes(dateStr);

      const dayStyle = {
        padding: '8px',
        background: isCleaningDay 
          ? `rgba(${SECTION_COLOR_RGB}, 0.25)` 
          : isToday
          ? 'rgba(212, 175, 55, 0.15)'
          : 'rgba(255, 255, 255, 0.06)',
        border: '1px solid',
        borderColor: isCleaningDay 
          ? `rgba(${SECTION_COLOR_RGB}, 0.4)` 
          : isToday
          ? 'rgba(212, 175, 55, 0.3)'
          : 'rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        textAlign: 'center' as const,
        cursor: 'pointer',
        fontSize: '0.9rem'
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
              fontSize: '0.65rem',
              background: SECTION_COLOR,
              color: 'white',
              padding: '2px 4px',
              borderRadius: '3px',
              marginTop: '4px'
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
        marginBottom: '25px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.08)',
        // REMOVED: backdrop-filter
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
        // REMOVED: backdrop-filter
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
            Bar Cleaning Schedule
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.9rem',
            marginTop: '4px'
          }}>
            Comprehensive cleaning procedures and schedules
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
          Maintenance
        </span>
      </div>

      <div style={{ padding: '20px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
            marginBottom: '12px',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '6px'
          }}>
            <button style={{
              background: SECTION_COLOR,
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
            }} onClick={() => changeMonth(-1)}>
              ← Previous
            </button>
            <h4 style={{ 
              color: 'white', 
              margin: 0,
              fontSize: '1rem'
            }}>
              {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <button style={{
              background: SECTION_COLOR,
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
            }} onClick={() => changeMonth(1)}>
              Next →
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginTop: '8px'
          }}>
            {generateCalendar()}
          </div>
        </AnimatedCard>

        {/* Monthly/Quarterly Cleans */}
        <AnimatedCard
          title="✅ Monthly / Quarterly Bar Cleans"
          index={4}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
          background: `linear-gradient(135deg, ${SECTION_COLOR}, #319795)`,
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          marginTop: '12px',
        }} onClick={resetChecklists}>
          Reset All Checklists
        </button>

        {/* Progress Section */}
        <div style={{ marginTop: '20px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}