'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Task, User } from '@/types';
import { supabase } from '@/lib/supabase';
import { getAllUsers } from '@/lib/supabase-auth';

export default function TasksSection() {
  const { showToast, currentUser, isAdmin } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  // Task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Load tasks and users from Supabase
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
        status: task.status || (task.completed ? 'completed' : 'pending'),
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

  // Load users for the dropdown
  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      // Filter to only show bartenders and trainees (not admins) for task assignment
      const teamUsers = allUsers.filter(user => 
        user.position === 'Bartender' || user.position === 'Trainee'
      );
      setUsers(teamUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const updateData: any = {
        status,
        completed: status === 'completed'
      };
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

      const statusMessages = {
        'pending': 'Task marked as pending',
        'in-progress': 'Task marked as in progress', 
        'completed': 'Task marked as completed'
      };
      
      showToast(statusMessages[status]);
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      showToast('Error updating task');
    }
  };

  const createTask = async () => {
    if (!currentUser) return;

    try {
      setCreating(true);
      
      if (!newTask.title.trim()) {
        showToast('Task title is required');
        return;
      }

      if (!newTask.assignedTo.trim()) {
        showToast('Please select someone to assign the task to');
        return;
      }

      const taskData = {
        title: newTask.title,
        description: newTask.description,
        assigned_to: newTask.assignedTo,
        due_date: newTask.dueDate || null,
        status: 'pending',
        completed: false,
        priority: newTask.priority,
        created_by: currentUser.email
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      showToast('Task created successfully!');
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium'
      });
      setShowCreateForm(false);
      loadTasks();
    } catch (error: any) {
      console.error('Error creating task:', error);
      showToast(`Error creating task: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const deleteTask = async (taskId: string) => {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    setLoading(true); // Show loading state
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    showToast('Task deleted successfully');
    await loadTasks(); // Wait for reload to complete
    
  } catch (error: any) {
    console.error('Error deleting task:', error);
    showToast(`Error deleting task: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadTasks();
    if (isAdmin) {
      loadUsers();
    }
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
        {/* Task Creation Form */}
        {showCreateForm && isAdmin && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <h4 style={{ color: 'white', margin: '0 0 15px 0' }}>Create New Task</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Task Title *"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                rows={3}
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
              
              {/* User Dropdown */}
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                  Assign To *
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  style={{
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                    width: '100%'
                  }}
                >
                  <option value="">Select Team Member</option>
                  {users.map((user) => (
                    <option key={user.email} value={user.email}>
                      {user.name} ({user.position}) - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    style={{
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '1rem',
                      width: '100%'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    style={{
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '1rem',
                      width: '100%'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  style={{ 
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={createTask}
                  disabled={creating}
                  style={{ 
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    opacity: creating ? 0.6 : 1
                  }}
                >
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        )}

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
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  style={{ 
                    background: showCreateForm ? '#6B7280' : '#10B981',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {showCreateForm ? 'Cancel' : '+ Add Task'}
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
                    opacity: task.status === 'completed' ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: 'white',
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
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
                        <span style={{ 
                          marginLeft: '10px',
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 
                            task.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' :
                            task.status === 'in-progress' ? 'rgba(59, 130, 246, 0.2)' :
                            'rgba(245, 158, 11, 0.2)',
                          color: 
                            task.status === 'completed' ? '#10B981' :
                            task.status === 'in-progress' ? '#3B82F6' : '#F59E0B'
                        }}>
                          {task.status === 'completed' ? '✅ Completed' :
                           task.status === 'in-progress' ? '🟡 In Progress' : '⚪ Pending'}
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
                        {task.status === 'completed' && task.completedAt && (
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Completed: {new Date(task.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Pending -> Start Task */}
                      {task.status === 'pending' && (
                        <button 
                          onClick={() => updateTaskStatus(task.id, 'in-progress')}
                          style={{ 
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Start Task
                        </button>
                      )}
                      
                      {/* In Progress -> Complete */}
                      {task.status === 'in-progress' && (
                        <button 
                          onClick={() => updateTaskStatus(task.id, 'completed')}
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
                          Complete
                        </button>
                      )}
                      
                      {/* Completed -> Reopen */}
                      {task.status === 'completed' && (
                        <button 
                          onClick={() => updateTaskStatus(task.id, 'in-progress')}
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
                      
                      {/* Delete button for admins */}
                      {isAdmin && (
                        <button 
                          onClick={() => deleteTask(task.id)}
                          style={{ 
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
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