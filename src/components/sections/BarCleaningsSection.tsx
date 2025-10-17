'use client';


import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';


import { useState, useEffect } from 'react';

export default function BarCleaningsSection() {

   const { currentUser } = useApp();

  // Track section visit when component mounts
  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'bar-cleanings');
    }
  }, [currentUser]);

  const [cleaningDays, setCleaningDays] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Load cleaning days from localStorage
    const saved = localStorage.getItem('decadesCleaningDays');
    if (saved) {
      setCleaningDays(JSON.parse(saved));
    }
  }, []);

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
    
    // Day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      calendar.push(
        <div key={`header-${day}`} className="calendar-day-header">
          {day}
        </div>
      );
    });

    // Empty days for alignment
    for (let i = 0; i < firstDay; i++) {
      calendar.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${currentMonth + 1}-${day}`;
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isCleaningDay = cleaningDays.includes(dateStr);

      const dayClasses = ['calendar-day'];
      if (isToday) dayClasses.push('today');
      if (isCleaningDay) dayClasses.push('cleaning-day');

      calendar.push(
        <div
          key={`day-${day}`}
          className={dayClasses.join(' ')}
          onClick={() => toggleCleaningDay(currentYear, currentMonth, day)}
        >
          <div>{day}</div>
          {isCleaningDay && <div className="cleaning-indicator">Cleaning</div>}
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
    <div className="section active" id="bar-cleanings">
      <div className="section-header">
        <h3>Bar Cleaning Schedule</h3>
        <span className="badge">Maintenance</span>
      </div>

      {/* Opening Checklist */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>✅ Opening Checklist</h4>
        </div>

        {/* YouTube Video Section - Added at the top */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>🎥 Bar Cleaning Tutorial</h4>
        </div>
        <div className="card-body">
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <iframe
              src="https://www.youtube.com/watch?v=pfcYoAOTRjA"
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
              title="Bar Cleaning Tutorial Video"
            />
          </div>
        </div>
      </div>
      
        <div className="card-body">
          <div className="checklist-container">
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Remove caps from bottles and soak in Soda water</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Organize bottles on back-bar display - Straight facing and filling gaps</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Set up well - Marry bottles and gather the required bottles for the shift</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Set up drink menus on Bar</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Check paper in the printer and make sure you have back up rolls</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Make sure you have enough checkbooks for the shift - HH & Roof get additional light ones from office</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Collect bank from office</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Ensure you register is assigned</span>
            </label>
          </div>
        </div>
      </div>

      {/* Closing Procedures Checklist */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>🧹 Closing Procedures Checklist</h4>
        </div>
        <div className="card-body">
          <div className="checklist-container">
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Soak guns for 10-15 mins in hot water (if available) then wipe and return to holder. Soak the guns as soon as the lights go up on your floor and start entering tips, etc while they&apos;re soaking.</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Soak bottle caps in hot water/soda water as you remove them from bottles at the start of your shift.</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Soda-gun holders should be cleaned and if they have a spill cup underneath, that should also be cleaned and free of standing water</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>The black box from which the soda-guns hose extends is visible in some bars, this will get splashed throughout the night and should be wiped down as well and the hose</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Rim around ice bin should be cleaned and free of any standing water</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Bottles wiped including the pour spouts and then capped</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>All wells and rails that hold bottles should be thoroughly cleaned and free of any standing water</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Books wiped down and left to dry standing</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>POS system should be cleaned in its entirety, this includes wiping down the cash register, printer, credit card machine and the whole display, not just the screen</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Screen should be cleaned with a wet beverage napkin and then dried, using only water.</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Drinks menus should be wiped down and then dried using a beverage napkin to avoid streaking and lint.</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Area surrounding POS should be free of clutter/trash (receipt paper, etc) and surface should be wiped down</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bar Cleans Schedule */}
      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>📅 Bar Cleans Schedule</h4>
        </div>
        <div className="card-body">
          <div className="calendar-header">
            <button className="calendar-nav" onClick={() => changeMonth(-1)}>
              ← Previous
            </button>
            <h4>{new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
            <button className="calendar-nav" onClick={() => changeMonth(1)}>
              Next →
            </button>
          </div>
          <div className="calendar-grid">
            {generateCalendar()}
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom: '25px'}}>
        <div className="card-header">
          <h4>✅ Monthly / Quarterly Bar Cleans</h4>
        </div>
        <div className="card-body">
          <div className="checklist-container">
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Remove caps/ pour spouts from all bottles and soak hot water </span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Remove bottles from back-bar displays and clean </span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Clean all shelving and restore wiped bottles</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>restore cleaned pour spots and caps to bottles</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Empty all beer coolers and clean thoroughly then restoring beer/water/redbull(Check for expiration)</span>
          
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Clean POS system thoroughly</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Spot clean anywhere mold is forming (Generally in areas that collect a lot of water like rim around ice bins)</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Once complete move to another floor and help complete the work there</span>
            </label>
          </div>
        </div>
      </div>

      <button className="btn" onClick={resetChecklists} style={{marginTop: '15px'}}>
        Reset All Checklists
      </button>
      <ProgressSection />
    </div>
  );
}