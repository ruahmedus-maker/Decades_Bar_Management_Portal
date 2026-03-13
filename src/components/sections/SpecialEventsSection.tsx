'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { SpecialEvent, Task, CardProps } from '@/types';
import { supabaseSpecialEvents } from '@/lib/supabase-special-events';
import { supabase } from '@/lib/supabase';
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
        </div>
        <div style={{ padding: '20px' }}>
          {description && <p style={{ ...premiumBodyStyle, marginBottom: '15px', fontSize: '0.9rem' }}>{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SpecialEventsSection({ isAdminView = false }: { isAdminView?: boolean }) {
  const { currentUser, showToast } = useApp();
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    date: '',
    theme: '',
    drinkSpecials: '',
    notes: '',
    status: 'planned' as SpecialEvent['status']
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await supabaseSpecialEvents.getEvents();
      setEvents(Object.values(data).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (e) {
      showToast('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    const sub = supabaseSpecialEvents.subscribeToEvents((data) => {
      setEvents(Object.values(data).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
    return () => sub.unsubscribe();
  }, [currentUser]);

  const handleCreateEvent = async () => {
    if (!currentUser || !eventForm.name || !eventForm.date) return;
    try {
      await supabaseSpecialEvents.createEvent({ ...eventForm, createdBy: currentUser.email });
      showToast('Event created.');
      setShowEventForm(false);
      setEventForm({ name: '', date: '', theme: '', drinkSpecials: '', notes: '', status: 'planned' });
    } catch (e) {
      showToast('Creation error');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete event?')) return;
    try {
      await supabaseSpecialEvents.deleteEvent(id);
      showToast('Event deleted.');
    } catch (e) {
      showToast('Delete error');
    }
  };

  const getStatusColor = (s: string) => {
    if (s === 'completed') return '#10B981';
    if (s === 'in-progress') return '#3B82F6';
    if (s === 'planned') return '#F59E0B';
    return '#6B7280';
  };

  if (loading) return null;

  return (
    <div
      id="special-events"
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
            Event Logistics
          </h3>
          <p style={{ margin: 0, opacity: 0.7, color: 'white', fontSize: '0.8rem', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {isAdminView ? 'Administration & scheduling' : 'Live and upcoming celebrations'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '0.65rem', color: '#10B981', letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '30px', border: '1px solid rgba(16,185,129,0.2)' }}>Live Sync</span>
          {isAdminView && <button onClick={() => setShowEventForm(!showEventForm)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '0.65rem', padding: '4px 12px', borderRadius: '30px', cursor: 'pointer', letterSpacing: '1px' }}>{showEventForm ? 'CANCEL' : 'NEW EVENT'}</button>}
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        {showEventForm && (
          <AnimatedCard title="📝 Create Special Event">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input type="text" placeholder="Event Name" value={eventForm.name} onChange={e => setEventForm({ ...eventForm, name: e.target.value })} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              <input type="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              <input type="text" placeholder="Theme" value={eventForm.theme} onChange={e => setEventForm({ ...eventForm, theme: e.target.value })} style={{ gridColumn: 'span 2', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              <textarea placeholder="Drink Specials" value={eventForm.drinkSpecials} onChange={e => setEventForm({ ...eventForm, drinkSpecials: e.target.value })} rows={3} style={{ gridColumn: 'span 2', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', resize: 'none' }} />
              <button onClick={handleCreateEvent} style={{ gridColumn: 'span 2', padding: '12px', background: 'white', color: 'black', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Create Event</button>
            </div>
          </AnimatedCard>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {events.map((event, idx) => (
            <div key={event.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h5 style={{ ...premiumWhiteStyle, margin: 0, fontSize: '1rem', fontWeight: 300, letterSpacing: '1px' }}>{event.name}</h5>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'white', background: getStatusColor(event.status), padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{event.status}</span>
              </div>
              <p style={{ ...premiumBodyStyle, fontSize: '0.85rem', marginBottom: '10px' }}>{new Date(event.date).toLocaleDateString()} • {event.theme || 'Standard Setting'}</p>
              {event.drinkSpecials && <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '10px' }}>
                <p style={{ ...premiumBodyStyle, fontSize: '0.8rem', fontStyle: 'italic', margin: 0 }}>{event.drinkSpecials}</p>
              </div>}
              {isAdminView && <button onClick={() => deleteEvent(event.id)} style={{ marginTop: '15px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>DELETE EVENT</button>}
            </div>
          ))}
          {events.length === 0 && <p style={{ ...premiumBodyStyle, opacity: 0.5, textAlign: 'center', gridColumn: 'span 2', padding: '40px' }}>No events currently scheduled.</p>}
        </div>

        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}