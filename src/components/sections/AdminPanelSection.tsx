'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { User, MaintenanceTicket, Task } from '@/types';
import SpecialEventsSection from './SpecialEventsSection';
import TasksSection from './TasksSection';
import { supabase } from '@/lib/supabase';
import { getAllUsers, updateUser } from '@/lib/supabase-auth';
import { getProgressBreakdown } from '@/lib/progress';
import { supabaseMaintenance } from '@/lib/supabase-maintenance';

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

// Enhanced Card Component
function AdminCard({ title, value, icon, color, onClick }: any) {
  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid rgba(255, 255, 255, 0.15)`,
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

// Team Management Component
function TeamManagementContent({ users, currentUser }: { users: User[], currentUser: User | null }) {
  const { showToast } = useApp();

  // Filter to show only Bartenders and Trainees (no Admins)
  const teamUsers = users.filter(user => 
    user.position === 'Bartender' || user.position === 'Trainee'
  );

  console.log('Team Management - All users:', users);
  console.log('Team Management - Filtered team users:', teamUsers);

  const handleUpdateUserRole = async (email: string, newPosition: 'Bartender' | 'Trainee') => {
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
                        background: user.position === 'Bartender' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: user.position === 'Bartender' ? SECTION_COLOR : WARNING_COLOR
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
                      onChange={(e) => handleUpdateUserRole(user.email, e.target.value as 'Bartender' | 'Trainee')}
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

// Maintenance Tickets Management Component for Admin Panel
function MaintenanceTicketsManagement() {
  const { showToast } = useApp();
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'assigned' | 'in-progress' | 'completed'>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({
    assignedTo: '',
    notes: '',
    status: 'open' as MaintenanceTicket['status']
  });

  useEffect(() => {
    loadTickets();
    loadUsers();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await supabaseMaintenance.getTickets();
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error loading tickets:', error);
      showToast('Error loading maintenance tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      // Filter to only show bartenders and trainees for assignment
      const teamUsers = allUsers.filter(user => 
        user.position === 'Bartender' || user.position === 'Trainee'
      );
      setUsers(teamUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleUpdateTicket = async (ticketId: string, updates: Partial<MaintenanceTicket>) => {
    try {
      await supabaseMaintenance.updateTicket(ticketId, updates);
      showToast('Ticket updated successfully!');
      loadTickets();
      setSelectedTicket(null);
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      showToast(`Error updating ticket: ${error.message}`);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await supabaseMaintenance.deleteTicket(ticketId);
      showToast('Ticket deleted successfully!');
      loadTickets();
      setSelectedTicket(null);
    } catch (error: any) {
      console.error('Error deleting ticket:', error);
      showToast(`Error deleting ticket: ${error.message}`);
    }
  };

  const handleAssignTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updates: Partial<MaintenanceTicket> = {
      status: assignmentForm.status,
      notes: assignmentForm.notes || undefined
    };

    if (assignmentForm.assignedTo) {
      updates.assigned_to = assignmentForm.assignedTo;
    }

    handleUpdateTicket(selectedTicket.id, updates);
    setAssignmentForm({ assignedTo: '', notes: '', status: 'open' });
  };

  const getStatusColor = (status: MaintenanceTicket['status']) => {
    switch (status) {
      case 'open': return '#e53e3e';
      case 'assigned': return '#d69e2e';
      case 'in-progress': return '#3182ce';
      case 'completed': return '#38a169';
      case 'closed': return '#718096';
      default: return '#718096';
    }
  };

  const getPriorityColor = (priority: MaintenanceTicket['priority']) => {
    switch (priority) {
      case 'low': return '#38a169';
      case 'medium': return '#d69e2e';
      case 'high': return '#ed8936';
      case 'urgent': return '#e53e3e';
      default: return '#718096';
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    filter === 'all' || ticket.status === filter
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
        <div>⏳</div>
        <h3>Loading Maintenance Tickets...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e53e3e' }}>
            {tickets.filter(t => t.status === 'open').length}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Open</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3182ce' }}>
            {tickets.filter(t => t.status === 'in-progress' || t.status === 'assigned').length}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>In Progress</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>
            {tickets.filter(t => t.status === 'completed' || t.status === 'closed').length}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Completed</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d4af37' }}>{tickets.length}</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Total</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
            Filter by Status:
          </label>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            onClick={loadTickets}
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
        </div>
      </div>

      {/* Assignment Form */}
      {selectedTicket && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ color: 'white', margin: 0 }}>Manage Ticket: {selectedTicket.title}</h4>
            <button 
              onClick={() => setSelectedTicket(null)}
              style={{ 
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleAssignTicket}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                  Assign To
                </label>
                <select
                  value={assignmentForm.assignedTo}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, assignedTo: e.target.value })}
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
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.email} value={user.email}>
                      {user.name} ({user.position})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                  Status
                </label>
                <select
                  value={assignmentForm.status}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, status: e.target.value as any })}
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
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                Notes
              </label>
              <textarea
                value={assignmentForm.notes}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                placeholder="Add notes or instructions..."
                rows={3}
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem',
                  width: '100%',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit"
                style={{ 
                  background: '#3182ce',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Update Ticket
              </button>
              <button 
                type="button"
                onClick={() => handleDeleteTicket(selectedTicket.id)}
                style={{ 
                  background: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Delete Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ color: 'white', margin: 0 }}>
            Maintenance Tickets ({filteredTickets.length} tickets)
          </h4>
        </div>
        
        {filteredTickets.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: 'rgba(255, 255, 255, 0.7)',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔧</div>
            <p>No maintenance tickets found</p>
            {filter !== 'all' && (
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Try changing the filter
              </p>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Ticket</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Floor</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Priority</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Reported By</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Assigned To</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Created</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'white' }}>{ticket.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>{ticket.location}</div>
                        {ticket.description && (
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
                            {ticket.description.length > 100 
                              ? `${ticket.description.substring(0, 100)}...` 
                              : ticket.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>{ticket.floor}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        background: `${getPriorityColor(ticket.priority)}20`,
                        color: getPriorityColor(ticket.priority),
                        fontWeight: 'bold'
                      }}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        background: `${getStatusColor(ticket.status)}20`,
                        color: getStatusColor(ticket.status),
                        fontWeight: 'bold'
                      }}>
                        {ticket.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'white' }}>{ticket.reported_by}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>{ticket.reported_by_email}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {ticket.assigned_to ? (
                        <span style={{ color: '#3182ce', fontWeight: 'bold' }}>
                          {users.find(u => u.email === ticket.assigned_to)?.name || ticket.assigned_to}
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setAssignmentForm({
                            assignedTo: ticket.assigned_to || '',
                            notes: ticket.notes || '',
                            status: ticket.status
                          });
                        }}
                        style={{ 
                          background: '#d4af37', 
                          color: 'white', 
                          border: 'none', 
                          padding: '6px 12px', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Manage
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
  );
}

export default function AdminPanelSection() {
  const { isAdmin: userIsAdmin, showToast, currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [testResults, setTestResults] = useState<{email: string, user: User, results: Record<string, TestResult>}[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'tests' | 'management' | 'maintenance' | 'events' | 'tasks'>('overview');
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingTickets: 0,
    completedTasks: 0,
    totalTasks: 0,
    excellentProgress: 0
  });
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
      console.log('Loading admin data...');
      
      // Load users
      const allUsers = await getAllUsers();
      console.log('All users loaded:', allUsers);
      
      setUsers(allUsers);

      // Filter to only show bartenders and trainees (not admins) in progress/management
      const bartendersAndTrainees = allUsers.filter(user => 
        user.position === 'Bartender' || user.position === 'Trainee'
      );
      
      console.log('Bartenders and trainees:', bartendersAndTrainees);
      
      // Load user progress for bartenders and trainees only
      const progressData: UserProgress[] = await Promise.all(
        bartendersAndTrainees.map(async (user) => {
          try {
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
          } catch (error) {
            console.error(`Error loading progress for ${user.email}:`, error);
            return {
              user,
              sectionsCompleted: 0,
              totalSections: 0,
              progressPercentage: 0,
              lastActive: user.lastActive || 'Never',
              timeSinceLastActive: getTimeSince(user.lastActive),
              completionStatus: 'inactive' as const
            };
          }
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
        totalUsers: bartendersAndTrainees.length,
        activeUsers: progressData.filter(p => p.completionStatus !== 'inactive').length,
        pendingTickets,
        completedTasks,
        totalTasks: tasks?.length || 0,
        excellentProgress: progressData.filter(p => p.progressPercentage >= 90).length
      });

      console.log('Admin data loaded successfully');
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
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            color: 'white',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            Admin Access
          </span>
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
                      onClick={() => setActiveTab('tasks')}
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
                  <span>✅</span> Manage Tasks
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

        {/* Management Tab */}
        {activeTab === 'management' && (
          <TeamManagementContent users={users} currentUser={currentUser} />
        )}

        // In AdminPanelSection.tsx, replace the maintenance tab section:
{activeTab === 'maintenance' && (
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
        🔧 Maintenance Tickets Management
      </h4>
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

    {/* Maintenance Tickets Management Component */}
    <MaintenanceTicketsManagement />
  </div>
)}

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

        {activeTab === 'tasks' && (
          <div style={{
          background: 'transparent',
          borderRadius: '0',
          padding: '0',
          border: 'none'
        }}>
       <TasksSection />
      </div>
        )}
      </div>
    </div>
  );
}