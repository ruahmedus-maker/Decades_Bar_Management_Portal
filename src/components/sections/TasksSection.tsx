'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';
import { supabase } from '@/lib/supabase';

export default function TasksSection() {
  const { showToast } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from Supabase
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        setError('Tasks table not found - create it in Supabase');
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

  useEffect(() => {
    loadTasks();
  }, []);

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
        <p>Task management will be available after database setup</p>
        <button 
          onClick={() => {
            // Use demo data
            const demoTasks: Task[] = [
              {
                id: '1',
                title: 'Setup Training Session',
                description: 'Organize bartender training',
                assignedTo: 'Manager',
                dueDate: new Date().toISOString(),
                completed: false,
                createdAt: new Date().toISOString(),
                eventId: 'null',
                priority: 'high'
              },
              {
                id: '2', 
                title: 'Inventory Check',
                description: 'Weekly stock audit',
                assignedTo: 'Staff',
                dueDate: new Date().toISOString(),
                completed: true,
                createdAt: new Date().toISOString(),
                eventId: 'null',
                priority: 'medium'
              }
            ];
            setTasks(demoTasks);
            setError(null);
          }}
          style={{ 
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Use Demo Data
        </button>
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
          Manage and track assigned tasks
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '25px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: 'white', margin: '0 0 15px 0' }}>Task List ({tasks.length} tasks)</h4>
          
          {tasks.length === 0 ? (
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
              No tasks found
            </p>
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
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '5px' }}>
                      {task.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', fontSize: '0.8rem' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Assigned: {task.assignedTo}</span>
                    <span style={{ 
                      color: task.completed ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
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
            Refresh Tasks
          </button>
        </div>
      </div>
    </div>
  );
}