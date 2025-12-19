'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { MaintenanceTicket, CardProps } from '@/types';
import { goldTextStyle, brandFont, sectionHeaderStyle, cardHeaderStyle } from '@/lib/brand-styles';

// Define the section color for maintenance - deep blue theme
const SECTION_COLOR = '#1E40AF'; // Deep blue color for maintenance
const SECTION_COLOR_RGB = '30, 64, 175';

// Simplified Card Component without hover effects
function AnimatedCard({ title, description, items, footer, index, children }: CardProps) {
  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.25), rgba(${SECTION_COLOR_RGB}, 0.1))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={cardHeaderStyle}>
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

// Maintenance Item Component without hover effects
function MaintenanceItem({ title, description, icon, status, index }: any) {
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
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
        <div style={{
          fontSize: '1.5rem',
          color: 'rgba(255, 255, 255, 0.7)',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h5 style={{
              color: 'white',
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentTickets, setRecentTickets] = useState<Array<{
    icon: string;
    title: string;
    description: string;
    status: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketForm, setTicketForm] = useState({
    floor: '2000s' as '2000s' | '2010s' | 'Hip Hop' | 'Rooftop',
    location: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  // Fetch recent maintenance tickets
  const fetchRecentTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_tickets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;

      if (data) {
        // Convert database data to the format expected by the component
        const formattedTickets = data.map((ticket: MaintenanceTicket) => ({
          icon: getTicketIcon(ticket.title),
          title: ticket.title,
          description: ticket.description,
          status: ticket.status
        }));
        setRecentTickets(formattedTickets);
      }
    } catch (error) {
      console.error('Error fetching maintenance tickets:', error);
      showToast('Error loading recent tickets');
    } finally {
      setIsLoading(false);
    }
  };



  // In your useEffect, replace the subscription code with this:
  useEffect(() => {
    fetchRecentTickets();

    // Subscribe to real-time changes with proper typing
    const subscription = supabase
      .channel('maintenance_tickets_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'maintenance_tickets'
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Maintenance ticket change received!', payload);
          fetchRecentTickets(); // Refresh the list
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription failed');
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to get appropriate icon based on ticket title
  const getTicketIcon = (title: string) => {
    if (title.toLowerCase().includes('ice') || title.toLowerCase().includes('machine')) return '🔧';
    if (title.toLowerCase().includes('light')) return '💡';
    if (title.toLowerCase().includes('leak') || title.toLowerCase().includes('water')) return '🚰';
    if (title.toLowerCase().includes('pos') || title.toLowerCase().includes('system')) return '🔌';
    return '🛠️';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('You must be logged in to submit a maintenance ticket');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a UUID for the ticket ID
      const ticketId = crypto.randomUUID();

      // Debug: Log what we're about to send
      console.log('🔄 Attempting to create maintenance ticket with data:', {
        id: ticketId,
        floor: ticketForm.floor,
        location: ticketForm.location,
        title: ticketForm.title,
        description: ticketForm.description,
        reported_by: currentUser.name,
        reported_by_email: currentUser.email,
        status: 'open',
        priority: ticketForm.priority
      });


      // Simplified - only include fields that are required or have values
      const ticketData = {
        id: ticketId,
        floor: ticketForm.floor,
        location: ticketForm.location,
        title: ticketForm.title,
        description: ticketForm.description,
        reported_by: currentUser.name,
        reported_by_email: currentUser.email,
        status: 'open' as const,
        priority: ticketForm.priority
        // Omit assigned_to and notes - they'll use database NULL defaults
      };

      console.log('📤 Sending to Supabase...');

      const { data, error } = await supabase
        .from('maintenance_tickets')
        .insert([ticketData])
        .select();

      console.log('📥 Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ Ticket created successfully:', data);
      showToast('Maintenance ticket submitted successfully!');

      // Reset form
      setTicketForm({
        floor: '2000s',
        location: '',
        title: '',
        description: '',
        priority: 'medium'
      });

      // Refresh the recent tickets list
      fetchRecentTickets();
    } catch (error: any) {
      console.error('Error submitting maintenance ticket:', error);
      showToast(error.message || 'Error submitting ticket. Please try again.');
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

  // Update getStatusColor to handle all statuses from your schema
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      open: '#3B82F6',
      assigned: '#8B5CF6', // Purple for assigned
      'in-progress': '#F59E0B',
      completed: '#10B981',
      closed: '#6B7280'
    };
    return colors[status] || SECTION_COLOR;
  };

  return (
    <div
      id="maintenance-section"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        WebkitBackdropFilter: 'blur(15px) saturate(170%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.5s ease'
      }}
      className="active"
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
          <h3 style={sectionHeaderStyle}>
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
                fontSize: '0.9rem',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
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
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Loading recent tickets...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '15px',
              marginTop: '15px'
            }}>
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket, index) => (
                  <MaintenanceItem
                    key={index}
                    title={ticket.title}
                    description={ticket.description}
                    icon={ticket.icon}
                    status={ticket.status}
                    index={index}
                  />
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  gridColumn: '1 / -1'
                }}>
                  No maintenance tickets found. Create one above!
                </div>
              )}
            </div>
          )}
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