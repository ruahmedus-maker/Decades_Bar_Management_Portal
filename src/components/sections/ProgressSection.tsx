'use client';

import { useApp } from '@/contexts/AppContext';

export default function ProgressSection() {
  const { currentUser, submitAck } = useApp();

  const handleSubmit = () => {
    submitAck();
  };

  return (
    <div className="progress-section">
      <div className="progress-header">
        <h3>Training Progress</h3>
        <span id="progress-text">{currentUser?.progress || 0}% Complete</span>
      </div>
      <p>Track your progress through the training materials. Complete all sections and acknowledge reading this guide.</p>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          id="progress-fill"
          style={{ width: `${currentUser?.progress || 0}%` }}
        ></div>
      </div>
      
      <div className="checkbox-container">
        <input 
          type="checkbox" 
          id="acknowledgement" 
          checked={currentUser?.acknowledged || false}
          readOnly
        />
        <label htmlFor="acknowledgement">
          I acknowledge that I have read and understood all the materials in this Bar Resource Guide and will adhere to the procedures and standards outlined.
        </label>
      </div>
      
      <button 
        className="btn" 
        id="submit-btn" 
        onClick={handleSubmit}
        disabled={currentUser?.acknowledged}
        style={{ 
          marginTop: '15px',
          backgroundColor: currentUser?.acknowledged ? '#a0aec0' : '',
          cursor: currentUser?.acknowledged ? 'not-allowed' : 'pointer'
        }}
      >
        {currentUser?.acknowledged ? 'Acknowledgement Submitted' : 'Submit Acknowledgement'}
      </button>
    </div>
  );
}