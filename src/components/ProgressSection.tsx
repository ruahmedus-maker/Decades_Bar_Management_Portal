'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { submitAcknowledgement, getProgressBreakdown } from '@/lib/progress';

export default function ProgressSection() {
  const { currentUser } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChecked, setIsChecked] = useState(currentUser?.acknowledged || false);

  const progressBreakdown = currentUser ? getProgressBreakdown(currentUser) : null;
  const progress = progressBreakdown?.progress || 0;
  const canAcknowledge = progressBreakdown?.canAcknowledge || false;

  // Update checkbox when user changes
  useEffect(() => {
    setIsChecked(currentUser?.acknowledged || false);
  }, [currentUser?.acknowledged]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    
    if (checked && currentUser && canAcknowledge && !currentUser.acknowledged) {
      submitAcknowledgement(currentUser.email);
      alert('Acknowledgement submitted successfully!');
      // Refresh to show updated state
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleSubmit = () => {
    if (currentUser && canAcknowledge && !currentUser.acknowledged) {
      submitAcknowledgement(currentUser.email);
      setIsChecked(true);
      alert('Acknowledgement submitted successfully!');
      // Refresh to show updated state
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // Collapsed view
  if (isCollapsed) {
    return (
      <div 
        className="progress-section collapsed" 
        onClick={() => setIsCollapsed(false)}
        style={{ 
          background: 'white', 
          padding: '12px 20px', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          marginTop: '20px',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '60px', 
              height: '8px', 
              background: '#e2e8f0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #d4af37, #f7d070)',
                borderRadius: '4px'
              }}></div>
            </div>
            <span style={{ fontWeight: 'bold', color: '#1a365d' }}>
              Progress: {progress}%
            </span>
            {currentUser?.acknowledged && (
              <span style={{ color: '#38a169', fontSize: '0.8rem' }}>✓ Acknowledged</span>
            )}
          </div>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>▼ Click to expand</span>
        </div>
      </div>
    );
  }

  // Expanded view
  return (
    <div className="progress-section" style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid #e2e8f0',
      marginTop: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1a365d' }}>Your Training Progress</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ 
            fontWeight: 'bold', 
            color: '#d4af37',
            fontSize: '1.1rem'
          }}>{progress}% Complete</span>
          <button 
            onClick={() => setIsCollapsed(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '1.2rem',
              color: '#666',
              padding: '5px'
            }}
          >
            ▲
          </button>
        </div>
      </div>
      
      <p style={{ marginBottom: '15px', color: '#666', fontSize: '0.9rem' }}>
        Track your progress through the training materials. Complete all sections and acknowledge reading this guide.
      </p>
      
      <div className="progress-bar" style={{ 
        height: '12px', 
        background: '#e2e8f0', 
        borderRadius: '6px',
        marginBottom: '15px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div 
          style={{ 
            height: '100%', 
            background: 'linear-gradient(90deg, #d4af37, #f7d070)',
            width: `${progress}%`,
            transition: 'width 0.3s ease',
            borderRadius: '6px'
          }}
        ></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '10px',
          fontWeight: 'bold',
          color: progress > 50 ? 'white' : '#1a365d',
          textShadow: progress > 50 ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
          pointerEvents: 'none'
        }}>
          {progress}%
        </div>
      </div>

      {/* Progress Details */}
      {progressBreakdown && (
        <div style={{ 
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '15px',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <strong>Sections Completed:</strong><br />
              {progressBreakdown.sectionsVisited} / {progressBreakdown.totalSections}
            </div>
            <div>
              <strong>Progress:</strong><br />
              {progressBreakdown.progress}%
            </div>
            <div>
              <strong>Can Acknowledge:</strong><br />
              {progressBreakdown.canAcknowledge ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Status:</strong><br />
              {currentUser?.acknowledged ? 'Acknowledged' : 'Pending'}
            </div>
          </div>
          {!progressBreakdown.canAcknowledge && (
            <div style={{ marginTop: '10px', padding: '8px', background: '#fed7d7', borderRadius: '4px', fontSize: '0.75rem' }}>
              ⚠️ Visit all {progressBreakdown.totalSections} sections to enable acknowledgement
            </div>
          )}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        marginBottom: '15px'
      }}>
        <input 
          type="checkbox" 
          id="acknowledgement" 
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={!canAcknowledge || currentUser?.acknowledged}
          style={{ 
            marginRight: '10px', 
            marginTop: '3px',
            width: '18px',
            height: '18px',
            cursor: (canAcknowledge && !currentUser?.acknowledged) ? 'pointer' : 'default'
          }}
        />
        <label 
          htmlFor="acknowledgement" 
          style={{ 
            fontSize: '0.9rem', 
            lineHeight: '1.4',
            cursor: (canAcknowledge && !currentUser?.acknowledged) ? 'pointer' : 'default',
            color: (!canAcknowledge || currentUser?.acknowledged) ? '#666' : '#000'
          }}
          onClick={() => {
            if (canAcknowledge && !currentUser?.acknowledged) {
              setIsChecked(!isChecked);
            }
          }}
        >
          I acknowledge that I have read and understood all the materials in this Bar Resource Guide and will adhere to the procedures and standards outlined.
          {!canAcknowledge && !currentUser?.acknowledged && (
            <span style={{ display: 'block', color: '#e53e3e', fontSize: '0.8rem', marginTop: '5px' }}>
              (Complete all sections to enable this option)
            </span>
          )}
        </label>
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={!canAcknowledge || currentUser?.acknowledged}
        style={{ 
          width: '100%',
          padding: '12px',
          backgroundColor: (canAcknowledge && !currentUser?.acknowledged) ? '#d4af37' : '#a0aec0',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: (canAcknowledge && !currentUser?.acknowledged) ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
          fontSize: '1rem',
          transition: 'background-color 0.3s ease',
          marginBottom: '10px'
        }}
      >
        {currentUser?.acknowledged ? '✓ Acknowledgement Submitted' : 'Submit Acknowledgement'}
      </button>
    </div>
  );
}