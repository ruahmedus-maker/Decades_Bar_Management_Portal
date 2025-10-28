'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { User, MaintenanceTicket, Task } from '@/types';
import SpecialEventsSection from './SpecialEventsSection';
import TasksSection from './TasksSection';

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

// Enhanced progress tracking
const getEnhancedProgressBreakdown = (email: string) => {
  try {
    const visitedSections = JSON.parse(localStorage.getItem(`progress-${email}`) || '[]');
    const totalSections = 10;
    
    const sectionsCompleted = visitedSections.length;
    const progressPercentage = Math.round((sectionsCompleted / totalSections) * 100);
    
    const lastActivity = localStorage.getItem(`last-activity-${email}`);
    const isActiveRecently = lastActivity ? 
      (Date.now() - new Date(lastActivity).getTime()) < (24 * 60 * 60 * 1000) : false;
    
    return {
      completedSections: sectionsCompleted,
      totalSections: totalSections,
      percentage: progressPercentage,
      sectionsVisited: visitedSections,
      isActive: isActiveRecently,
      lastActivity: lastActivity
    };
  } catch (error) {
    console.error('Error getting progress breakdown:', error);
    return {
      completedSections: 0,
      totalSections: 10,
      percentage: 0,
      sectionsVisited: [],
      isActive: false,
      lastActivity: null
    };
  }
};

