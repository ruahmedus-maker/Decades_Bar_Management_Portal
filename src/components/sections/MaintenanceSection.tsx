'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { MaintenanceTicket, CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, children }: CardProps) {
  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={{
            ...cardHeaderStyle,
            ...premiumWhiteStyle,
            letterSpacing: '3px',
            fontSize: '1rem'
          }}>
            {title}
          </h4>
          {description && (
            <p style={{ ...premiumBodyStyle, margin: '6px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
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

// Maintenance Item Component - ALOHA STYLED
function MaintenanceItem({ title, description, icon, status }: any) {
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      open: '#3B82F6',
      assigned: '#8B5CF6',
      'in-progress': '#F59E0B',
      completed: '#10B981',
      closed: '#6B7280'
    };
    return colors[status] || '#FFFFFF';
  };

  return (
    <div
      style={{
        padding: '18px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
        <div style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h5 style={{ color: 'white', margin: 0, fontSize: '0.95rem', fontWeight: 300, letterSpacing: '0.5px' }}>
              {title}
            </h5>
            <span style={{
              background: getStatusColor(status),
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {status}
            </span>
          </div>
          <p style={{ ...premiumBodyStyle, margin: 0, fontSize: '0.85rem', fontWeight: 300, opacity: 0.8 }}>
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
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketForm, setTicketForm] = useState({
    floor: '2000s' as '2000s' | '2010s' | 'Hip Hop' | 'Rooftop',
    location: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  const fetchRecentTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_tickets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      if (data) {
        setRecentTickets(data.map((ticket: MaintenanceTicket) => ({
          icon: getTicketIcon(ticket.title),
          title: ticket.title,
          description: ticket.description,
          status: ticket.status
        })));
      }
    } catch (error) {
      console.error('Error fetching maintenance tickets:', error);
      showToast('Error loading recent tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTickets();
    const subscription = supabase
      .channel('maintenance_tickets_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_tickets' }, () => {
        fetchRecentTickets();
      })
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getTicketIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('ice') || t.includes('machine')) return '🔧';
    if (t.includes('light')) return '💡';
    if (t.includes('leak') || t.includes('water')) return '🚰';
    if (t.includes('pos') || t.includes('system')) return '🔌';
    return '🛠️';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Login required');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('maintenance_tickets').insert([{
        id: crypto.randomUUID(),
        floor: ticketForm.floor,
        location: ticketForm.location,
        title: ticketForm.title,
        description: ticketForm.description,
        reported_by: currentUser.name,
        reported_by_email: currentUser.email,
        status: 'open',
        priority: ticketForm.priority
      }]);
      if (error) throw error;
      showToast('Ticket logged successfully');
      setTicketForm({ floor: '2000s', location: '', title: '', description: '', priority: 'medium' });
      fetchRecentTickets();
    } catch (error: any) {
      showToast('Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setTicketForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div
      id="maintenance-section"
      style={{
        marginBottom: '25px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
      }}
      className="active"
    >

      {/* Section Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
            Maintenance Log
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.7,
            color: 'white',
            fontSize: '0.8rem',
            marginTop: '4px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Facility tracking and equipment resolution
          </p>
        </div>
        <span style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          color: 'white',
          fontWeight: 300,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          letterSpacing: '1px'
        }}>
          LOG TICKETS
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          <AnimatedCard
            title="🔧 New Request"
            description="Log facility or safety issues for manager review"
          >
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Floor</label>
                  <select
                    value={ticketForm.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '0.85rem' }}
                  >
                    <option value="2000s">2000's</option>
                    <option value="2010s">2010's</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="Rooftop">Rooftop</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '0.85rem' }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Location & Title</label>
                <input
                  type="text"
                  value={ticketForm.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Back Bar - POS Terminal 2"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Description</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Details of the issue..."
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '0.85rem', resize: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Commit Ticket'}
              </button>
            </form>
          </AnimatedCard>

          <AnimatedCard
            title="📋 Current Status"
            description="Tracking the resolution of recent active requests"
          >
            {isLoading ? <p style={premiumBodyStyle}>Loading database...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentTickets.length > 0 ? (
                  recentTickets.map((ticket, idx) => (
                    <MaintenanceItem key={idx} {...ticket} />
                  ))
                ) : (
                  <p style={{ ...premiumBodyStyle, opacity: 0.5, textAlign: 'center', padding: '20px' }}>No active tickets reported.</p>
                )}
              </div>
            )}
          </AnimatedCard>
        </div>

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {[
            { tag: 'Repair', icon: '🛠️', desc: 'Equipment, POS, Audio' },
            { tag: 'Facility', icon: '🏢', desc: 'Leaks, Lighting, HVAC' },
            { tag: 'Decor', icon: '🪑', desc: 'Furniture, Fixtures' },
            { tag: 'Safety', icon: '🚨', desc: 'Hazards, Emergency' }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '4px', fontWeight: 300 }}>{item.icon} {item.tag}</div>
              <div style={{ fontSize: '0.75rem', color: 'white', opacity: 0.5, fontWeight: 300 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}