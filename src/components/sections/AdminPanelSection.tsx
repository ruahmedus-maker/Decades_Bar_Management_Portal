'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { User, MaintenanceTicket, Task } from '@/types';
import SpecialEventsSection from './SpecialEventsSection';
import TasksSection from './TasksSection';
import { supabase } from '@/lib/supabase';
import { getAllUsers, updateUser } from '@/lib/supabase-auth';
import { getProgressBreakdown } from '@/lib/progress';

// Modern color theme for admin panel
const SECTION_COLOR = '#2563eb';
const SECTION_COLOR_RGB = '37, 99, 235';
const ACCENT_COLOR = '#8b5cf6';
const SUCCESS_COLOR = '#10b981';
const WARNING_COLOR = '#f59e0b';
const DANGER_COLOR = '#ef4444';

interface UserProgress {
  user: User;
  sectionsCompleted: number;
  totalSections: number;
  progressPercentage: number;
  lastActive: string;
  timeSinceLastActive: string;
  completionStatus: 'excellent' | 'good' | 'poor' | 'inactive';
}

interface TestResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  date: string;
  testName: string;
}

interface QuickStats {
  totalUsers: number;
  activeUsers: number;
  pendingTickets: number;
  completedTasks: number;
  totalTasks: number;
  excellentProgress: number;
}

// List of users who should be hidden from other users in admin panel
const HIDDEN_USERS = [
  'riaz11@hotmail.com',
  'user2@decadesbar.com',
  'user3@decadesbar.com'
];

