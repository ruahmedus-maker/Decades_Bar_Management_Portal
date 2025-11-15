'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';
import { supabase } from '@/lib/supabase';

// Define the section color for tasks management
const SECTION_COLOR = '#3B82F6'; // Blue color for tasks
const SECTION_COLOR_RGB = '59, 130, 246';

// Card Component without Hover Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  // Different glow colors for different cards - blue theme for tasks
  const glowColors = [
    'linear-gradient(45deg, #3B82F6, #60A5FA, transparent)',
    'linear-gradient(45deg, #60A5FA, #93C5FD, transparent)',
    'linear-gradient(45deg, #2563EB, #3B82F6, transparent)',
    'linear-gradient(45deg, #1D4ED8, #3B82F6, transparent)'
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #60A5FA, transparent)`;

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

export default function TasksSection() {
  const { showToast, currentUser } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all');
  const [loading, setLoading] = useState(true);

  // Load tasks from Supabase
  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        showToast('Error loading tasks');
        return;
      }

      // Convert Supabase data to our Task type
      const convertedTasks: Task[] = (data || []).map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        assignedTo: task.assigned_to,
        dueDate: task.due_date,
        completed: task.completed,
        completedAt: task.completed_at,
        createdAt: task.created_at,
        eventId: task.event_id,
        priority: task.priority
      }));

      setTasks(convertedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      showToast('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    loadTasks();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          console.log('Real-time update received for tasks');
          loadTasks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdateTaskStatus = async (task: Task, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed,
          completed_at: completed ? new Date().toISOString() : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      if (error) throw error;

      showToast(`Task marked as ${completed ? 'completed' : 'pending'}!`);
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Error updating task');
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

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' || 
      (filter === 'pending' && !task.completed) || 
      (filter === 'completed' && task.completed);
    
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return statusMatch && priorityMatch;
  });

  const pendingTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  if (loading) {
    return (
      <div 
        id="tasks-section"
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
        <h3>Loading Tasks...</h3>
        <p>Connecting to cloud database</p>
      </div>
    );
  }

  return (
    <div 
      id="tasks-section"
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
            Tasks Management
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Manage and track all assigned tasks and responsibilities
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
            Admin Only
          </span>
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Quick Stats */}
        <AnimatedCard
          title="📊 Task Overview"
          description="Current status of all tasks across the venue"
          index={0}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '10px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h4 style={{ margin: 0, color: '#d69e2e', fontSize: '1.8rem' }}>{tasks.length}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Total Tasks</p>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h4 style={{ margin: 0, color: '#e53e3e', fontSize: '1.8rem' }}>{pendingTasksCount}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Pending</p>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h4 style={{ margin: 0, color: '#38a169', fontSize: '1.8rem' }}>{completedTasksCount}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Completed</p>
            </div>
          </div>
        </AnimatedCard>

        {/* Filters */}
        <AnimatedCard
          title="🔍 Filter Tasks"
          index={1}
        >
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>Status:</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                style={{ 
                  marginLeft: '8px', 
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>Priority:</label>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                style={{ 
                  marginLeft: '8px', 
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginLeft: 'auto',
              alignItems: 'center'
            }}>
              <button 
                onClick={loadTasks}
                style={{ 
                  background: SECTION_COLOR,
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </AnimatedCard>

        {/* Tasks List */}
        <AnimatedCard
          title="📋 Task List"
          description={`Showing ${filteredTasks.length} tasks matching your filters`}
          index={2}
        >
          {filteredTasks.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontStyle: 'italic'
            }}>
              No tasks found matching your filters.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '15px' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                fontSize: '0.9rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Task</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Event</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Assigned To</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Due Date</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Priority</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <tr 
                      key={task.id} 
                      style={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '15px' }}>
                        <div>
                          <div style={{ 
                            fontWeight: 'bold', 
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'rgba(255, 255, 255, 0.6)' : 'white'
                          }}>
                            {task.title}
                          </div>
                          {task.description && (
                            <div style={{ 
                              fontSize: '0.8rem', 
                              color: 'rgba(255, 255, 255, 0.6)', 
                              marginTop: '4px',
                              lineHeight: 1.4
                            }}>
                              {task.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '15px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {task.eventId ? `Event: ${task.eventId}` : 'Standalone Task'}
                      </td>
                      <td style={{ padding: '15px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {task.assignedTo}
                      </td>
                      <td style={{ padding: '15px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem',
                          background: `${getPriorityColor(task.priority)}20`,
                          color: getPriorityColor(task.priority),
                          fontWeight: 'bold',
                          display: 'inline-block',
                          minWidth: '70px',
                          textAlign: 'center'
                        }}>
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem',
                          background: task.completed ? 'rgba(56, 161, 105, 0.2)' : 'rgba(229, 62, 62, 0.2)',
                          color: task.completed ? '#38a169' : '#e53e3e',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          minWidth: '100px',
                          textAlign: 'center'
                        }}>
                          {task.completed ? 'COMPLETED' : 'PENDING'}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <button 
                          onClick={() => handleUpdateTaskStatus(task, !task.completed)}
                          style={{ 
                            background: task.completed ? '#d69e2e' : '#38a169', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            minWidth: '140px'
                          }}
                        >
                          {task.completed ? '↶ Mark Pending' : '✓ Mark Complete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnimatedCard>
      </div>
    </div>
  );
}