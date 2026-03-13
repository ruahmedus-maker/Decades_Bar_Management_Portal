'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Task, User } from '@/types';
import { supabase } from '@/lib/supabase';
import { getAllUsers } from '@/lib/supabase-auth';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, children }: any) {
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
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TasksSection() {
  const { showToast, currentUser, isAdmin } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (!isAdmin && currentUser) query = query.eq('assigned_to', currentUser.email);
      const { data, error } = await query;
      if (error) throw error;
      setTasks((data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        assignedTo: t.assigned_to,
        dueDate: t.due_date,
        status: t.status || (t.completed ? 'completed' : 'pending'),
        completed: t.completed,
        priority: t.priority
      })));
    } catch (e) {
      showToast('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const all = await getAllUsers();
    setUsers(all.filter(u => u.position === 'Bartender' || u.position === 'Trainee'));
  };

  useEffect(() => {
    loadTasks();
    if (isAdmin) loadUsers();
  }, [currentUser, isAdmin]);

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      await supabase.from('tasks').update({ status, completed: status === 'completed', completed_at: status === 'completed' ? new Date().toISOString() : null }).eq('id', id);
      showToast('Task updated');
      loadTasks();
    } catch (e) {
      showToast('Update error');
    }
  };

  const createTask = async () => {
    if (!currentUser || !newTask.title.trim() || !newTask.assignedTo.trim()) return;
    try {
      await supabase.from('tasks').insert([{ title: newTask.title, description: newTask.description, assigned_to: newTask.assignedTo, due_date: newTask.dueDate || null, status: 'pending', completed: false, priority: newTask.priority, created_by: currentUser.email }]);
      showToast('Task created');
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium' });
      setShowCreateForm(false);
      loadTasks();
    } catch (e) {
      showToast('Creation error');
    }
  };

  if (loading && tasks.length === 0) return null;

  return (
    <div style={{
      marginBottom: '25px',
      borderRadius: '20px',
      overflow: 'hidden',
      background: uiBackground,
      backdropFilter: uiBackdropFilter,
      WebkitBackdropFilter: uiBackdropFilterWebkit,
      border: '1px solid rgba(255, 255, 255, 0.22)',
      boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
    }}>
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
            Operations & Tasks
          </h3>
          <p style={{ margin: 0, opacity: 0.7, color: 'white', fontSize: '0.8rem', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {isAdmin ? 'System-wide delegation and tracking' : 'Active individual assignments'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadTasks} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem', padding: '4px 12px', borderRadius: '30px', cursor: 'pointer', letterSpacing: '1px' }}>REFRESH</button>
          {isAdmin && <button onClick={() => setShowCreateForm(!showCreateForm)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '0.65rem', padding: '4px 12px', borderRadius: '30px', cursor: 'pointer', letterSpacing: '1px' }}>{showCreateForm ? 'CANCEL' : 'NEW TASK'}</button>}
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        {showCreateForm && (
          <AnimatedCard title="📝 Delegate New Task">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} rows={2} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', resize: 'none' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <select value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}>
                  <option value="">Assignee</option>
                  {users.map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
                </select>
                <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button onClick={createTask} style={{ padding: '12px', background: 'white', color: 'black', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Create Task</button>
            </div>
          </AnimatedCard>
        )}

        <div style={{ overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: task.status === 'completed' ? 'rgba(16,185,129,0.02)' : 'transparent' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'white', background: task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{task.priority}</span>
                  <h5 style={{ ...premiumWhiteStyle, margin: 0, fontSize: '0.95rem', fontWeight: 300, textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.5 : 1 }}>{task.title}</h5>
                </div>
                <p style={{ ...premiumBodyStyle, fontSize: '0.75rem', margin: 0, opacity: 0.5 }}>{task.assignedTo} {task.dueDate && `• Due: ${new Date(task.dueDate).toLocaleDateString()}`}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {task.status !== 'completed' && <button onClick={() => updateTaskStatus(task.id, 'completed')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>COMPLETE</button>}
                {task.status === 'completed' && <button onClick={() => updateTaskStatus(task.id, 'pending')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>REOPEN</button>}
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p style={{ ...premiumBodyStyle, opacity: 0.5, textAlign: 'center', padding: '40px' }}>No active tasks found.</p>}
        </div>
      </div>
    </div>
  );
}