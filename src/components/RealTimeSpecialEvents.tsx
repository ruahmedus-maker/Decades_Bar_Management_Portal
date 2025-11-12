'use client';

import { useState, useEffect } from 'react';
import { SpecialEvent } from '@/types';

// Simple component without complex dependencies
export default function RealTimeSpecialEvents() {
  const [events, setEvents] = useState<Record<string, SpecialEvent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple load function - we'll enhance this later
    const loadEvents = async () => {
      try {
        setLoading(true);
        // For now, just set empty events
        setEvents({});
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: 'white'
      }}>
        Loading events...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>Special Events ({Object.keys(events).length})</h2>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <button 
          style={{
            padding: '10px 15px',
            background: 'rgba(45, 212, 191, 0.3)',
            border: '1px solid rgba(45, 212, 191, 0.6)',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
        <span>🔄 Real-time updates coming soon</span>
      </div>
      
      {Object.values(events).length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px'
        }}>
          <p>No events found. Events will appear here when created.</p>
        </div>
      ) : (
        Object.values(events).map(event => (
          <div 
            key={event.id} 
            style={{ 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '15px', 
              margin: '10px 0',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>{event.name}</h3>
            <p style={{ margin: '5px 0' }}>Status: {event.status}</p>
            <p style={{ margin: '5px 0' }}>Tasks: {event.tasks?.length || 0}</p>
          </div>
        ))
      )}
    </div>
  );
}