'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { submitAcknowledgement, getProgressBreakdown } from '@/lib/progress';

// Define the sections for display (matching your progress.ts)
const ALL_SECTIONS = [
  'welcome',
  'training',
  'uniform-guide',
  'social-media',
  'resources',
  'procedures',
  'policies',
  'glassware-guide',
  'faq',
  'drinks-specials',
  'comps-voids',
  'cocktails',
  'aloha-pos',
  'bar-cleanings'
];

// Define the new color theme - Coral Green Mid-Tone
const PRIMARY_COLOR = '#7FB685'; // Mid-tone coral green
const LIGHT_COLOR = '#9DCC9A'; // Lighter coral green
const DARK_COLOR = '#5A9E6B'; // Darker coral green
const PRIMARY_COLOR_RGB = '127, 182, 133';

export default function ProgressSection() {
  const { currentUser } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(currentUser?.acknowledged || false);
  const [isChecked, setIsChecked] = useState(currentUser?.acknowledged || false);
  const [showSuccess, setShowSuccess] = useState(false);

  const progressBreakdown = currentUser ? getProgressBreakdown(currentUser) : null;
  const progress = progressBreakdown?.progress || 0;
  const canAcknowledge = progressBreakdown?.canAcknowledge || false;

  // Get visited sections from user or empty array
  const visitedSections = currentUser?.visitedSections || [];
  
  // Create details object for display
  const sectionDetails = ALL_SECTIONS.map(section => {
    const label = section.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return {
      id: section,
      label,
      completed: visitedSections.includes(section)
    };
  });

  // Auto-collapse and show success when acknowledged
  useEffect(() => {
    if (currentUser?.acknowledged) {
      setIsCollapsed(true);
      setShowSuccess(true);
    }
  }, [currentUser?.acknowledged]);

  // Update checkbox when user changes
  useEffect(() => {
    setIsChecked(currentUser?.acknowledged || false);
  }, [currentUser?.acknowledged]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    
    if (checked && currentUser && canAcknowledge && !currentUser.acknowledged) {
      submitAcknowledgement(currentUser.email);
      setShowSuccess(true);
      setIsCollapsed(true);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleSubmit = () => {
    if (currentUser && canAcknowledge && !currentUser.acknowledged) {
      submitAcknowledgement(currentUser.email);
      setIsChecked(true);
      setShowSuccess(true);
      setIsCollapsed(true);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // Don't show progress section for managers, admins, or owners
  const shouldShowProgress = currentUser && 
    (currentUser.position === 'Bartender' || currentUser.position === 'Trainee');

  if (!shouldShowProgress) {
    return null;
  }

  // Glass effect base styles with coral green theme
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    border: `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.3)`,
    borderRadius: '12px',
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Success message view
  if (showSuccess && currentUser?.acknowledged) {
    return (
      <div style={{ 
        ...glassStyle,
        background: `linear-gradient(135deg, rgba(${PRIMARY_COLOR_RGB}, 0.15), rgba(${PRIMARY_COLOR_RGB}, 0.25))`,
        border: `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.4)`,
        padding: '20px', 
        marginTop: '16px',
        textAlign: 'center' as const
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎉</div>
        <h3 style={{ margin: 0, marginBottom: '12px', fontSize: '1.3rem', fontWeight: 600 }}>
          Training Completed!
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9, marginBottom: '16px' }}>
          Thank you for completing the training and submitting your acknowledgement.
        </p>
        <div style={{ 
          marginTop: '12px', 
          padding: '10px 16px', 
          background: 'rgba(255,255,255,0.12)', 
          borderRadius: '8px',
          fontSize: '0.95rem',
          display: 'inline-block',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <strong>Progress: 100% Complete</strong>
        </div>
      </div>
    );
  }

  // Collapsed view
  if (isCollapsed) {
    return (
      <div 
        style={{ 
          ...glassStyle,
          padding: '14px 16px', 
          marginTop: '16px',
          cursor: 'pointer'
        }}
        onClick={() => setIsCollapsed(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '60px', 
              height: '8px', 
              background: 'rgba(255,255,255,0.15)', 
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${LIGHT_COLOR})`,
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}/>
            </div>
            <span style={{ fontWeight: 600, fontSize: '1rem' }}>
              Progress: {progress}%
            </span>
            {currentUser?.acknowledged && (
              <span style={{ 
                color: '#90EE90', 
                fontSize: '0.8rem',
                background: 'rgba(144, 238, 144, 0.15)',
                padding: '3px 6px',
                borderRadius: '10px',
                border: '1px solid rgba(144, 238, 144, 0.3)'
              }}>
                ✓ Acknowledged
              </span>
            )}
          </div>
          <span style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.85rem'
          }}>
            ▼ Click to expand
          </span>
        </div>
      </div>
    );
  }

  // Expanded view
  return (
    <div 
      style={{ 
        ...glassStyle,
        padding: '20px', 
        marginTop: '16px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.3rem', 
          fontWeight: 600,
          color: PRIMARY_COLOR,
        }}>
          Your Training Progress
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '1.2rem',
            color: PRIMARY_COLOR,
          }}>
            {progress}% Complete
          </span>
          <button 
            onClick={() => setIsCollapsed(true)}
            style={{ 
              background: `rgba(${PRIMARY_COLOR_RGB}, 0.15)`, 
              border: `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.3)`, 
              cursor: 'pointer', 
              fontSize: '1.1rem',
              color: PRIMARY_COLOR,
              padding: '6px 10px',
              borderRadius: '6px',
            }}
          >
            ▲
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '6px',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.8)'
        }}>
          <span>Training Completion</span>
          <span>{progress}%</span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '10px', 
          background: 'rgba(255,255,255,0.12)', 
          borderRadius: '5px',
          overflow: 'hidden',
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${LIGHT_COLOR})`,
            borderRadius: '5px',
            transition: 'width 0.5s ease'
          }}/>
        </div>
      </div>
      
      {/* Progress Details */}
      <div style={{ 
        background: 'rgba(255,255,255,0.06)',
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.12)',
        marginBottom: '20px',
      }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '1rem',
          color: LIGHT_COLOR
        }}>
          Progress Breakdown
        </h4>
        {sectionDetails.map((detail) => (
          <div key={detail.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '6px 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span style={{ fontSize: '0.9rem' }}>{detail.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: '0.85rem', 
                color: detail.completed ? '#90EE90' : '#FFB6C1',
                fontWeight: 500
              }}>
                {detail.completed ? 'Completed' : 'Incomplete'}
              </span>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: detail.completed 
                  ? `linear-gradient(135deg, ${PRIMARY_COLOR}, ${LIGHT_COLOR})` 
                  : 'rgba(255,255,255,0.3)',
              }}/>
            </div>
          </div>
        ))}
      </div>
      
      {/* Acknowledgement Section */}
      {canAcknowledge && !currentUser?.acknowledged && (
        <div style={{ 
          background: `rgba(${PRIMARY_COLOR_RGB}, 0.08)`,
          padding: '16px',
          borderRadius: '10px',
          border: `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.25)`,
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <input
              type="checkbox"
              id="acknowledgement"
              checked={isChecked}
              onChange={handleCheckboxChange}
              style={{
                width: '18px',
                height: '18px',
                accentColor: PRIMARY_COLOR,
                cursor: 'pointer',
                marginTop: '2px'
              }}
            />
            <label 
              htmlFor="acknowledgement" 
              style={{ 
                cursor: 'pointer',
                fontSize: '0.95rem',
                lineHeight: 1.4
              }}
            >
              I acknowledge that I have completed all required training sections and understand the material presented.
            </label>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!isChecked}
            style={{
              width: '100%',
              padding: '12px',
              background: isChecked 
                ? `linear-gradient(135deg, ${PRIMARY_COLOR}, ${DARK_COLOR})` 
                : 'rgba(255,255,255,0.08)',
              color: isChecked ? 'white' : 'rgba(255,255,255,0.5)',
              border: isChecked 
                ? `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.4)` 
                : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: isChecked ? 'pointer' : 'not-allowed',
            }}
          >
            Submit Acknowledgement
          </button>
        </div>
      )}
      
      {currentUser?.acknowledged && (
        <div style={{ 
          textAlign: 'center' as const,
          padding: '12px',
          background: `rgba(${PRIMARY_COLOR_RGB}, 0.12)`,
          borderRadius: '8px',
          border: `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.3)`,
          color: LIGHT_COLOR,
          fontSize: '0.95rem',
          fontWeight: 500,
        }}>
          ✓ Training Acknowledged
        </div>
      )}
    </div>
  );
}