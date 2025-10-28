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

export default function ProgressSection() {
  const { currentUser } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(currentUser?.acknowledged || false);
  const [isChecked, setIsChecked] = useState(currentUser?.acknowledged || false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // Glass effect base styles
  const glassStyle = {
    background: 'linear-gradient(135deg, rgba(74, 21, 75, 0.8), rgba(74, 21, 75, 0.95))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 127, 80, 0.4)',
    borderRadius: '16px',
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    transition: 'all 0.3s ease'
  };

  const hoverGlassStyle = {
    ...glassStyle,
    boxShadow: '0 12px 30px rgba(255, 127, 80, 0.25)',
    transform: 'translateY(-3px)'
  };

  // Success message view
  if (showSuccess && currentUser?.acknowledged) {
    return (
      <div style={{ 
        ...glassStyle,
        background: 'linear-gradient(135deg, rgba(255, 127, 80, 0.15), rgba(255, 127, 80, 0.25))',
        border: '1px solid rgba(255, 127, 80, 0.3)',
        padding: '25px', 
        marginTop: '20px',
        textAlign: 'center' as const
      }}>
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(74, 21, 75, 0.7), rgba(255, 127, 80, 0.4))',
          zIndex: -1
        }}/>
        <div style={{ fontSize: '2.5rem', marginBottom: '15px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🎉</div>
        <h3 style={{ margin: 0, marginBottom: '15px', fontSize: '1.5rem', fontWeight: 600 }}>
          Training Completed!
        </h3>
        <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9, marginBottom: '20px' }}>
          Thank you for completing the training and submitting your acknowledgement.
        </p>
        <div style={{ 
          marginTop: '15px', 
          padding: '12px 20px', 
          background: 'rgba(255,255,255,0.15)', 
          borderRadius: '10px',
          fontSize: '1rem',
          display: 'inline-block',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(5px)'
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
          ...(isHovered ? hoverGlassStyle : glassStyle),
          padding: '16px 20px', 
          marginTop: '20px',
          cursor: 'pointer'
        }}
        onClick={() => setIsCollapsed(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(255, 127, 80, 0.1), rgba(74, 21, 75, 0.9))' 
            : 'linear-gradient(135deg, rgba(74, 21, 75, 0.7), rgba(74, 21, 75, 0.9))',
          zIndex: -1
        }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '80px', 
              height: '10px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '5px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
            }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #FF7F50, #FFA07A)',
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(255, 127, 80, 0.5)',
                transition: 'width 0.5s ease'
              }}/>
            </div>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
              Progress: {progress}%
            </span>
            {currentUser?.acknowledged && (
              <span style={{ 
                color: '#90EE90', 
                fontSize: '0.85rem',
                background: 'rgba(144, 238, 144, 0.2)',
                padding: '4px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(144, 238, 144, 0.3)'
              }}>
                ✓ Acknowledged
              </span>
            )}
          </div>
          <span style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '0.9rem'
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
        ...(isHovered ? hoverGlassStyle : glassStyle),
        padding: '25px', 
        marginTop: '20px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(255, 127, 80, 0.15), rgba(74, 21, 75, 0.95))' 
          : 'linear-gradient(135deg, rgba(74, 21, 75, 0.8), rgba(74, 21, 75, 0.95))',
        zIndex: -1
      }}/>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.4rem', 
          fontWeight: 600,
          background: 'linear-gradient(90deg, #FF7F50, #FFA07A)',
          WebkitBackgroundClip: 'text' as const,
          WebkitTextFillColor: 'transparent' as const,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}>
          Your Training Progress
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '1.3rem',
            background: 'linear-gradient(90deg, #FF7F50, #FFA07A)',
            WebkitBackgroundClip: 'text' as const,
            WebkitTextFillColor: 'transparent' as const,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}>
            {progress}% Complete
          </span>
          <button 
            onClick={() => setIsCollapsed(true)}
            style={{ 
              background: 'rgba(255, 127, 80, 0.2)', 
              border: '1px solid rgba(255, 127, 80, 0.4)', 
              cursor: 'pointer', 
              fontSize: '1.2rem',
              color: '#FF7F50',
              padding: '8px 12px',
              borderRadius: '8px',
              backdropFilter: 'blur(5px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 127, 80, 0.4)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 127, 80, 0.2)';
              e.currentTarget.style.color = '#FF7F50';
            }}
          >
            ▲
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '8px',
          fontSize: '0.95rem',
          color: 'rgba(255,255,255,0.8)'
        }}>
          <span>Training Completion</span>
          <span>{progress}%</span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '12px', 
          background: 'rgba(255,255,255,0.15)', 
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #FF7F50, #FFA07A)',
            borderRadius: '6px',
            boxShadow: '0 0 15px rgba(255, 127, 80, 0.5)',
            transition: 'width 0.8s ease'
          }}/>
        </div>
      </div>
      
      {/* Progress Details */}
      <div style={{ 
        background: 'rgba(255,255,255,0.1)',
        padding: '18px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.15)',
        marginBottom: '25px',
        backdropFilter: 'blur(5px)'
      }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '1.1rem',
          color: '#FFA07A'
        }}>
          Progress Breakdown
        </h4>
        {sectionDetails.map((detail) => (
          <div key={detail.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ fontSize: '0.95rem' }}>{detail.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                fontSize: '0.9rem', 
                color: detail.completed ? '#90EE90' : '#FFB6C1',
                fontWeight: 500
              }}>
                {detail.completed ? 'Completed' : 'Incomplete'}
              </span>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: detail.completed 
                  ? 'linear-gradient(135deg, #90EE90, #32CD32)' 
                  : 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
                boxShadow: detail.completed 
                  ? '0 0 8px rgba(144, 238, 144, 0.5)' 
                  : '0 0 8px rgba(255, 182, 193, 0.5)'
              }}/>
            </div>
          </div>
        ))}
      </div>
      
      {/* Acknowledgement Section */}
      {canAcknowledge && !currentUser?.acknowledged && (
        <div style={{ 
          background: 'rgba(255, 127, 80, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 127, 80, 0.3)',
          marginBottom: '20px',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px' }}>
            <input
              type="checkbox"
              id="acknowledgement"
              checked={isChecked}
              onChange={handleCheckboxChange}
              style={{
                width: '20px',
                height: '20px',
                accentColor: '#FF7F50',
                cursor: 'pointer',
                marginTop: '2px'
              }}
            />
            <label 
              htmlFor="acknowledgement" 
              style={{ 
                cursor: 'pointer',
                fontSize: '1rem',
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
              padding: '14px',
              background: isChecked 
                ? 'linear-gradient(135deg, #FF7F50, #FF6347)' 
                : 'rgba(255,255,255,0.1)',
              color: isChecked ? 'white' : 'rgba(255,255,255,0.5)',
              border: isChecked 
                ? '1px solid rgba(255, 127, 80, 0.5)' 
                : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isChecked ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)',
              boxShadow: isChecked ? '0 4px 15px rgba(255, 127, 80, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (isChecked) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 127, 80, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (isChecked) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 127, 80, 0.3)';
              }
            }}
          >
            Submit Acknowledgement
          </button>
        </div>
      )}
      
      {currentUser?.acknowledged && (
        <div style={{ 
          textAlign: 'center' as const,
          padding: '15px',
          background: 'rgba(144, 238, 144, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(144, 238, 144, 0.3)',
          color: '#90EE90',
          fontSize: '1rem',
          fontWeight: 500,
          backdropFilter: 'blur(5px)'
        }}>
          ✓ Training Acknowledged
        </div>
      )}
    </div>
  );
}