'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { specialEventsStorage } from '@/lib/specialEvents';
import { Task } from '@/types';

export default function TasksSection() {
  const { showToast } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const allTasks = specialEventsStorage.getAllTasks();
    setTasks(allTasks);
  };

  const handleUpdateTaskStatus = (task: Task, completed: boolean) => {
    if (!task.eventId) return;
    
    specialEventsStorage.updateTask(task.eventId, task.id, { 
      completed,
      completedAt: completed ? new Date().toISOString() : undefined
    });
    showToast(`Task marked as ${completed ? 'completed' : 'pending'}!`);
    loadTasks();
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

  return (
    <div className="section active">
      <div className="section-header">
        <h3>Tasks Management</h3>
        <span className="badge">Admin Only</span>
      </div>

      {/* Quick Stats */}
      <div className="card-grid" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: '#d69e2e' }}>{tasks.length}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Total Tasks</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: '#e53e3e' }}>{pendingTasksCount}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Pending</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: '#38a169' }}>{completedTasksCount}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Completed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label>Status:</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                style={{ marginLeft: '8px', padding: '5px' }}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>
            <div>
              <label>Priority:</label>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                style={{ marginLeft: '8px', padding: '5px' }}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button 
              className="btn"
              onClick={loadTasks}
              style={{ marginLeft: 'auto', background: '#4a5568', color: 'white' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card">
        <div className="card-body">
          {filteredTasks.length === 0 ? (
            <p>No tasks found matching your filters.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Task</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Event</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Assigned To</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Due Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Priority</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.title}
                          </div>
                          {task.description && (
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                              {task.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {task.eventId ? `Event: ${task.eventId}` : 'Standalone Task'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {task.assignedTo}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem',
                          background: `${getPriorityColor(task.priority)}20`,
                          color: getPriorityColor(task.priority),
                          fontWeight: 'bold'
                        }}>
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem',
                          background: task.completed ? '#38a16920' : '#e53e3e20',
                          color: task.completed ? '#38a169' : '#e53e3e',
                          fontWeight: 'bold'
                        }}>
                          {task.completed ? 'COMPLETED' : 'PENDING'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button 
                          onClick={() => handleUpdateTaskStatus(task, !task.completed)}
                          style={{ 
                            background: task.completed ? '#d69e2e' : '#38a169', 
                            color: 'white', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          {task.completed ? 'Mark Pending' : 'Mark Complete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}