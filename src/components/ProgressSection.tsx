'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { submitAcknowledgement, getProgressBreakdown } from '@/lib/progress';

export default function ProgressSection() {
  const { currentUser } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(currentUser?.acknowledged || false);
  const [isChecked, setIsChecked] = useState(currentUser?.acknowledged || false);
  const [showSuccess, setShowSuccess] = useState(false);

  const progressBreakdown = currentUser ? getProgressBreakdown(currentUser) : null;
  const progress = progressBreakdown?.progress || 0;
  const canAcknowledge = progressBreakdown?.canAcknowledge || false;

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
      // Refresh to show updated state
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleSubmit = () => {
    if (currentUser && canAcknowledge && !currentUser.acknowledged) {
      submitAcknowledgement(currentUser.email);
      setIsChecked(true);
      setShowSuccess(true);
      setIsCollapsed(true);
      // Refresh to show updated state
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // Don't show progress section for managers, admins, or owners
  const shouldShowProgress = currentUser && 
    (currentUser.position === 'Bartender' || currentUser.position === 'Trainee');

  if (!shouldShowProgress) {
    return null; // Don't render anything for non-bartenders/trainees
  }

  // Success message view (when acknowledged)
  if (showSuccess && currentUser?.acknowledged) {
    return (
      <div 
        className="progress-section success" 
        style={{ 
          background: 'linear-gradient(135deg, #38a169, #48bb78)',
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #38a169',
          marginTop: '20px',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎉</div>
        <h3 style={{ margin: 0, marginBottom: '10px', fontSize: '1.3rem' }}>
          Training Completed!
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>
          Thank you for completing the training and submitting your acknowledgement.
        </p>
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '6px',
          fontSize: '0.9rem'
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

  // Expanded view (existing code, but with position check removed since we already filtered)
  return (
    <div className="progress-section" style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid #e2e8f0',
      marginTop: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {/* ... rest of your existing expanded view code ... */}
      {/* Keep all your existing expanded view content here */}
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
      
      {/* ... rest of your existing progress bar, details, checkbox, and button ... */}
    </div>
  );
}