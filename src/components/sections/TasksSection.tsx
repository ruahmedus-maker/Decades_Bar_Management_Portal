'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';
import { supabase } from '@/lib/supabase';

export default function TasksSection() {
  const { showToast, currentUser, isAdmin } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from Supabase
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      // If not admin, only show tasks assigned to current user
      if (!isAdmin && currentUser) {
        query = query.eq('assigned_to', currentUser.email);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading tasks:', error);
        setError('Failed to load tasks');
        return;
      }

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
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const markTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;

      showToast(`Task marked as ${completed ? 'completed' : 'incomplete'}`);
      loadTasks(); // Reload tasks to reflect changes
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Error updating task');
    }
  };

  const createDemoTask = async () => {
    if (!currentUser) return;

    try {
      const demoTask = {
        title: 'Demo Task - Setup Training Session',
        description: 'This is a demo task showing how task management works',
        assigned_to: currentUser.email,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        completed: false,
        priority: 'medium',
        created_by: currentUser.email
      };

      const { error } = await supabase
        .from('tasks')
        .insert([demoTask]);

      if (error) throw error;

      showToast('Demo task created!');
      loadTasks();
    } catch (error) {
      console.error('Error creating demo task:', error);
      showToast('Error creating demo task');
    }
  };

  useEffect(() => {
    loadTasks();
  }, [currentUser, isAdmin]);

  if (loading) {
    return (
      <div style={{
        marginBottom: '30px',
        padding: '40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div>⏳</div>
        <h3>Loading Tasks...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        marginBottom: '30px',
        padding: '40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div>❌</div>
        <h3>Tasks Feature</h3>
        <p>{error}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
          <button 
            onClick={loadTasks}
            style={{ 
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          {currentUser && (
            <button 
              onClick={createDemoTask}
              style={{ 
                background: '#10B981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Create Demo Task
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      marginBottom: '30px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.3)',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ color: 'white', margin: 0 }}>Tasks Management</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '5px 0 0 0' }}>
          {isAdmin ? 'Manage and track all tasks' : 'Your assigned tasks'}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '25px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ color: 'white', margin: 0 }}>
              Task List ({tasks.length} tasks)
            </h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={loadTasks}
                style={{ 
                  background: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Refresh
              </button>
              {isAdmin && (
                <button 
                  onClick={createDemoTask}
                  style={{ 
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  + Add Task
                </button>
              )}
            </div>
          </div>
          
          {tasks.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: 'rgba(255, 255, 255, 0.7)',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📝</div>
              <p>No tasks found</p>
              {!isAdmin && (
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Tasks assigned to you will appear here
                </p>
              )}
            </div>
          ) : (
            <div>
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    opacity: task.completed ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        marginBottom: '5px'
                      }}>
                        {task.title}
                        <span style={{ 
                          marginLeft: '10px',
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 
                            task.priority === 'high' ? '#EF4444' :
                            task.priority === 'medium' ? '#F59E0B' : '#10B981',
                          color: 'white'
                        }}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '10px' }}>
                          {task.description}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          👤 Assigned: {task.assignedTo}
                        </span>
                        {task.dueDate && (
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span style={{ 
                          color: task.completed ? '#10B981' : '#F59E0B',
                          fontWeight: 'bold'
                        }}>
                          {task.completed ? '✅ Completed' : '🟡 Pending'}
                        </span>
                      </div>
                    </div>
                    
                    {!task.completed && (
                      <button 
                        onClick={() => markTaskComplete(task.id, true)}
                        style={{ 
                          background: '#10B981',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Mark Complete
                      </button>
                    )}
                    {task.completed && (
                      <button 
                        onClick={() => markTaskComplete(task.id, false)}
                        style={{ 
                          background: '#F59E0B',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}