// Enhanced Card Component
function AdminCard({ title, value, change, icon, color, onClick }: any) {
  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid rgba(255, 255, 255, 0.15)`,
        backdropFilter: 'blur(10px)',
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `4px solid ${color}`
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ 
            margin: 0, 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '0.9rem',
            marginBottom: '8px'
          }}>
            {title}
          </p>
          <h3 style={{ 
            margin: 0, 
            color: 'white', 
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            {value}
          </h3>
          {change && (
            <p style={{ 
              margin: '5px 0 0 0', 
              color: change > 0 ? SUCCESS_COLOR : DANGER_COLOR,
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          background: `rgba(${color}, 0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Task Creation Modal
function TaskCreationModal({ isOpen, onClose, onTaskCreated }: any) {
  const { currentUser, showToast } = useApp();
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users for assignment
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const filteredUsers = allUsers.filter(user => 
          (user.position === 'Bartender' || user.position === 'Trainee') &&
          (!HIDDEN_USERS.includes(user.email) || user.email === currentUser?.email)
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      const taskId = `task-${Date.now()}`;
      const taskData = {
        id: taskId,
        title: taskForm.title,
        description: taskForm.description,
        assigned_to: taskForm.assignedTo,
        due_date: taskForm.dueDate || null,
        completed: false,
        priority: taskForm.priority,
        created_by: currentUser.email,
      };

      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) throw error;

      showToast('Task created successfully!');
      onTaskCreated();
      onClose();
      
      setTaskForm({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium',
      });
    } catch (error: any) {
      console.error('Error creating task:', error);
      showToast(error.message || 'Error creating task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        border: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`
        }}>
          <h3 style={{ margin: 0, color: 'white' }}>Create New Task</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Task Title *
            </label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="Enter task title"
              style={{ 
                width: '100%', 
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Description
            </label>
            <textarea
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Task description..."
              rows={3}
              style={{ 
                width: '100%', 
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                Assign To *
              </label>
              <select
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                }}
                required
              >
                <option value="">Select employee</option>
                {users.map(user => (
                  <option key={user.email} value={user.email}>
                    {user.name} ({user.position})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                Priority *
              </label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                }}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Due Date
            </label>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? 'rgba(37, 99, 235, 0.5)' : SECTION_COLOR,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Maintenance Tickets Content Component
function MaintenanceTicketsContent() {
  const { showToast, currentUser } = useApp();
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'assigned' | 'completed'>('all');

  // Load tickets from Supabase
  const loadTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tickets:', error);
        showToast('Error loading maintenance tickets');
        return;
      }

      // ✅ FIXED: Use the correct field names that match your database
      const convertedTickets: MaintenanceTicket[] = (data || []).map((ticket: any) => ({
        id: ticket.id,
        floor: ticket.floor,
        location: ticket.location,
        title: ticket.title,
        description: ticket.description,
        reported_by: ticket.reported_by,
        reported_by_email: ticket.reported_by_email,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        notes: ticket.notes,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at
      }));

      setTickets(convertedTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      showToast('Error loading maintenance tickets');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    loadTickets();

    const subscription = supabase
      .channel('maintenance-tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_tickets'
        },
        () => {
          loadTickets();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdateStatus = async (ticketId: string, newStatus: MaintenanceTicket['status']) => {
    try {
      const { error } = await supabase
        .from('maintenance_tickets')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      showToast(`Ticket status updated to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      showToast('Error updating ticket status');
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance ticket?')) {
      try {
        const { error } = await supabase
          .from('maintenance_tickets')
          .delete()
          .eq('id', ticketId);

        if (error) throw error;

        showToast('Maintenance ticket deleted successfully!');
      } catch (error) {
        console.error('Error deleting ticket:', error);
        showToast('Error deleting maintenance ticket');
      }
    }
  };

  const handleAssignToMe = async (ticketId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('maintenance_tickets')
        .update({ 
          assigned_to: currentUser.email,
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      showToast('Ticket assigned to you!');
    } catch (error) {
      console.error('Error assigning ticket:', error);
      showToast('Error assigning ticket');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const assignedTickets = tickets.filter(t => t.status === 'assigned').length;
  const completedTickets = tickets.filter(t => t.status === 'completed').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return DANGER_COLOR;
      case 'in-progress': return WARNING_COLOR;
      case 'assigned': return WARNING_COLOR;
      case 'completed': return SUCCESS_COLOR;
      case 'closed': return '#718096';
      default: return '#718096';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return DANGER_COLOR;
      case 'high': return '#ed8936';
      case 'medium': return WARNING_COLOR;
      case 'low': return SUCCESS_COLOR;
      default: return '#718096';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          <h3>Loading Maintenance Tickets...</h3>
          <p>Connecting to cloud database</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px'
      }}>
        <AdminCard
          title="Open Tickets"
          value={openTickets}
          icon="🔧"
          color="239, 68, 68"
        />
        <AdminCard
          title="In Progress"
          value={inProgressTickets + assignedTickets}
          icon="🔄"
          color="245, 158, 11"
        />
        <AdminCard
          title="Completed"
          value={completedTickets}
          icon="✅"
          color="16, 185, 129"
        />
        <AdminCard
          title="Closed"
          value={closedTickets}
          icon="📁"
          color="113, 128, 150"
        />
      </div>

      {/* Filters and Actions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>Status:</label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              style={{ 
                marginLeft: '8px', 
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                minWidth: '150px'
              }}
            >
              <option value="all">All Tickets</option>
              <option value="open">Open Only</option>
              <option value="in-progress">In Progress</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginLeft: 'auto',
            alignItems: 'center'
          }}>
            <button 
              onClick={loadTickets}
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
      </div>

      {/* Tickets List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}>
        <h4 style={{ 
          color: 'white', 
          margin: '0 0 15px 0',
          fontSize: '1.2rem'
        }}>
          Maintenance Tickets ({filteredTickets.length})
        </h4>
        
        {filteredTickets.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontStyle: 'italic'
          }}>
            No maintenance tickets found matching your filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredTickets.map((ticket, index) => (
              <div 
                key={ticket.id}
                style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h5 style={{ 
                      color: SECTION_COLOR, 
                      margin: '0 0 8px 0',
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}>
                      {ticket.title}
                    </h5>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      {ticket.location} • {ticket.floor}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: `${getStatusColor(ticket.status)}20`,
                      color: getStatusColor(ticket.status),
                      textTransform: 'capitalize'
                    }}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: `${getPriorityColor(ticket.priority)}20`,
                      color: getPriorityColor(ticket.priority),
                      textTransform: 'capitalize'
                    }}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  margin: '0 0 15px 0',
                  lineHeight: 1.5,
                  fontSize: '0.9rem'
                }}>
                  {ticket.description}
                </p>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <div><strong>Reported by:</strong> {ticket.reported_by || 'Unknown'}</div>
                    <div><strong>Date:</strong> {new Date(ticket.created_at).toLocaleDateString()}</div>
                    {ticket.assigned_to && (
                      <div><strong>Assigned to:</strong> {ticket.assigned_to}</div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {ticket.status === 'open' && (
                      <button 
                        onClick={() => handleAssignToMe(ticket.id)}
                        style={{ 
                          background: WARNING_COLOR,
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        Assign to Me
                      </button>
                    )}
                    {(ticket.status === 'assigned' || ticket.status === 'in-progress') && (
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, 'completed')}
                        style={{ 
                          background: SUCCESS_COLOR,
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        Mark Completed
                      </button>
                    )}
                    {ticket.status === 'completed' && (
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                        style={{ 
                          background: '#718096',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        Close Ticket
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteTicket(ticket.id)}
                      style={{ 
                        background: DANGER_COLOR,
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      Delete Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Team Management Component
function TeamManagementContent({ users, currentUser }: { users: User[], currentUser: User | null }) {
  const { showToast } = useApp();

  // Filter to show only Bartenders and Trainees (no Admins)
  const teamUsers = users.filter(user => 
    user.position === 'Bartender' || user.position === 'Trainee'
  );

  const handleUpdateUserRole = async (email: string, newPosition: 'Bartender' | 'Admin' | 'Trainee') => {
    try {
      await updateUser(email, { position: newPosition });
      showToast(`Updated ${email} to ${newPosition}`);
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating user role:', error);
      showToast('Error updating user role');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    try {
      await updateUser(user.email, { status: newStatus });
      showToast(`${user.name} has been ${newStatus === 'active' ? 'unblocked' : 'blocked'}`);
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast('Error updating user status');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}>
        <h4 style={{ 
          color: 'white', 
          margin: '0 0 20px 0',
          fontSize: '1.2rem'
        }}>
          👥 Team Management ({teamUsers.length} users)
        </h4>

        {teamUsers.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontStyle: 'italic'
          }}>
            No bartenders or trainees found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {teamUsers.map((user, index) => (
              <div 
                key={user.email}
                style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ 
                      color: SECTION_COLOR, 
                      margin: '0 0 8px 0',
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}>
                      {user.name}
                      {user.email === currentUser?.email && (
                        <span style={{ 
                          marginLeft: '10px',
                          fontSize: '0.7rem',
                          background: 'rgba(37, 99, 235, 0.3)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '8px'
                        }}>
                          You
                        </span>
                      )}
                    </h5>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      {user.email}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      marginTop: '10px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        background: 
                          user.position === 'Admin' ? 'rgba(139, 92, 246, 0.2)' :
                          user.position === 'Bartender' ? 'rgba(37, 99, 235, 0.2)' :
                          'rgba(245, 158, 11, 0.2)',
                        color: 
                          user.position === 'Admin' ? ACCENT_COLOR :
                          user.position === 'Bartender' ? SECTION_COLOR :
                          WARNING_COLOR
                      }}>
                        {user.position}
                      </span>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        background: user.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: user.status === 'active' ? SUCCESS_COLOR : DANGER_COLOR
                      }}>
                        {user.status === 'active' ? 'Active' : 'Blocked'}
                      </span>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        Progress: {user.progress || 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {/* Role Dropdown */}
                    <select
                      value={user.position}
                      onChange={(e) => handleUpdateUserRole(user.email, e.target.value as any)}
                      disabled={user.email === currentUser?.email}
                      style={{ 
                        padding: '6px 10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '0.8rem',
                        minWidth: '120px'
                      }}
                    >
                      <option value="Bartender">Bartender</option>
                      <option value="Trainee">Trainee</option>
                    </select>
                    
                    {/* Status Toggle */}
                    <button 
                      onClick={() => handleToggleUserStatus(user)}
                      disabled={user.email === currentUser?.email}
                      style={{
                        background: user.status === 'active' ? DANGER_COLOR : SUCCESS_COLOR,
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: user.email === currentUser?.email ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        opacity: user.email === currentUser?.email ? 0.5 : 1
                      }}
                    >
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '10px'
                }}>
                  <span>Registered: {new Date(user.registeredDate).toLocaleDateString()}</span>
                  <span>Last active: {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPanelSection() {
  const { isAdmin: userIsAdmin, showToast, currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [testResults, setTestResults] = useState<{email: string, user: User, results: Record<string, TestResult>}[]>([]);
  const [blockEmail, setBlockEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'tests' | 'management' | 'maintenance' | 'events' | 'tasks'>('overview');
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingTickets: 0,
    completedTasks: 0,
    totalTasks: 0,
    excellentProgress: 0
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const isAdmin = userIsAdmin && currentUser;

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const loadAllData = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      
      // Load users
      const allUsers = await getAllUsers();
      
      // Filter users based on hidden user logic
      const filteredUsers = allUsers.filter(user => {
        // Always show the current user
        if (user.email === currentUser?.email) return true;
        
        // If current user is hidden, show all users
        if (currentUser && HIDDEN_USERS.includes(currentUser.email)) {
          return true;
        }
        
        // If current user is not hidden, filter out hidden users
        return !HIDDEN_USERS.includes(user.email);
      });
      
      setUsers(filteredUsers);

      // Filter to only show bartenders and trainees (not admins) in progress/management
      const bartendersAndTrainees = filteredUsers.filter(user => 
        user.position === 'Bartender' || user.position === 'Trainee'
      );
      
      // Load user progress for bartenders and trainees only
      const progressData: UserProgress[] = await Promise.all(
        bartendersAndTrainees.map(async (user) => {
          const progress = await getProgressBreakdown(user.email);
          return {
            user,
            sectionsCompleted: progress.sectionsVisited,
            totalSections: progress.totalSections,
            progressPercentage: progress.progress,
            lastActive: user.lastActive || 'Never',
            timeSinceLastActive: getTimeSince(user.lastActive),
            completionStatus: getCompletionStatus(progress.progress)
          };
        })
      );
      setUserProgress(progressData);

      // Load test results for bartenders and trainees only
      const testData = bartendersAndTrainees.map(user => {
        const results = user.testResults || {};
        return { email: user.email, user, results };
      });
      setTestResults(testData);

      // Load quick stats
      const { data: maintenanceTickets } = await supabase
        .from('maintenance_tickets')
        .select('status');

      const { data: tasks } = await supabase
        .from('tasks')
        .select('completed');

      const pendingTickets = (maintenanceTickets || []).filter((t: any) => 
        t.status === 'open' || t.status === 'assigned'
      ).length;

      const completedTasks = (tasks || []).filter((t: any) => t.completed).length;

      setQuickStats({
        totalUsers: bartendersAndTrainees.length, // Only count bartenders/trainees for stats
        activeUsers: progressData.filter(p => p.completionStatus !== 'inactive').length,
        pendingTickets,
        completedTasks,
        totalTasks: tasks?.length || 0,
        excellentProgress: progressData.filter(p => p.progressPercentage >= 90).length
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
      showToast('Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  const getTimeSince = (dateString: string) => {
    if (!dateString || dateString === 'Never') return 'Never';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHours > 0) return `${diffHours}h ago`;
      if (diffMins > 0) return `${diffMins}m ago`;
      return 'Just now';
    } catch {
      return 'Never';
    }
  };

  const getCompletionStatus = (percentage: number) => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage > 0) return 'poor';
    return 'inactive';
  };

  const handleBlockUser = async () => {
    if (blockEmail && blockEmail !== currentUser?.email) {
      try {
        await updateUser(blockEmail, { status: 'blocked' });
        showToast(`User ${blockEmail} has been blocked`);
        setBlockEmail('');
        loadAllData();
      } catch (error) {
        showToast('Error blocking user');
      }
    }
  };

  const handleUnblockUser = async (email: string) => {
    try {
      await updateUser(email, { status: 'active' });
      showToast(`User ${email} has been unblocked`);
      loadAllData();
    } catch (error) {
      showToast('Error unblocking user');
    }
  };

  const blockedUsers = users.filter(user => user.status === 'blocked');

  if (!isAdmin) {
    return (
      <div style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        padding: '40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h3>🔒 Admin Access Required</h3>
        <p>You need administrator privileges to access this section.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        padding: '40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
        <h3>Loading Admin Panel...</h3>
        <p>Connecting to cloud database</p>
      </div>
    );
  }

  return (
    <div 
      id="admin-panel"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
      }}
      className="active"
    >
      
      {/* Section Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
        padding: '25px',
        borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.6rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Manager Command Center
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1rem',
            marginTop: '8px'
          }}>
            Complete oversight and management tools for venue operations
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            color: 'white',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            Admin Access
          </span>
          {currentUser && HIDDEN_USERS.includes(currentUser.email) && (
            <span style={{ 
              fontSize: '0.8rem', 
              color: WARNING_COLOR,
              background: 'rgba(245, 158, 11, 0.2)',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              🔒 Hidden User Mode
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '5px'
        }}>
          {[
            { id: 'overview', label: 'Dashboard', icon: '📊' },
            { id: 'progress', label: 'Progress', icon: '📈' },
            { id: 'tests', label: 'Tests', icon: '🎯' },
            { id: 'management', label: 'Team', icon: '👥' },
            { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
            { id: 'events', label: 'Events', icon: '🎉' },
            { id: 'tasks', label: 'Tasks', icon: '✅' }
          ].map(tab => (
            <button
              key={tab.id}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: activeTab === tab.id ? `rgba(${SECTION_COLOR_RGB}, 0.2)` : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem'
              }}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Quick Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '30px'
            }}>
              <AdminCard 
                title="Total Employees"
                value={quickStats.totalUsers}
                icon="👥"
                color={SECTION_COLOR_RGB}
                onClick={() => setActiveTab('management')}
              />
              <AdminCard 
                title="Active Users"
                value={quickStats.activeUsers}
                icon="🟢"
                color="16, 185, 129"
                onClick={() => setActiveTab('progress')}
              />
              <AdminCard 
                title="Pending Tickets"
                value={quickStats.pendingTickets}
                icon="🔧"
                color="239, 68, 68"
                onClick={() => setActiveTab('maintenance')}
              />
              <AdminCard 
                title="Tasks Completed"
                value={`${quickStats.completedTasks}/${quickStats.totalTasks}`}
                icon="✅"
                color="139, 92, 246"
                onClick={() => setActiveTab('tasks')}
              />
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginBottom: '30px',
            }}>
              <h4 style={{ 
                color: 'white', 
                margin: '0 0 20px 0',
                fontSize: '1.2rem'
              }}>
                ⚡ Quick Actions
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '15px' 
              }}>
                <button 
                  onClick={() => setShowTaskModal(true)}
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    padding: '15px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'center'
                  }}
                >
                  <span>➕</span> Create Task
                </button>
                <button 
                  onClick={() => setActiveTab('management')}
                  style={{
                    background: 'rgba(37, 99, 235, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(37, 99, 235, 0.4)',
                    padding: '15px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'center'
                  }}
                >
                  <span>👥</span> Manage Team
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '15px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'center'
                  }}
                >
                  <span>🎉</span> Plan Event
                </button>
                <button 
                  onClick={loadAllData}
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '15px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'center'
                  }}
                >
                  <span>🔄</span> Refresh Data
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <h4 style={{ 
                color: 'white', 
                margin: '0 0 20px 0',
                fontSize: '1.2rem'
              }}>
                📈 Top Performers
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {userProgress
                  .filter(p => p.progressPercentage > 0)
                  .sort((a, b) => b.progressPercentage - a.progressPercentage)
                  .slice(0, 5)
                  .map((progress, index) => (
                    <div 
                      key={progress.user.email}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${SECTION_COLOR}, ${ACCENT_COLOR})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: '600' }}>
                            {progress.user.name}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                            {progress.user.position} • Last active: {progress.timeSinceLastActive}
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        padding: '6px 12px', 
                        borderRadius: '12px', 
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        background: 
                          progress.completionStatus === 'excellent' ? 'rgba(16, 185, 129, 0.2)' :
                          progress.completionStatus === 'good' ? 'rgba(245, 158, 11, 0.2)' :
                          progress.completionStatus === 'poor' ? 'rgba(239, 68, 68, 0.2)' :
                          'rgba(113, 128, 150, 0.2)',
                        color: 
                          progress.completionStatus === 'excellent' ? SUCCESS_COLOR :
                          progress.completionStatus === 'good' ? WARNING_COLOR :
                          progress.completionStatus === 'poor' ? DANGER_COLOR :
                          '#718096'
                      }}>
                        {progress.progressPercentage}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h4 style={{ 
                color: 'white', 
                margin: 0,
                fontSize: '1.2rem'
              }}>
                📈 Employee Progress Tracking
              </h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={loadAllData}
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

            {userProgress.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic'
              }}>
                No bartenders or trainees found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {userProgress.map((progress, index) => (
                  <div 
                    key={progress.user.email}
                    style={{
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div>
                        <h5 style={{ color: SECTION_COLOR, margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600 }}>
                          {progress.user.name}
                        </h5>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.9rem' }}>
                          {progress.user.email} • {progress.user.position}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          padding: '6px 12px', 
                          borderRadius: '12px', 
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          background: 
                            progress.completionStatus === 'excellent' ? 'rgba(16, 185, 129, 0.2)' :
                            progress.completionStatus === 'good' ? 'rgba(245, 158, 11, 0.2)' :
                            progress.completionStatus === 'poor' ? 'rgba(239, 68, 68, 0.2)' :
                            'rgba(113, 128, 150, 0.2)',
                          color: 
                            progress.completionStatus === 'excellent' ? SUCCESS_COLOR :
                            progress.completionStatus === 'good' ? WARNING_COLOR :
                            progress.completionStatus === 'poor' ? DANGER_COLOR :
                            '#718096'
                        }}>
                          {progress.progressPercentage}% Complete
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '8px 0 0 0', fontSize: '0.8rem' }}>
                          Last active: {progress.timeSinceLastActive}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ 
                      height: '8px', 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '10px'
                    }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          background: 
                            progress.completionStatus === 'excellent' ? SUCCESS_COLOR :
                            progress.completionStatus === 'good' ? WARNING_COLOR :
                            progress.completionStatus === 'poor' ? DANGER_COLOR :
                            '#718096',
                          width: `${progress.progressPercentage}%`,
                        }} 
                      />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      <span>{progress.sectionsCompleted} of {progress.totalSections} sections completed</span>
                      <span>{Math.round(progress.progressPercentage)}% overall</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <h4 style={{ 
              color: 'white', 
              margin: '0 0 20px 0',
              fontSize: '1.2rem'
            }}>
              🎯 Test Results & Performance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {testResults.map((userResult, userIndex) => (
                <div 
                  key={userResult.email}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h5 style={{ color: SECTION_COLOR, margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: 600 }}>
                    {userResult.user.name} - {userResult.user.position}
                  </h5>
                  
                  {Object.keys(userResult.results).length === 0 ? (
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                      No test results available
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      {Object.entries(userResult.results).map(([testName, result], testIndex) => (
                        <div 
                          key={testName}
                          style={{
                            padding: '15px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            border: `1px solid ${result.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <span style={{ 
                              color: 'white', 
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}>
                              {testName}
                            </span>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '10px', 
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              background: result.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: result.passed ? SUCCESS_COLOR : DANGER_COLOR
                            }}>
                              {result.passed ? 'PASS' : 'FAIL'}
                            </span>
                          </div>
                          <div style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '0.8rem',
                            marginBottom: '5px'
                          }}>
                            Score: {result.score}/{result.total} ({result.percentage}%)
                          </div>
                          <div style={{ 
                            color: 'rgba(255, 255, 255, 0.6)', 
                            fontSize: '0.7rem'
                          }}>
                            {new Date(result.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Management Tab */}
        {activeTab === 'management' && (
          <TeamManagementContent users={users} currentUser={currentUser} />
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <MaintenanceTicketsContent />
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <SpecialEventsSection isAdminView={true} />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <TasksSection />
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <TaskCreationModal 
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskCreated={loadAllData}
      />
    </div>
  );
}