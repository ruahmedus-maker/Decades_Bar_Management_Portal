'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';
import { specialEventsStorage } from '@/lib/specialEvents';
import { SpecialEvent, Task } from '@/types';
import { storage } from '@/lib/storage';

// Define the section color for special events
const SECTION_COLOR = '#ED8936'; // Orange color for special events
const SECTION_COLOR_RGB = '237, 137, 54';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - orange theme for events
  const glowColors = [
    'linear-gradient(45deg, #ED8936, #F6AD55, transparent)', // Orange
    'linear-gradient(45deg, #DD6B20, #ED8936, transparent)', // Dark Orange
    'linear-gradient(45deg, #C05621, #DD6B20, transparent)', // Deeper Orange
    'linear-gradient(45deg, #9C4221, #C05621, transparent)'  // Deep Orange
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #F6AD55, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(237, 137, 54, 0.1)' 
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
        </div>
        <div style={{ padding: '20px' }}>
          {children || (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>{description}</p>
              <ul style={{paddingLeft: '20px', marginBottom: '0', marginTop: '15px'}}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '15px 20px',
            background: 'rgba(237, 242, 247, 0.15)',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Event Card Props Interface
interface EventCardProps {
  event: SpecialEvent;
  index: number;
  isAdminView: boolean;
  onAddTask: (event: SpecialEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateTaskStatus: (eventId: string, taskId: string, completed: boolean) => void;
  getStatusColor: (status: SpecialEvent['status']) => string;
  getPriorityColor: (priority: Task['priority']) => string;
  users: any[];
}

// Event Card Component
function EventCard({ 
  event, 
  index, 
  isAdminView, 
  onAddTask, 
  onDeleteEvent, 
  onUpdateTaskStatus, 
  getStatusColor, 
  getPriorityColor, 
  users 
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '20px',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        backdropFilter: isHovered ? 'blur(15px)' : 'blur(8px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Individual Event Color Glow */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '14px',
          background: `linear-gradient(45deg, ${SECTION_COLOR}, transparent)`,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <h4 style={{
            color: isHovered ? SECTION_COLOR : 'white',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}>
            {event.name}
          </h4>
          <span style={{ 
            padding: '4px 12px', 
            borderRadius: '12px', 
            fontSize: '0.8rem',
            background: `${getStatusColor(event.status)}20`,
            color: getStatusColor(event.status),
            fontWeight: 'bold',
            border: `1px solid ${getStatusColor(event.status)}40`
          }}>
            {event.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '5px 0' }}>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '5px 0' }}>
            <strong>Theme:</strong> {event.theme || 'No theme specified'}
          </p>
          
          {event.drinkSpecials && (
            <div style={{ marginTop: '10px' }}>
              <strong style={{ color: SECTION_COLOR }}>Drink Specials:</strong>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '10px', 
                borderRadius: '6px', 
                marginTop: '5px',
                whiteSpace: 'pre-wrap',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {event.drinkSpecials}
              </div>
            </div>
          )}
          
          {event.notes && (
            <div style={{ marginTop: '10px' }}>
              <strong style={{ color: SECTION_COLOR }}>Notes & Instructions:</strong>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '10px', 
                borderRadius: '6px', 
                marginTop: '5px',
                whiteSpace: 'pre-wrap',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {event.notes}
              </div>
            </div>
          )}

          {/* Tasks Display */}
          {isAdminView && event.tasks && event.tasks.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <strong style={{ color: SECTION_COLOR }}>Tasks:</strong>
              <div style={{ marginTop: '10px' }}>
                {event.tasks.map((task) => (
                  <div key={task.id} style={{ 
                    padding: '10px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '6px',
                    marginBottom: '8px',
                    background: task.completed ? 'rgba(56, 161, 105, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => onUpdateTaskStatus(event.id, task.id, e.target.checked)}
                            style={{ margin: 0 }}
                          />
                          <strong style={{ 
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}>
                            {task.title}
                          </strong>
                          <span style={{ 
                            padding: '2px 6px', 
                            borderRadius: '8px', 
                            fontSize: '0.7rem',
                            background: `${getPriorityColor(task.priority)}20`,
                            color: getPriorityColor(task.priority)
                          }}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        {task.description && (
                          <p style={{ margin: '5px 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                            {task.description}
                          </p>
                        )}
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          <span>Assigned to: {task.assignedTo}</span>
                          {task.dueDate && (
                            <span> • Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          )}
                          {task.completed && task.completedAt && (
                            <span> • Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Only in Admin View */}
        {isAdminView && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
            <button 
              style={{
                background: 'linear-gradient(135deg, #3182ce, #2b6cb0)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
              onClick={() => onAddTask(event)}
            >
              + Add Task
            </button>
            <button 
              style={{
                background: 'linear-gradient(135deg, #e53e3e, #c53030)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
              onClick={() => onDeleteEvent(event.id)}
            >
              Delete Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SpecialEventsSectionProps {
  isAdminView?: boolean;
}

export default function SpecialEventsSection({ isAdminView = false }: SpecialEventsSectionProps) {
  const { currentUser, showToast } = useApp();
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    name: '',
    date: '',
    theme: '',
    drinkSpecials: '',
    notes: '',
    status: 'planned' as SpecialEvent['status']
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as Task['priority']
  });


  const loadEvents = () => {
    const eventsData = specialEventsStorage.getEvents();
    setEvents(Object.values(eventsData).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleCreateEvent = () => {
    if (!currentUser) return;

    const eventData = {
      name: eventForm.name,
      date: eventForm.date,
      theme: eventForm.theme,
      drinkSpecials: eventForm.drinkSpecials,
      notes: eventForm.notes,
      tasks: [],
      createdBy: currentUser.email,
      status: eventForm.status
    };

    specialEventsStorage.createEvent(eventData);
    showToast('Special event created successfully!');
    setShowEventForm(false);
    resetEventForm();
    loadEvents();
  };

  const handleAddTask = () => {
    if (!selectedEvent) return;

    const taskData = {
      title: taskForm.title,
      description: taskForm.description,
      assignedTo: taskForm.assignedTo,
      dueDate: taskForm.dueDate,
      completed: false,
      priority: taskForm.priority
    };

    specialEventsStorage.addTaskToEvent(selectedEvent.id, taskData);
    showToast('Task added successfully!');
    setShowTaskForm(false);
    resetTaskForm();
    loadEvents();
  };

  const handleUpdateTaskStatus = (eventId: string, taskId: string, completed: boolean) => {
    specialEventsStorage.updateTask(eventId, taskId, { 
      completed,
      completedAt: completed ? new Date().toISOString() : undefined
    });
    loadEvents();
  };

  const handleDeleteEvent = (eventId: string) => {
    specialEventsStorage.deleteEvent(eventId);
    showToast('Event deleted successfully!');
    loadEvents();
  };

  const resetEventForm = () => {
    setEventForm({
      name: '',
      date: '',
      theme: '',
      drinkSpecials: '',
      notes: '',
      status: 'planned'
    });
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const getStatusColor = (status: SpecialEvent['status']) => {
    switch (status) {
      case 'planned': return '#d69e2e';
      case 'in-progress': return '#3182ce';
      case 'completed': return '#38a169';
      case 'cancelled': return '#e53e3e';
      default: return '#718096';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#d69e2e';
      case 'low': return '#38a169';
      default: return '#718096';
    }
  };

  const users = Object.values(storage.getUsers());

  return (
    <div 
      id="special-events"
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
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Special Events
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            {isAdminView ? 'Manage special events and tasks' : 'Upcoming events and celebrations'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAdminView && (
            <span style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: 'white',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              Admin Only
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <AnimatedCard
          title="🎉 Decades Special Events"
          description="Stay informed about upcoming special events, themed nights, and celebrations. This is where we create unforgettable experiences for our guests."
          items={[
            'Themed party nights',
            'Holiday celebrations',
            'Special guest appearances',
            'Exclusive drink menus'
          ]}
          footer={{ left: 'Event management', right: '📅 Calendar' }}
          index={0}
        />

        {/* Quick Actions - Only in Admin View */}
        {isAdminView && (
          <AnimatedCard
            title="⚡ Quick Actions"
            index={1}
          >
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                style={{
                  background: 'linear-gradient(135deg, var(--accent), #c19b2a)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => setShowEventForm(true)}
              >
                🎉 Create New Event
              </button>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #4a5568, #2d3748)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={loadEvents}
              >
                🔄 Refresh Events
              </button>
            </div>
          </AnimatedCard>
        )}

        {/* Create Event Form - Only in Admin View */}
        {showEventForm && isAdminView && (
          <AnimatedCard
            title="📝 Create Special Event"
            index={2}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Event Name *
                </label>
                <input
                  type="text"
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="e.g., New Year's Eve Party"
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Theme
                </label>
                <input
                  type="text"
                  value={eventForm.theme}
                  onChange={(e) => setEventForm({ ...eventForm, theme: e.target.value })}
                  placeholder="e.g., 1920s Great Gatsby"
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Drink Specials
                </label>
                <textarea
                  value={eventForm.drinkSpecials}
                  onChange={(e) => setEventForm({ ...eventForm, drinkSpecials: e.target.value })}
                  placeholder="List drink specials and prices..."
                  rows={3}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Notes & Instructions
                </label>
                <textarea
                  value={eventForm.notes}
                  onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Status
                </label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as SpecialEvent['status'] })}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #38a169, #2f855a)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onClick={handleCreateEvent}
                disabled={!eventForm.name || !eventForm.date}
              >
                Create Event
              </button>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #a0aec0, #718096)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowEventForm(false)}
              >
                Cancel
              </button>
            </div>
          </AnimatedCard>
        )}

        {/* Add Task Form - Only in Admin View */}
        {showTaskForm && selectedEvent && isAdminView && (
          <AnimatedCard
            title={`📋 Add Task to ${selectedEvent.name}`}
            index={3}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g., Order decorations"
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Description
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task details..."
                  rows={2}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Assign To *
                </label>
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                >
                  <option value="">Select user...</option>
                  {users.map((user: any) => (
                    <option key={user.email} value={user.email}>
                      {user.name} ({user.position})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600' }}>
                  Priority
                </label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Task['priority'] })}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #3182ce, #2b6cb0)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onClick={handleAddTask}
                disabled={!taskForm.title || !taskForm.assignedTo}
              >
                Add Task
              </button>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #a0aec0, #718096)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowTaskForm(false)}
              >
                Cancel
              </button>
            </div>
          </AnimatedCard>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <AnimatedCard
            title="📅 No Events Scheduled"
            description={isAdminView ? 'Create your first special event to get started!' : 'Check back later for upcoming events!'}
            index={4}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index + 5}
                isAdminView={isAdminView}
                onAddTask={(event: SpecialEvent) => {
                  setSelectedEvent(event);
                  setShowTaskForm(true);
                }}
                onDeleteEvent={handleDeleteEvent}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
                users={users}
              />
            ))}
          </div>
        )}

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}