'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { submitAcknowledgement, getProgressBreakdown, trackSectionVisit } from '@/lib/progress';
import { storage } from '@/lib/storage';

const PRIMARY_COLOR = '#7FB685';
const LIGHT_COLOR = '#9DCC9A';
const DARK_COLOR = '#5A9E6B';
const PRIMARY_COLOR_RGB = '127, 182, 133';

export default function ProgressSection() {
  const { currentUser } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progressBreakdown, setProgressBreakdown] = useState<any>(null);
  
  // Use ref for refresh counter to avoid re-renders
  const refreshCounterRef = useRef(0);
  const mountedRef = useRef(false);

  // Force refresh function that definitely works
  const forceRefresh = useCallback(() => {
    console.log('🔄 Force refresh triggered, counter:', refreshCounterRef.current + 1);
    refreshCounterRef.current += 1;
    
    if (currentUser) {
      const users = storage.getUsers();
      const latestUser = users[currentUser.email];
      console.log('📊 Latest user from storage:', latestUser);
      
      if (latestUser) {
        const breakdown = getProgressBreakdown(latestUser);
        console.log('📈 New progress breakdown:', breakdown);
        setProgressBreakdown(breakdown);
        
        // Update UI states
        setIsCollapsed(latestUser.acknowledged || false);
        setIsChecked(latestUser.acknowledged || false);
        setShowSuccess(latestUser.acknowledged || false);
      }
    }
  }, [currentUser]);

  // Initialize and set up periodic refresh
  useEffect(() => {
    if (currentUser && !mountedRef.current) {
      console.log('🚀 ProgressSection initializing');
      mountedRef.current = true;
      forceRefresh();
    }
  }, [currentUser, forceRefresh]);

  const progress = progressBreakdown?.progress || 0;
  const canAcknowledge = progressBreakdown?.canAcknowledge || false;
  const sectionDetails = progressBreakdown?.sectionDetails || [];

  // Simple, direct button handlers
  const handleRefresh = () => {
    console.log('🎯 Refresh button clicked directly');
    forceRefresh();
  };

  const handleDebug = () => {
    console.log('=== DEBUG INFO ===');
    console.log('Current User:', currentUser);
    console.log('Progress Breakdown:', progressBreakdown);
    
    if (currentUser) {
      const users = storage.getUsers();
      const user = users[currentUser.email];
      console.log('User from Storage:', user);
      
      // Check the problematic sections
      console.log('Aloha-pos section:', user?.sectionVisits?.['aloha-pos']);
      console.log('Drinks-specials section:', user?.sectionVisits?.['drinks-specials']);
      console.log('Are they completed?', {
        'aloha-pos': user?.sectionVisits?.['aloha-pos']?.completed,
        'drinks-specials': user?.sectionVisits?.['drinks-specials']?.completed
      });
    }
    
    alert('Check console for debug info!');
  };

  const handleForceComplete = (sectionId: string) => {
    console.log('⚡ Force completing:', sectionId);
    if (currentUser) {
      // Direct storage manipulation to ensure it works
      const users = storage.getUsers();
      const user = users[currentUser.email];
      
      if (user) {
        if (!user.sectionVisits) user.sectionVisits = {};
        
        user.sectionVisits[sectionId] = {
          sectionId,
          firstVisit: new Date().toISOString(),
          lastVisit: new Date().toISOString(),
          totalTime: 30,
          completed: true
        };
        
        // Update visitedSections for backward compatibility
        if (!user.visitedSections) user.visitedSections = [];
        if (!user.visitedSections.includes(sectionId)) {
          user.visitedSections.push(sectionId);
        }
        
        storage.saveUsers(users);
        console.log(`✅ Manually completed ${sectionId}`);
        
        // Refresh to show changes
        setTimeout(forceRefresh, 100);
      }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '1.2rem',
            color: PRIMARY_COLOR,
          }}>
            {progress}% Complete
          </span>
          
          {/* Debug Button */}
          <button 
            onClick={handleDebug}
            style={{ 
              background: `rgba(255, 0, 0, 0.3)`, 
              border: `2px solid rgba(255, 0, 0, 0.6)`, 
              cursor: 'pointer', 
              fontSize: '0.8rem',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            🐛 Debug
          </button>

          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            style={{ 
              background: `rgba(${PRIMARY_COLOR_RGB}, 0.3)`, 
              border: `2px solid rgba(${PRIMARY_COLOR_RGB}, 0.6)`, 
              cursor: 'pointer', 
              fontSize: '0.8rem',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            🔄 Refresh
          </button>

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
        {sectionDetails.map((detail: any) => (
          <div key={detail.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{detail.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{ 
                  fontSize: '0.85rem', 
                  color: detail.completed ? '#90EE90' : '#FF6B6B',
                  fontWeight: 'bold'
                }}>
                  {detail.completed ? '✅ Completed' : '❌ Incomplete'}
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {detail.timeSpent}s / {detail.timeRequired}s
                </span>
              </div>
              
              {/* Force Complete Button - Always show for debugging */}
              <button
                onClick={() => handleForceComplete(detail.id)}
                style={{
                  background: detail.completed ? 'rgba(144, 238, 144, 0.3)' : 'rgba(255, 107, 107, 0.3)',
                  border: `2px solid ${detail.completed ? '#90EE90' : '#FF6B6B'}`,
                  color: 'white',
                  fontSize: '0.7rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {detail.completed ? '✓ Done' : 'Force Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Debug Info */}
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '0.8rem',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Debug Info:</div>
        <div>User: {currentUser?.email}</div>
        <div>Refresh Counter: {refreshCounterRef.current}</div>
        <div>Mounted: {mountedRef.current ? 'Yes' : 'No'}</div>
      </div>
      
      {/* Acknowledgement Section */}
      {canAcknowledge && !currentUser?.acknowledged && (
        <div style={{ 
          background: `rgba(${PRIMARY_COLOR_RGB}, 0.08)`,
          padding: '16px',
          borderRadius: '10px',
          border: `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.25)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <input
              type="checkbox"
              id="acknowledgement"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
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
            onClick={() => {
              if (currentUser && canAcknowledge && !currentUser.acknowledged) {
                submitAcknowledgement(currentUser.email);
                setShowSuccess(true);
                setIsCollapsed(true);
                setTimeout(forceRefresh, 100);
              }
            }}
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