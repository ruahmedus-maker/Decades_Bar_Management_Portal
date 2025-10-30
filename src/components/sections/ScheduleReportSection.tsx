import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { trackSectionVisit } from '@/lib/progress';

// Define the section color for schedule reports - green theme
const SECTION_COLOR = '#059669'; // Green color for schedule reports
const SECTION_COLOR_RGB = '5, 150, 105';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - green theme for schedule reports
  const glowColors = [
    'linear-gradient(45deg, #059669, #10B981, transparent)',
    'linear-gradient(45deg, #10B981, #34D399, transparent)',
    'linear-gradient(45deg, #047857, #059669, transparent)',
    'linear-gradient(45deg, #065F46, #059669, transparent)'
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #10B981, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(5, 150, 105, 0.1)' 
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
          {description && (
            <p style={{
              margin: '8px 0 0 0',
              opacity: 0.9,
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem'
            }}>
              {description}
            </p>
          )}
        </div>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Report Item Component
function ReportItem({ title, description, icon, status, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      scheduled: '#10B981',
      pending: '#F59E0B',
      completed: '#3B82F6',
      failed: '#EF4444'
    };
    return colors[status] || SECTION_COLOR;
  };

  return (
    <div 
      style={{
        padding: '20px',
        background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: isHovered 
          ? '1px solid rgba(5, 150, 105, 0.4)' 
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
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h5 style={{ 
              color: isHovered ? SECTION_COLOR : 'white', 
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'color 0.3s ease'
            }}>
              {title}
            </h5>
            <span style={{
              background: `linear-gradient(135deg, ${getStatusColor(status)}, ${getStatusColor(status)}99)`,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {status}
            </span>
          </div>
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

export default function ScheduleReportSection() {
  const { currentUser } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [reportType, setReportType] = useState('weekly');
  const [schedule, setSchedule] = useState({
    frequency: 'weekly',
    day: 'monday',
    time: '09:00',
    recipients: '',
    format: 'pdf'
  });

  const scheduledReports = [
    {
      icon: '📊',
      title: 'Weekly Sales Report',
      description: 'Comprehensive sales analysis and revenue tracking',
      status: 'scheduled'
    },
    {
      icon: '👥',
      title: 'Staff Performance',
      description: 'Employee hours, performance metrics, and attendance',
      status: 'pending'
    },
    {
      icon: '📦',
      title: 'Inventory Summary',
      description: 'Stock levels, usage patterns, and reorder recommendations',
      status: 'completed'
    },
    {
      icon: '💰',
      title: 'Revenue Analytics',
      description: 'Revenue breakdown by category, time, and performance',
      status: 'scheduled'
    }
  ];

  const handleScheduleChange = (field: string, value: string) => {
    setSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReport = () => {
    alert(`Report scheduled successfully! ${schedule.frequency} report will be sent every ${schedule.day} at ${schedule.time}`);
  };

  if (!currentUser || currentUser.position !== 'Admin') {
    return (
      <div 
        id="schedule-report-section"
        style={{
          marginBottom: '30px',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px) saturate(170%)',
          WebkitBackdropFilter: 'blur(15px) saturate(170%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
        }}
        className="active"
      >
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Schedule Report
          </h3>
          <span style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: 'white',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '8px',
            display: 'inline-block'
          }}>
            Admin Only
          </span>
        </div>
        <div style={{ padding: '25px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
          <p>Access to this section is restricted to management only.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="schedule-report-section"
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
          ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(5, 150, 105, 0.15)'
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
            Schedule Report
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Automated reporting and analytics scheduling
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
          Admin Only
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Report Scheduling Form */}
        <AnimatedCard
          title="📅 Schedule New Report"
          description="Configure automated reporting for your business analytics"
          index={0}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Report Type
              </label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              >
                <option value="weekly">Weekly Sales Report</option>
                <option value="monthly">Monthly Performance</option>
                <option value="inventory">Inventory Summary</option>
                <option value="staff">Staff Analytics</option>
                <option value="revenue">Revenue Breakdown</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Frequency
              </label>
              <select 
                value={schedule.frequency}
                onChange={(e) => handleScheduleChange('frequency', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Delivery Day
              </label>
              <select 
                value={schedule.day}
                onChange={(e) => handleScheduleChange('day', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Delivery Time
              </label>
              <input
                type="time"
                value={schedule.time}
                onChange={(e) => handleScheduleChange('time', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
              Recipients (Email)
            </label>
            <input
              type="text"
              value={schedule.recipients}
              onChange={(e) => handleScheduleChange('recipients', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.9rem'
              }}
              placeholder="Enter email addresses separated by commas"
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
              Report Format
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['pdf', 'excel', 'csv', 'html'].map((format) => (
                <label key={format} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value={format}
                    checked={schedule.format === format}
                    onChange={(e) => handleScheduleChange('format', e.target.value)}
                    style={{ accentColor: SECTION_COLOR }}
                  />
                  <span style={{ color: 'white', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    {format}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button 
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: `rgba(${SECTION_COLOR_RGB}, 0.3)`,
              border: `1px solid rgba(${SECTION_COLOR_RGB}, 0.5)`,
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = `rgba(${SECTION_COLOR_RGB}, 0.5)`;
              target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = `rgba(${SECTION_COLOR_RGB}, 0.3)`;
              target.style.transform = 'translateY(0)';
            }}
            onClick={generateReport}
          >
            🚀 Schedule Report
          </button>
        </AnimatedCard>

        {/* Scheduled Reports */}
        <AnimatedCard
          title="📋 Active Reports"
          description="Currently scheduled automated reports"
          index={1}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            {scheduledReports.map((report, index) => (
              <ReportItem
                key={index}
                title={report.title}
                description={report.description}
                icon={report.icon}
                status={report.status}
                index={index}
              />
            ))}
          </div>
        </AnimatedCard>

        {/* Quick Actions */}
        <AnimatedCard
          title="⚡ Quick Actions"
          index={2}
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
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = `rgba(${SECTION_COLOR_RGB}, 0.2)`;
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = `0 4px 15px rgba(${SECTION_COLOR_RGB}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = 'rgba(255, 255, 255, 0.1)';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
            }}
            >
              📊 Generate Now
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
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = `rgba(${SECTION_COLOR_RGB}, 0.2)`;
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = `0 4px 15px rgba(${SECTION_COLOR_RGB}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = 'rgba(255, 255, 255, 0.1)';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
            }}
            >
              🎯 Custom Report
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
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = `rgba(${SECTION_COLOR_RGB}, 0.2)`;
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = `0 4px 15px rgba(${SECTION_COLOR_RGB}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = 'rgba(255, 255, 255, 0.1)';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
            }}
            >
              📈 View Analytics
            </button>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}