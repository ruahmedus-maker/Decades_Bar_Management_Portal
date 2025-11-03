'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { trackSectionVisit } from '@/lib/progress';

// Define the section color for maintenance - deep blue theme
const SECTION_COLOR = '#1E40AF'; // Deep blue color for maintenance
const SECTION_COLOR_RGB = '30, 64, 175';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - deep blue theme for maintenance
  const glowColors = [
    'linear-gradient(45deg, #1E40AF, #3B82F6, transparent)',
    'linear-gradient(45deg, #3B82F6, #60A5FA, transparent)',
    'linear-gradient(45deg, #1E3A8A, #1E40AF, transparent)',
    'linear-gradient(45deg, #1E3A8A, #1E40AF, transparent)'
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #3B82F6, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(30, 64, 175, 0.1)' 
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

// Maintenance Item Component
function MaintenanceItem({ title, description, icon, status, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      open: '#3B82F6',
      'in-progress': '#F59E0B',
      completed: '#10B981',
      closed: '#6B7280'
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
          ? '1px solid rgba(30, 64, 175, 0.4)' 
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

export default function MaintenanceSection() {
  const { currentUser, showToast } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    floor: '2000s' as '2000s' | '2010s' | 'Hip Hop' | 'Rooftop',
    location: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  })

  const recentTickets = [
    {
      icon: '🔧',
      title: 'Ice Machine Repair',
      description: 'Ice machine not producing ice, temperature seems high',
      status: 'in-progress'
    },
    {
      icon: '💡',
      title: 'Lighting Issue - Rooftop',
      description: 'Several LED lights flickering in the seating area',
      status: 'open'
    },
    {
      icon: '🚰',
      title: 'Restroom Leak',
      description: 'Water leak under sink in main restroom',
      status: 'completed'
    },
    {
      icon: '🔌',
      title: 'POS System Offline',
      description: 'POS terminal at main bar frequently disconnecting',
      status: 'closed'
    }
  ];

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

  const handleInputChange = (field: string, value: string) => {
    setTicketForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div 
      id="maintenance-section"
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
          ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(30, 64, 175, 0.15)'
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
            Maintenance Request
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Report facility and equipment issues for prompt resolution
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
          Report Issues
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Maintenance Ticket Form */}
        <AnimatedCard
          title="🔧 Create Maintenance Ticket"
          description="Report facility, equipment, or safety issues for immediate attention"
          index={0}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                  Floor / Area *
                </label>
                <select
                  value={ticketForm.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '0.9rem'
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
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                  Priority *
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '0.9rem'
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
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Location / Title *
              </label>
              <input
                type="text"
                value={ticketForm.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Back Bar, Restroom A, DJ Booth, etc."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Issue Title *
              </label>
              <input
                type="text"
                value={ticketForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the issue"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Description *
              </label>
              <textarea
                value={ticketForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please provide detailed description of the issue..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            {currentUser && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.08)', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '15px',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <strong style={{ color: SECTION_COLOR }}>Reported by:</strong> {currentUser.name} ({currentUser.email})
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: isSubmitting 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : `rgba(${SECTION_COLOR_RGB}, 0.3)`,
                border: isSubmitting
                  ? '1px solid rgba(255, 255, 255, 0.3)'
                  : `1px solid rgba(${SECTION_COLOR_RGB}, 0.5)`,
                borderRadius: '8px',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.background = `rgba(${SECTION_COLOR_RGB}, 0.5)`;
                  target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.background = `rgba(${SECTION_COLOR_RGB}, 0.3)`;
                  target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isSubmitting ? '🔄 Submitting...' : '🚀 Submit Maintenance Ticket'}
            </button>
          </form>
        </AnimatedCard>

        {/* Recent Tickets */}
        <AnimatedCard
          title="📋 Recent Maintenance Tickets"
          description="Track the status of recent maintenance requests"
          index={1}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            {recentTickets.map((ticket, index) => (
              <MaintenanceItem
                key={index}
                title={ticket.title}
                description={ticket.description}
                icon={ticket.icon}
                status={ticket.status}
                index={index}
              />
            ))}
          </div>
        </AnimatedCard>

        {/* Quick Reference */}
        <AnimatedCard
          title="ℹ️ When to Use This Form"
          index={2}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            <div style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h5 style={{ color: SECTION_COLOR, margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '600' }}>
                🛠️ Equipment Repairs
              </h5>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.8rem' }}>
                Ice machines, POS systems, audio equipment, etc.
              </p>
            </div>

            <div style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h5 style={{ color: SECTION_COLOR, margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '600' }}>
                🏢 Facility Issues
              </h5>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.8rem' }}>
                Leaks, lighting, temperature control, structural issues
              </p>
            </div>

            <div style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h5 style={{ color: SECTION_COLOR, margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '600' }}>
                🪑 Furniture & Fixtures
              </h5>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.8rem' }}>
                Broken chairs, tables, bar fixtures, decor issues
              </p>
            </div>

            <div style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h5 style={{ color: SECTION_COLOR, margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '600' }}>
                🚨 Safety Concerns
              </h5>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.8rem' }}>
                Slippery floors, electrical hazards, emergency equipment
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}