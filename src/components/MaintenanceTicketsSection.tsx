'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MaintenanceTicket } from '@/types';
import { supabaseMaintenance } from '@/lib/supabase-maintenance';
import { getAllUsers } from '@/lib/supabase-auth';

// Define section colors
const SECTION_COLOR = '#DC2626'; // Red color for maintenance
const SECTION_COLOR_RGB = '220, 38, 54';

export default function MaintenanceTicketsSection() {
  const { currentUser, showToast, isAdmin } = useApp();
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'assigned' | 'in-progress' | 'completed'>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    assignedTo: '',
    notes: '',
    status: 'open' as MaintenanceTicket['status']
  });
  const [newTicket, setNewTicket] = useState({
    floor: '2000s' as MaintenanceTicket['floor'],
    location: '',
    title: '',
    description: '',
    priority: 'medium' as MaintenanceTicket['priority']
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
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateTicket = async () => {
    if (!currentUser) return;

    try {
      if (!newTicket.title.trim() || !newTicket.location.trim()) {
        showToast('Title and location are required');
        return;
      }

      await supabaseMaintenance.createTicket({
        ...newTicket,
        reportedBy: currentUser.name,
        reportedByEmail: currentUser.email
      });

      showToast('Maintenance ticket created successfully!');
      setShowCreateForm(false);
      setNewTicket({
        floor: '2000s',
        location: '',
        title: '',
        description: '',
        priority: 'medium'
      });
      loadTickets();
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      showToast(`Error creating ticket: ${error.message}`);
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

  // Add real-time subscription
  useEffect(() => {
    if (!currentUser) return;

    const subscription = supabaseMaintenance.subscribeToTickets((tickets) => {
      setTickets(tickets);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

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

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress' || t.status === 'assigned').length;
  const completedTickets = tickets.filter(t => t.status === 'completed' || t.status === 'closed').length;

  if (loading) {
    return (
      <div style={{
        marginBottom: '30px',
        padding: '40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div>⏳</div>
        <h3>Loading Maintenance Tickets...</h3>
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
        background: 'rgba(220, 38, 54, 0.3)',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ color: 'white', margin: 0 }}>Maintenance Tickets</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '5px 0 0 0' }}>
          {isAdmin ? 'Manage and track maintenance requests' : 'Report and track maintenance issues'}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '25px' }}>
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
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e53e3e' }}>{openTickets}</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Open</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3182ce' }}>{inProgressTickets}</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>In Progress</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>{completedTickets}</div>
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

        {/* Create Ticket Form */}
        {showCreateForm && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <h4 style={{ color: 'white', margin: '0 0 15px 0' }}>Create Maintenance Ticket</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                    Floor *
                  </label>
                  <select
                    value={newTicket.floor}
                    onChange={(e) => setNewTicket({...newTicket, floor: e.target.value as MaintenanceTicket['floor']})}
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
                    <option value="2000s">2000s Floor</option>
                    <option value="2010s">2010s Floor</option>
                    <option value="Hip Hop">Hip Hop Floor</option>
                    <option value="Rooftop">Rooftop</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as MaintenanceTicket['priority']})}
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
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Main Bar, Restroom A, DJ Booth"
                  value={newTicket.location}
                  onChange={(e) => setNewTicket({...newTicket, location: e.target.value})}
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

              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
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

              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                  Description
                </label>
                <textarea
                  placeholder="Detailed description of the maintenance issue..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
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
                  onClick={handleCreateTicket}
                  style={{ 
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
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
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
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
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{ 
                  background: showCreateForm ? '#6B7280' : '#DC2626',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {showCreateForm ? 'Cancel' : '+ Report Issue'}
              </button>
            </div>
          </div>
        </div>

        {/* Assignment Form */}
        {selectedTicket && isAdmin && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
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
                  Try changing the filter or create a new ticket
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
                    {isAdmin && (
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Actions</th>
                    )}
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
                      {isAdmin && (
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
                      )}
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