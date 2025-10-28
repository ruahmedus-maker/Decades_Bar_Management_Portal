'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';

export default function MaintenanceSection() {
  const { currentUser, showToast } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    floor: '2000s' as '2000s' | '2010s' | 'Hip Hop' | 'Rooftop',
    location: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      const ticketData = {
        floor: ticketForm.floor,
        location: ticketForm.location,
        title: ticketForm.title,
        description: ticketForm.description,
        reportedBy: currentUser.name,
        reportedByEmail: currentUser.email,
        status: 'open' as const,
        priority: ticketForm.priority,
        assignedTo: undefined
      };

      storage.createMaintenanceTicket(ticketData);
      
      showToast('Maintenance ticket submitted successfully!');
      
      // Reset form
      setTicketForm({
        floor: '2000s',
        location: '',
        title: '',
        description: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error submitting maintenance ticket:', error);
      showToast('Error submitting ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section hover styles
  const sectionStyle = {
    transition: 'all 0.3s ease',
    borderRadius: '12px',
    padding: '20px'
  };

  const sectionHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)'
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(212, 175, 55, 0.15)'
  };

  return (
    <div 
      className="section active" 
      style={sectionStyle}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, sectionHoverStyle)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, sectionStyle)}
    >
      <div className="section-header">
        <h3>Maintenance Request</h3>
        <span className="badge">Report Issues</span>
      </div>

      <div 
        className="card"
        style={{ transition: 'all 0.3s ease' }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}
      >
        <div className="card-header">
          <h4>Create Maintenance Ticket</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Floor / Area *</label>
                <select
                  value={ticketForm.floor}
                  onChange={(e) => setTicketForm({ ...ticketForm, floor: e.target.value as any })}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                  required
                >
                  <option value="2000s">2000's</option>
                  <option value="2010s">2010's</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Rooftop">Rooftop</option>
                </select>
              </div>
              
              <div>
                <label>Priority *</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Location / Title *</label>
              <input
                type="text"
                value={ticketForm.location}
                onChange={(e) => setTicketForm({ ...ticketForm, location: e.target.value })}
                placeholder="e.g., Back Bar, Restroom A, DJ Booth, etc."
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Issue Title *</label>
              <input
                type="text"
                value={ticketForm.title}
                onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                placeholder="Brief description of the issue"
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Description *</label>
              <textarea
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                placeholder="Please provide detailed description of the issue..."
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            {currentUser && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '15px',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)'
              }}>
                <strong>Reported by:</strong> {currentUser.name} ({currentUser.email})
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              style={{ 
                width: '100%',
                padding: '16px',
                backgroundColor: isSubmitting ? '#a0aec0' : '#d4af37',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Maintenance Ticket'}
            </button>
          </form>
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: 'rgba(240, 249, 255, 0.2)', 
        borderRadius: '8px', 
        border: '1px solid rgba(190, 227, 248, 0.3)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(190, 227, 248, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <h4 style={{ marginTop: 0, color: '#bee3f8', fontSize: '1.1rem' }}>When to Use This Form:</h4>
        <ul style={{ marginBottom: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
          <li>Equipment repairs (ice machine, POS system, etc.)</li>
          <li>Facility issues (leaks, lighting, temperature)</li>
          <li>Furniture or fixture repairs</li>
          <li>Safety concerns</li>
          <li>Cleanliness issues requiring maintenance</li>
        </ul>
      </div>
    </div>
  );
}