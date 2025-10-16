'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { MaintenanceTicket } from '@/types';

export default function MaintenanceTicketsSection() {
  const { currentUser, showToast } = useApp();
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'assigned' | 'in-progress' | 'completed'>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({
    assignedTo: '',
    notes: '',
    status: 'open' as MaintenanceTicket['status']
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const ticketsData = storage.getMaintenanceTickets();
    setTickets(ticketsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleUpdateTicket = (ticketId: string, updates: Partial<MaintenanceTicket>) => {
    storage.updateMaintenanceTicket(ticketId, updates);
    showToast('Ticket updated successfully!');
    loadTickets();
    setSelectedTicket(null);
  };

  const handleAssignTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updates: Partial<MaintenanceTicket> = {
      status: assignmentForm.status,
      notes: assignmentForm.notes || undefined
    };

    if (assignmentForm.assignedTo) {
      updates.assignedTo = assignmentForm.assignedTo;
    //   if (assignmentForm.status === 'open') {
    //     updates.status = 'assigned';
    //   }
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

  const users = Object.values(storage.getUsers());
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress' || t.status === 'assigned').length;
  const completedTickets = tickets.filter(t => t.status === 'completed' || t.status === 'closed').length;

  return (
    <div className="section active">
      <div className="section-header">
        <h3>Maintenance Tickets</h3>
        <span className="badge">Admin Only</span>
      </div>

      {/* Quick Stats */}
      <div className="card-grid" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: '#e53e3e' }}>{openTickets}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Open</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: '#3182ce' }}>{inProgressTickets}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>In Progress</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: '#38a169' }}>{completedTickets}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Completed</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: '#d4af37' }}>{tickets.length}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Total</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label>Filter by Status:</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                style={{ marginLeft: '8px', padding: '5px' }}
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button 
              className="btn"
              onClick={loadTickets}
              style={{ marginLeft: 'auto', background: '#4a5568', color: 'white' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Form */}
      {selectedTicket && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h4>Manage Ticket: {selectedTicket.title}</h4>
            <button 
              onClick={() => setSelectedTicket(null)}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleAssignTicket}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label>Assign To</label>
                  <select
                    value={assignmentForm.assignedTo}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, assignedTo: e.target.value })}
                    style={{ width: '100%', padding: '8px' }}
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
                  <label>Status</label>
                  <select
                    value={assignmentForm.status}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, status: e.target.value as any })}
                    style={{ width: '100%', padding: '8px' }}
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
                <label>Notes</label>
                <textarea
                  value={assignmentForm.notes}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                  placeholder="Add notes or instructions..."
                  rows={3}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit"
                  className="btn"
                  style={{ background: '#3182ce', color: 'white' }}
                >
                  Update Ticket
                </button>
                <button 
                  type="button"
                  className="btn"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this ticket?')) {
                      storage.deleteMaintenanceTicket(selectedTicket.id);
                      showToast('Ticket deleted successfully!');
                      loadTickets();
                      setSelectedTicket(null);
                    }
                  }}
                  style={{ background: '#e53e3e', color: 'white' }}
                >
                  Delete Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="card">
        <div className="card-header">
          <h4>Maintenance Tickets</h4>
        </div>
        <div className="card-body">
          {filteredTickets.length === 0 ? (
            <p>No maintenance tickets found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ticket</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Floor</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Priority</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Reported By</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Assigned To</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Created</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(ticket => (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{ticket.title}</div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>{ticket.location}</div>
                          {ticket.description && (
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                              {ticket.description.length > 100 
                                ? `${ticket.description.substring(0, 100)}...` 
                                : ticket.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>{ticket.floor}</td>
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
                          <div style={{ fontWeight: 'bold' }}>{ticket.reportedBy}</div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>{ticket.reportedByEmail}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {ticket.assignedTo ? (
                          <span style={{ color: '#3182ce', fontWeight: 'bold' }}>
                            {users.find(u => u.email === ticket.assignedTo)?.name || ticket.assignedTo}
                          </span>
                        ) : (
                          <span style={{ color: '#a0aec0' }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.8rem', color: '#666' }}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button 
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setAssignmentForm({
                              assignedTo: ticket.assignedTo || '',
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
    </div>
  );
}