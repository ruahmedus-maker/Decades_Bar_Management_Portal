'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { specialEventsStorage } from '@/lib/specialEvents';
import { SpecialEvent, Task } from '@/types';
import { storage } from '@/lib/storage';

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

  useEffect(() => {
    loadEvents();
  }, []);

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
    <div className="section active">
      <div className="section-header">
        <h3>Special Events</h3>
        {isAdminView && <span className="badge">Admin Only</span>}
      </div>

      {/* Quick Actions - Only in Admin View */}
      {isAdminView && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            className="btn"
            onClick={() => setShowEventForm(true)}
            style={{ background: '#d4af37', color: 'white' }}
          >
            🎉 Create New Event
          </button>
          <button 
            className="btn"
            onClick={loadEvents}
            style={{ background: '#4a5568', color: 'white' }}
          >
            🔄 Refresh
          </button>
        </div>
      )}

      {/* Create Event Form - Only in Admin View */}
      {showEventForm && isAdminView && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h4>Create Special Event</h4>
            <button 
              onClick={() => setShowEventForm(false)}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Event Name *</label>
                <input
                  type="text"
                  value={eventForm.name}
                  onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="e.g., New Year's Eve Party"
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div>
                <label>Date *</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Theme</label>
                <input
                  type="text"
                  value={eventForm.theme}
                  onChange={(e) => setEventForm({ ...eventForm, theme: e.target.value })}
                  placeholder="e.g., 1920s Great Gatsby"
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Drink Specials</label>
                <textarea
                  value={eventForm.drinkSpecials}
                  onChange={(e) => setEventForm({ ...eventForm, drinkSpecials: e.target.value })}
                  placeholder="List drink specials and prices..."
                  rows={3}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Notes & Instructions</label>
                <textarea
                  value={eventForm.notes}
                  onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div>
                <label>Status</label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as SpecialEvent['status'] })}
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button 
                className="btn"
                onClick={handleCreateEvent}
                disabled={!eventForm.name || !eventForm.date}
                style={{ background: '#38a169', color: 'white' }}
              >
                Create Event
              </button>
              <button 
                className="btn"
                onClick={() => setShowEventForm(false)}
                style={{ background: '#a0aec0', color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form - Only in Admin View */}
      {showTaskForm && selectedEvent && isAdminView && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h4>Add Task to {selectedEvent.name}</h4>
            <button 
              onClick={() => setShowTaskForm(false)}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Task Title *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g., Order decorations"
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task details..."
                  rows={2}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div>
                <label>Assign To *</label>
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="">Select user...</option>
                  {users.map(user => (
                    <option key={user.email} value={user.email}>
                      {user.name} ({user.position})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div>
                <label>Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Task['priority'] })}
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button 
                className="btn"
                onClick={handleAddTask}
                disabled={!taskForm.title || !taskForm.assignedTo}
                style={{ background: '#3182ce', color: 'white' }}
              >
                Add Task
              </button>
              <button 
                className="btn"
                onClick={() => setShowTaskForm(false)}
                style={{ background: '#a0aec0', color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="card-grid">
        {events.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <p>No special events {isAdminView ? 'created' : 'scheduled'} yet.</p>
              {!isAdminView && (
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
                  Check back later for upcoming events!
                </p>
              )}
            </div>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{event.name}</h4>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem',
                  background: `${getStatusColor(event.status)}20`,
                  color: getStatusColor(event.status),
                  fontWeight: 'bold'
                }}>
                  {event.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: '15px' }}>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Theme:</strong> {event.theme || 'No theme specified'}</p>
                  
                  {event.drinkSpecials && (
                    <div>
                      <strong>Drink Specials:</strong>
                      <div style={{ 
                        background: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        marginTop: '5px',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {event.drinkSpecials}
                      </div>
                    </div>
                  )}
                  
                  {event.notes && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Notes & Instructions:</strong>
                      <div style={{ 
                        background: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        marginTop: '5px',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {event.notes}
                      </div>
                    </div>
                  )}
                  
                  {/* Show task count to admins in admin view */}
                  {isAdminView && (
                    <p style={{ marginTop: '10px' }}>
                      <strong>Tasks:</strong> {event.tasks.length}
                    </p>
                  )}
                </div>

                {/* Tasks for this event - Only visible in Admin View */}
                {isAdminView && event.tasks.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <h5 style={{ marginBottom: '10px' }}>Tasks:</h5>
                    {event.tasks.map(task => (
                      <div key={task.id} style={{ 
                        padding: '10px', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '4px',
                        marginBottom: '8px',
                        background: task.completed ? '#f0fff4' : '#fff'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => handleUpdateTaskStatus(event.id, task.id, e.target.checked)}
                                style={{ margin: 0 }}
                              />
                              <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
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
                              <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>
                                {task.description}
                              </p>
                            )}
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
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
                )}

                {/* Action Buttons - Only in Admin View */}
                {isAdminView && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowTaskForm(true);
                      }}
                      style={{ 
                        background: '#3182ce', 
                        color: 'white',
                        fontSize: '0.8rem',
                        padding: '5px 10px'
                      }}
                    >
                      + Add Task
                    </button>
                    <button 
                      className="btn"
                      onClick={() => {
                        specialEventsStorage.deleteEvent(event.id);
                        showToast('Event deleted successfully!');
                        loadEvents();
                      }}
                      style={{ 
                        background: '#e53e3e', 
                        color: 'white',
                        fontSize: '0.8rem',
                        padding: '5px 10px'
                      }}
                    >
                      Delete Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}