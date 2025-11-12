'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { supabase } from '@/lib/supabase';
import { SpecialEvent, Task } from '@/types';
import { CardProps } from '@/types';

// Define the section color for special events
const SECTION_COLOR = '#ED8936'; // Orange color for special events
const SECTION_COLOR_RGB = '237, 137, 54';

// Define types for Supabase real-time payloads
interface PostgresChangePayload {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  record: any;
  old_record: any;
  errors?: string[];
}

// Animated Card Component without Hover Effects
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
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: 'translateY(0) scale(1)',
        overflow: 'hidden',
        cursor: 'pointer',
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

// Event Card Component without Hover Effects
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
  
  // Add type for the checkbox change event
  const handleCheckboxChange = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTaskStatus(event.id, taskId, e.target.checked);
  };

  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '20px',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <h4 style={{
            color: 'white',
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCheckboxChange(task.id, e)}
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

// Define database row types
interface SpecialEventRow {
  id: string;
  name: string;
  date: string;
  theme: string | null;
  drink_specials: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  status: string;
}

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  event_id: string;
  priority: string;
}

export default function SpecialEventsSection({ isAdminView = false }: SpecialEventsSectionProps) {
  const { currentUser, showToast } = useApp();
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Add type for form change events
  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  // Load events from Supabase
const loadEvents = async () => {
  try {
    setLoading(true);
    console.log('📅 Loading events from Supabase...');
    
    const { data: eventsData, error } = await supabase
      .from('special_events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading events:', error);
      showToast('Error loading events');
      return;
    }

    console.log('📊 Events loaded:', eventsData);

    if (eventsData && eventsData.length > 0) {
      // Load tasks for each event
      const eventIds = eventsData.map((event: SpecialEventRow) => event.id);
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('event_id', eventIds);

      if (tasksError) {
        console.error('Error loading tasks:', tasksError);
      }
      // ... rest of the function
        // Convert to app format
        const formattedEvents: SpecialEvent[] = eventsData.map((event: SpecialEventRow) => {
          const eventTasks = tasksData?.filter((task: TaskRow) => task.event_id === event.id) || [];
          
          return {
            id: event.id,
            name: event.name,
            date: event.date,
            theme: event.theme || '',
            drinkSpecials: event.drink_specials || '',
            notes: event.notes || '',
            tasks: eventTasks.map((task: TaskRow): Task => ({
              id: task.id,
              title: task.title,
              description: task.description || '',
              assignedTo: task.assigned_to,
              dueDate: task.due_date || '',
              completed: task.completed,
              completedAt: task.completed_at || '',
              createdAt: task.created_at,
              eventId: task.event_id,
              priority: task.priority as 'low' | 'medium' | 'high'
            })),
            createdAt: event.created_at,
            createdBy: event.created_by,
            status: event.status as 'planned' | 'in-progress' | 'completed' | 'cancelled'
          };
        });

        setEvents(formattedEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error in loadEvents:', error);
      showToast('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  // Create new event in Supabase
  const handleCreateEvent = async () => {
    if (!currentUser) {
      showToast('You must be logged in to create events');
      return;
    }

    try {
      const id = `event-${Date.now()}`;
      
      const { error } = await supabase
        .from('special_events')
        .insert({
          id,
          name: eventForm.name,
          date: eventForm.date,
          theme: eventForm.theme,
          drink_specials: eventForm.drinkSpecials,
          notes: eventForm.notes,
          created_by: currentUser.email,
          status: eventForm.status
        });

      if (error) throw error;

      console.log('✅ Event created in Supabase:', id);
      showToast('Special event created successfully!');
      setShowEventForm(false);
      resetEventForm();
      // Don't call loadEvents here - real-time subscription will update
      
    } catch (error) {
      console.error('Error creating event:', error);
      showToast('Error creating event');
    }
  };

  // Add task to event in Supabase
  const handleAddTask = async () => {
    if (!selectedEvent) return;

    try {
      const taskId = `task-${Date.now()}`;
      
      const { error } = await supabase
        .from('tasks')
        .insert({
          id: taskId,
          title: taskForm.title,
          description: taskForm.description,
          assigned_to: taskForm.assignedTo,
          due_date: taskForm.dueDate || null,
          completed: false,
          completed_at: null,
          event_id: selectedEvent.id,
          priority: taskForm.priority
        });

      if (error) throw error;

      showToast('Task added successfully!');
      setShowTaskForm(false);
      resetTaskForm();
      // Don't call loadEvents here - real-time subscription will update
      
    } catch (error) {
      console.error('Error adding task:', error);
      showToast('Error adding task');
    }
  };

  // Update task status in Supabase
  const handleUpdateTaskStatus = async (eventId: string, taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Error updating task');
    }
  };

  // Delete event from Supabase
  const handleDeleteEvent = async (eventId: string) => {
    try {
      // First delete associated tasks
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('event_id', eventId);

      if (tasksError) throw tasksError;

      // Then delete the event
      const { error: eventError } = await supabase
        .from('special_events')
        .delete()
        .eq('id', eventId);

      if (eventError) throw eventError;

      showToast('Event deleted successfully!');
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Error deleting event');
    }
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

  // Set up real-time subscription
  useEffect(() => {
    if (!currentUser) return;

    console.log('🔄 Setting up real-time subscription for events...');
    loadEvents();

    // Subscribe to changes in special_events table
    const subscription = supabase
      .channel('special-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'special_events'
        },
        (payload: PostgresChangePayload) => {
          console.log('🔔 Real-time event update:', payload);
          loadEvents(); // Reload events when anything changes
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload: PostgresChangePayload) => {
          console.log('🔔 Real-time task update:', payload);
          loadEvents(); // Reload events when tasks change
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up real-time subscription');
      subscription.unsubscribe();
    };
  }, [currentUser]);

  // Mock users for task assignment (you'll need to replace this with actual user loading)
  const users = [
    { email: 'manager@decades.com', name: 'Manager', position: 'Manager' },
    { email: 'staff@decades.com', name: 'Staff Member', position: 'Staff' }
  ];

  if (loading) {
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
          padding: '40px',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
        <h3>Loading Special Events...</h3>
        <p>Connecting to cloud database</p>
      </div>
    );
  }

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
          <span style={{
            background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.3), rgba(45, 212, 191, 0.1))',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: '#2DD4BF',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(45, 212, 191, 0.3)'
          }}>
            🔄 Cloud Sync Active
          </span>
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
                  name="name"
                  value={eventForm.name}
                  onChange={handleEventFormChange}
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
                  name="date"
                  value={eventForm.date}
                  onChange={handleEventFormChange}
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
                  name="theme"
                  value={eventForm.theme}
                  onChange={handleEventFormChange}
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
                  name="drinkSpecials"
                  value={eventForm.drinkSpecials}
                  onChange={handleEventFormChange}
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
                  name="notes"
                  value={eventForm.notes}
                  onChange={handleEventFormChange}
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
                  name="status"
                  value={eventForm.status}
                  onChange={handleEventFormChange}
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
                  name="title"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
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
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskFormChange}
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
                  name="assignedTo"
                  value={taskForm.assignedTo}
                  onChange={handleTaskFormChange}
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
                  name="dueDate"
                  value={taskForm.dueDate}
                  onChange={handleTaskFormChange}
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
                  name="priority"
                  value={taskForm.priority}
                  onChange={handleTaskFormChange}
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