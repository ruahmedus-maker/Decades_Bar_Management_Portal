'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';

// REMOVE these unused imports:
// import { submitAcknowledgement, getProgressBreakdown, subscribeToProgress, isSectionCompleted } from '@/lib/progress';

// Add only the imports you actually use:
import { submitAcknowledgement, subscribeToProgress } from '@/lib/progress';

// REMOVE the unused interface (if not used anywhere):
// interface ProgressBreakdown {
//   progress: number;
//   canAcknowledge: boolean;
//   sectionDetails: SectionDetail[];
// }

// Define only the interfaces you actually use
interface SectionDetail {
  id: string;
  label: string;
  completed: boolean;
  timeSpent: number;
  timeRequired: number;
}

const PRIMARY_COLOR = '#7FB685';
const LIGHT_COLOR = '#9DCC9A';
const DARK_COLOR = '#5A9E6B';
const PRIMARY_COLOR_RGB = '127, 182, 133';

export default function ProgressSection() {
  const { currentUser, userProgress, refreshProgress, trackVisit } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const mountedRef = useRef(false);

  // Load progress data
  const loadProgress = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      await refreshProgress();
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, refreshProgress]);

  // Initialize and set up real-time subscription
  useEffect(() => {
    if (currentUser) {
      console.log('🚀 ProgressSection initializing for Supabase');
      loadProgress();

      // Set up real-time subscription for progress updates
      const subscription = subscribeToProgress(currentUser.email, (progress) => {
        console.log('🔔 Real-time progress update received');
        refreshProgress();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.email]); // Only re-subscribe when user email changes

  // Update UI states when userProgress changes
  useEffect(() => {
    if (userProgress && currentUser) {
      console.log('📊 Progress data updated:', userProgress);
      setIsCollapsed(currentUser.acknowledged || false);
      setIsChecked(currentUser.acknowledged || false);
      setShowSuccess(currentUser.acknowledged || false);
    }
  }, [userProgress, currentUser]);

  // Simple progress fallback if breakdown is null
  const progress = userProgress?.progress || 0;
  const canAcknowledge = userProgress?.canAcknowledge || false;
  const sectionDetails = userProgress?.sectionDetails || [];

  // Simple, direct button handlers
  const handleRefresh = async () => {
    console.log('🎯 Refresh button clicked');
    await loadProgress();
  };

  const handleDebug = () => {
    console.log('=== DEBUG INFO ===');
    console.log('Current User:', currentUser);
    console.log('User Progress from Context:', userProgress);
    console.log('Progress:', progress);
    console.log('Can Acknowledge:', canAcknowledge);
    console.log('Section Details:', sectionDetails);

    alert('Check console for debug info!');
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
              }} />
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
            disabled={loading}
            style={{
              background: loading
                ? 'rgba(255,255,255,0.2)'
                : `rgba(${PRIMARY_COLOR_RGB}, 0.3)`,
              border: loading
                ? '2px solid rgba(255,255,255,0.4)'
                : `2px solid rgba(${PRIMARY_COLOR_RGB}, 0.6)`,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem',
              color: loading ? 'rgba(255,255,255,0.5)' : 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            {loading ? '⏳' : '🔄'} Refresh
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
          }} />
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
        {sectionDetails.map((detail: SectionDetail) => (
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
            </div>
          </div>
        ))}
      </div>

      {/* Cloud Status */}
      <div style={{
        background: 'rgba(45, 212, 191, 0.1)',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '0.8rem',
        border: '1px solid rgba(45, 212, 191, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ color: '#2DD4BF', fontWeight: 'bold' }}>🔄</span>
        <div>
          <div style={{ fontWeight: 'bold', color: '#2DD4BF' }}>Cloud Sync Active</div>
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>Progress syncs across all devices in real-time</div>
        </div>
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
            onClick={async () => {
              if (currentUser && canAcknowledge && !currentUser.acknowledged && isChecked) {
                try {
                  await submitAcknowledgement(currentUser.email);
                  setShowSuccess(true);
                  setIsCollapsed(true);
                  // Refresh to get updated user data with acknowledgement
                  setTimeout(loadProgress, 100);
                } catch (error) {
                  console.error('Error submitting acknowledgement:', error);
                }
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