'use client';

import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';
import { useState, useEffect, useRef } from 'react';
import { CardProps } from '@/types';

// Standard Aloha Blue Background (No section-specific teal)
const SECTION_BLUE = 'rgba(37, 99, 235, 0.2)';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, items, footer, children }: CardProps) {
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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

// Simplified Checklist Item Component - ALOHA STYLED
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
      marginBottom: '8px',
      cursor: 'pointer',
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
    <AnimatedCard title={title}>
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
              cursor: 'pointer'
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
    </AnimatedCard>
  );
}

const BAR_CLEANING_VIDEOS = [
  {
    id: 'pfcYoAOTRjA',
    title: 'Cleaning Procedures',
    description: 'Step-by-step guide to proper bar cleaning',
    category: 'Bar Maintenance',
    duration: '2:45'
  }
];

export default function BarCleaningsSection() {
  const { currentUser, trackVisit } = useApp();
  const [cleaningDays, setCleaningDays] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const saved = localStorage.getItem('decadesCleaningDays');
    if (saved) {
      setCleaningDays(JSON.parse(saved));
    }

    if (!currentUser) return;

    timerRef.current = setTimeout(() => {
      trackVisit('bar-cleanings');
      trackVisit('bar-cleanings');
      console.log('Section auto-completed after 60 seconds');
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
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
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: 300,
          textAlign: 'center',
          fontSize: '0.7rem',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} style={{ padding: '8px' }}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${currentMonth + 1}-${day}`;
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isCleaningDay = cleaningDays.includes(dateStr);

      const dayStyle = {
        padding: '12px 8px',
        background: isCleaningDay
          ? 'rgba(255, 255, 255, 0.15)'
          : isToday
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.03)',
        border: '1px solid',
        borderColor: isCleaningDay
          ? 'rgba(255, 255, 255, 0.3)'
          : isToday
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        textAlign: 'center' as const,
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s ease'
      };

      calendar.push(
        <div
          key={`day-${day}`}
          style={dayStyle}
          onClick={() => toggleCleaningDay(currentYear, currentMonth, day)}
        >
          <div style={{
            fontWeight: isToday ? 600 : 300,
            color: 'white',
            opacity: isCleaningDay || isToday ? 1 : 0.7
          }}>
            {day}
          </div>
          {isCleaningDay && (
            <div style={{
              fontSize: '0.6rem',
              color: 'white',
              marginTop: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}>
              CLEAN
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
            Cleaning Schedule
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
            Maintenance and hygiene procedures
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
          ESSENTIAL
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Training Video */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
          {BAR_CLEANING_VIDEOS.map(video => (
            <YouTubeVideo
              key={video.id}
              videoId={video.id}
              title={video.title}
              description={video.description}
              duration={video.duration}
            />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '10px' }}>
          {/* Opening Checklist */}
          <AnimatedCard
            title="✅ Opening Procedures"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <ChecklistItem>Remove caps from bottles and soak in Soda water</ChecklistItem>
              <ChecklistItem>Organize bottles on back-bar display - Straight facing</ChecklistItem>
              <ChecklistItem>Set up well - Marry bottles and gather required stock</ChecklistItem>
              <ChecklistItem>Set up drink menus on Bar</ChecklistItem>
              <ChecklistItem>Check paper in the printer and backup rolls</ChecklistItem>
              <ChecklistItem>Ensure checkbooks are ready for the shift</ChecklistItem>
              <ChecklistItem>Collect bank from office</ChecklistItem>
              <ChecklistItem>Ensure your register is assigned</ChecklistItem>
            </div>
          </AnimatedCard>

          {/* Closing Procedures */}
          <AnimatedCard
            title="🧹 Closing Procedures"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <ChecklistItem>Soak soda guns for 10-15 mins in hot water</ChecklistItem>
              <ChecklistItem>Soak bottle caps and wipe down guns</ChecklistItem>
              <ChecklistItem>Clean soda-gun holders and spill cups</ChecklistItem>
              <ChecklistItem>Wipe down soda-gun hoses and boxes</ChecklistItem>
              <ChecklistItem>Clean rim around ice bin and remove standing water</ChecklistItem>
              <ChecklistItem>Wipe bottles, pour spouts, and cap them</ChecklistItem>
              <ChecklistItem>Clean all wells and bottle rails thoroughly</ChecklistItem>
              <ChecklistItem>Wipe down POS system and peripheral hardware</ChecklistItem>
            </div>
          </AnimatedCard>
        </div>

        {/* Cleaning Calendar */}
        <AnimatedCard
          title="📅 Log Schedule"
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }} onClick={() => changeMonth(-1)}>
              Previous
            </button>
            <h4 style={{ ...cardHeaderStyle, ...premiumWhiteStyle, fontSize: '0.9rem', letterSpacing: '4px' }}>
              {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <button style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }} onClick={() => changeMonth(1)}>
              Next
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            marginTop: '8px'
          }}>
            {generateCalendar()}
          </div>
        </AnimatedCard>

        {/* Monthly/Quarterly Cleans */}
        <AnimatedCard
          title="✨ Periodical Deep Clean"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <ChecklistItem>Remove and soak all pour spouts and caps</ChecklistItem>
            <ChecklistItem>Clean all back-bar shelving and display units</ChecklistItem>
            <ChecklistItem>Deep clean beer coolers and rotate stock</ChecklistItem>
            <ChecklistItem>Thorough POS hardware maintenance</ChecklistItem>
            <ChecklistItem>Spot clean and sanitize high-moisture areas</ChecklistItem>
          </div>
        </AnimatedCard>

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