// Enhanced Card Component
function AdminCard({ title, value, change, icon, color, onClick }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid rgba(255, 255, 255, 0.15)`,
        backdropFilter: 'blur(10px)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 10px 30px rgba(${color}, 0.3)` : 'none',
        borderLeft: `4px solid ${color}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
    eventId: ''
  });

  // Get only bartenders and trainees for task assignment
  const users = Object.values(storage.getUsers()).filter(user => 
    (user.position === 'Bartender' || user.position === 'Trainee') &&
    (!HIDDEN_USERS.includes(user.email) || user.email === currentUser?.email)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    const taskData = {
      id: `task-${Date.now()}`,
      title: taskForm.title,
      description: taskForm.description,
      assignedTo: taskForm.assignedTo,
      dueDate: taskForm.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: taskForm.priority,
      eventId: taskForm.eventId || undefined
    };

    const existingTasks = JSON.parse(localStorage.getItem('decadesTasks') || '[]');
    const updatedTasks = [...existingTasks, taskData];
    localStorage.setItem('decadesTasks', JSON.stringify(updatedTasks));

    showToast('Task created successfully!');
    onTaskCreated();
    onClose();
    
    setTaskForm({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium',
      eventId: ''
    });
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
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        border: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
        backdropFilter: 'blur(20px)',
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
                backdropFilter: 'blur(10px)'
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
                backdropFilter: 'blur(10px)',
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
                  backdropFilter: 'blur(10px)'
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
                  backdropFilter: 'blur(10px)'
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
                backdropFilter: 'blur(10px)'
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
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                background: SECTION_COLOR,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Create Task
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
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'assigned' | 'completed'>('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const allTickets = storage.getMaintenanceTickets();
    setTickets(allTickets);
  };

  const handleUpdateStatus = (ticketId: string, newStatus: MaintenanceTicket['status']) => {
    storage.updateMaintenanceTicket(ticketId, { status: newStatus });
    showToast(`Ticket status updated to ${newStatus.replace('-', ' ')}`);
    loadTickets();
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance ticket?')) {
      storage.deleteMaintenanceTicket(ticketId);
      showToast('Maintenance ticket deleted successfully!');
      loadTickets();
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

      {/* Filters */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)'
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
                backdropFilter: 'blur(10px)',
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
          <button 
            onClick={loadTickets}
            style={{ 
              marginLeft: 'auto', 
              background: SECTION_COLOR,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)'
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
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  e.currentTarget.style.borderColor = `rgba(${SECTION_COLOR_RGB}, 0.4)`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
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
                    <div><strong>Reported by:</strong> {ticket.reportedBy}</div>
                    <div><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</div>
                    {ticket.assignedTo && (
                      <div><strong>Assigned to:</strong> {ticket.assignedTo}</div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {ticket.status === 'open' && (
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, 'assigned')}
                        style={{ 
                          background: WARNING_COLOR,
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
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
                          transition: 'all 0.3s ease'
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
                          transition: 'all 0.3s ease'
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
                        transition: 'all 0.3s ease'
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

export default function AdminPanelSection() {
  const { isAdmin, showToast, currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [testResults, setTestResults] = useState<{email: string, user: User, results: Record<string, TestResult>}[]>([]);
  const [blockEmail, setBlockEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'tests' | 'management' | 'maintenance' | 'events' | 'tasks'>('overview');
  const [isHovered, setIsHovered] = useState(false);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingTickets: 0,
    completedTasks: 0,
    totalTasks: 0,
    excellentProgress: 0
  });
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    if (isAdmin && currentUser) {
      loadAllData();
    }
  }, [isAdmin, currentUser]);

  const loadAllData = () => {
    // Load users with corrected hidden user logic
    const usersRecord = storage.getUsers();
    const allUsers: User[] = Object.values(usersRecord);
    
    // Fixed hidden user logic: only show hidden users to other hidden users
    const filteredUsers = allUsers.filter(user => {
      // Always show the current user
      if (user.email === currentUser?.email) return true;
      
      // If current user is hidden, show all users (including other hidden users)
      if (currentUser && HIDDEN_USERS.includes(currentUser.email)) {
        return true;
      }
      
      // If current user is not hidden, filter out hidden users
      return !HIDDEN_USERS.includes(user.email);
    });
    
    // Filter to only show bartenders and trainees (not admins) in progress/management
    const bartendersAndTrainees = filteredUsers.filter(user => 
      user.position === 'Bartender' || user.position === 'Trainee'
    );
    
    setUsers(bartendersAndTrainees);

    // Load user progress - only for bartenders and trainees
    const progressData: UserProgress[] = bartendersAndTrainees.map(user => {
      const progress = getEnhancedProgressBreakdown(user.email);
      return {
        user,
        sectionsCompleted: progress.completedSections,
        totalSections: progress.totalSections,
        progressPercentage: progress.percentage,
        lastActive: user.lastActive || 'Never',
        timeSinceLastActive: getTimeSince(user.lastActive),
        completionStatus: getCompletionStatus(progress.percentage)
      };
    });
    setUserProgress(progressData);

    // Load test results - only for bartenders and trainees
    const testData = bartendersAndTrainees.map(user => {
      const results = user.testResults || {};
      return { email: user.email, user, results };
    });
    setTestResults(testData);

    // Load quick stats
    const maintenanceTickets = storage.getMaintenanceTickets();
    const tasks = JSON.parse(localStorage.getItem('decadesTasks') || '[]');
    
    setQuickStats({
      totalUsers: bartendersAndTrainees.length,
      activeUsers: progressData.filter(p => p.completionStatus !== 'inactive').length,
      pendingTickets: maintenanceTickets.filter(t => t.status === 'open' || t.status === 'assigned').length,
      completedTasks: tasks.filter((t: Task) => t.completed).length,
      totalTasks: tasks.length,
      excellentProgress: progressData.filter(p => p.progressPercentage >= 90).length
    });
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

  const handleBlockUser = () => {
    if (blockEmail && blockEmail !== currentUser?.email) {
      const usersRecord = storage.getUsers();
      if (usersRecord[blockEmail]) {
        usersRecord[blockEmail] = { 
          ...usersRecord[blockEmail], 
          status: 'blocked' as const 
        };
        storage.saveUsers(usersRecord);
        showToast(`User ${blockEmail} has been blocked`);
        setBlockEmail('');
        loadAllData();
      } else {
        showToast('User not found');
      }
    }
  };

  const handleUnblockUser = (email: string) => {
    const usersRecord = storage.getUsers();
    if (usersRecord[email]) {
      usersRecord[email] = { 
        ...usersRecord[email], 
        status: 'active' as const 
      };
      storage.saveUsers(usersRecord);
      showToast(`User ${email} has been unblocked`);
      loadAllData();
    }
  };

  const blockedUsers = users.filter(user => user.status === 'blocked');

  return (
    <div 
      id="admin-panel"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        WebkitBackdropFilter: 'blur(15px) saturate(170%)',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isHovered 
          ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(37, 99, 235, 0.15)'
          : '0 16px 50px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)'
      }}
      className="active"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Section Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
        padding: '25px',
        borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
        backdropFilter: 'blur(10px)',
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
            backdropFilter: 'blur(10px)',
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
        {/* Tab Navigation - Fixed double icons */}
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
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem'
              }}
              onClick={() => setActiveTab(tab.id as any)}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
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
                change={5}
                icon="👥"
                color={SECTION_COLOR_RGB}
                onClick={() => setActiveTab('management')}
              />
              <AdminCard 
                title="Active Users"
                value={quickStats.activeUsers}
                change={3}
                icon="🟢"
                color="16, 185, 129"
                onClick={() => setActiveTab('progress')}
              />
              <AdminCard 
                title="Pending Tickets"
                value={quickStats.pendingTickets}
                change={-2}
                icon="🔧"
                color="239, 68, 68"
                onClick={() => setActiveTab('maintenance')}
              />
              <AdminCard 
                title="Tasks Completed"
                value={`${quickStats.completedTasks}/${quickStats.totalTasks}`}
                change={8}
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
              backdropFilter: 'blur(10px)'
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
                    transition: 'all 0.3s ease',
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
                    transition: 'all 0.3s ease',
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
                    transition: 'all 0.3s ease',
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
                    transition: 'all 0.3s ease',
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
              backdropFilter: 'blur(10px)'
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
                        transition: 'all 0.3s ease'
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

        {/* Progress Tab - Only shows bartenders/trainees */}
        {activeTab === 'progress' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
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
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {userProgress.map((progress, index) => (
                <div 
                  key={progress.user.email}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
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
                        transition: 'width 0.5s ease'
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
          </div>
        )}

        {/* Tests Tab - Only shows bartenders/trainees */}
        {activeTab === 'tests' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
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
                    transition: 'all 0.3s ease'
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

        {/* Management Tab - Only shows bartenders/trainees */}
        {activeTab === 'management' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h4 style={{ 
                color: 'white', 
                margin: '0 0 20px 0',
                fontSize: '1.2rem'
              }}>
                👥 User Management
              </h4>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="Enter email to block"
                  value={blockEmail}
                  onChange={(e) => setBlockEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px 15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <button 
                  onClick={handleBlockUser}
                  disabled={!blockEmail || blockEmail === currentUser?.email}
                  style={{
                    background: blockEmail && blockEmail !== currentUser?.email ? DANGER_COLOR : 'rgba(239, 68, 68, 0.5)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: blockEmail && blockEmail !== currentUser?.email ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🚫 Block User
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h4 style={{ 
                color: 'white', 
                margin: '0 0 20px 0',
                fontSize: '1.2rem'
              }}>
                🚫 Blocked Users ({blockedUsers.length})
              </h4>
              {blockedUsers.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontStyle: 'italic'
                }}>
                  No users are currently blocked.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {blockedUsers.map((user, index) => (
                    <div 
                      key={user.email}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>{user.name}</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                          {user.email} • {user.position}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUnblockUser(user.email)}
                        style={{
                          background: SUCCESS_COLOR,
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Maintenance Tab - Now shows actual maintenance tickets */}
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
            backdropFilter: 'blur(10px)'
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
            backdropFilter: 'blur(10px)'
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