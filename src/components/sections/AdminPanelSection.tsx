
'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { User, MaintenanceTicket } from '@/types';

// Define the section color for admin panel - Coral theme
const SECTION_COLOR = '#E97451'; // Deep coral
const SECTION_COLOR_RGB = '233, 116, 81';

interface TestResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  date: string;
  testName: string;
}

interface UserProgress {
  user: User;
  sectionsCompleted: number;
  totalSections: number;
  progressPercentage: number;
  lastActive: string;
  timeSinceLastActive: string;
  completionStatus: 'excellent' | 'good' | 'poor' | 'inactive';
}

// List of users who should be hidden from other users in admin panel
const HIDDEN_USERS = [
  'riaz11@hotmail.com',
  'user2@decadesbar.com',
  'user3@decadesbar.com'
];

// Fixed progress breakdown function
const getFixedProgressBreakdown = (email: string) => {
  try {
    // Get user's visited sections from localStorage
    const visitedSections = JSON.parse(localStorage.getItem(`progress-${email}`) || '[]');
    const totalSections = 10; // Adjust this based on your actual total sections
    
    const sectionsCompleted = visitedSections.length;
    const progressPercentage = Math.round((sectionsCompleted / totalSections) * 100);
    
    return {
      completedSections: sectionsCompleted,
      totalSections: totalSections,
      percentage: progressPercentage,
      sectionsVisited: visitedSections
    };
  } catch (error) {
    console.error('Error getting progress breakdown:', error);
    return {
      completedSections: 0,
      totalSections: 10,
      percentage: 0,
      sectionsVisited: []
    };
  }
};

// Animated Card Component for Admin Panel
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = [
    'linear-gradient(45deg, #E97451, #ED8B6F, transparent)',
    'linear-gradient(45deg, #ED8B6F, #F2A28D, transparent)',
    'linear-gradient(45deg, #D45A3A, #E97451, transparent)',
    'linear-gradient(45deg, #BF4A2E, #E97451, transparent)'
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #ED8B6F, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(233, 116, 81, 0.1)' 
          : '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: isHovered ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: isHovered ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(160%)',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.18)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Colored Glow Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '18px',
          background: glowColor,
          zIndex: 0,
          opacity: 0.7,
          animation: 'pulse 2s infinite'
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.25), rgba(${SECTION_COLOR_RGB}, 0.1))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 600
          }}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '20px' }}>
          {children || (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>{description}</p>
              <ul style={{paddingLeft: '20px', marginBottom: '0', marginTop: '15px'}}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '15px 20px',
            background: 'rgba(237, 242, 247, 0.15)',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Maintenance Card Component with Enhanced Glow Effects
function MaintenanceCard({ title, description, tickets, status, priority, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  const maintenanceColors = [
    'linear-gradient(45deg, #E97451, transparent)',
    'linear-gradient(45deg, #ED8B6F, transparent)',
    'linear-gradient(45deg, #D45A3A, transparent)',
    'linear-gradient(45deg, #BF4A2E, transparent)'
  ];

  const maintenanceColor = maintenanceColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, transparent)`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#e53e3e';
      case 'in-progress': return '#d69e2e';
      case 'assigned': return '#d69e2e';
      case 'completed': return '#38a169';
      case 'closed': return '#718096';
      default: return '#718096';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#e53e3e';
      case 'high': return '#ed8936';
      case 'medium': return '#d69e2e';
      case 'low': return '#38a169';
      default: return '#718096';
    }
  };

  return (
    <div 
      style={{
        textAlign: 'left',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        backdropFilter: isHovered ? 'blur(15px)' : 'blur(8px)',
        WebkitBackdropFilter: isHovered ? 'blur(15px)' : 'blur(8px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Individual Maintenance Color Glow */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '14px',
          background: maintenanceColor,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h5 style={{
          color: isHovered ? SECTION_COLOR : 'white',
          marginBottom: '15px',
          fontSize: '1.1rem',
          fontWeight: 600,
          borderBottom: `1px solid ${isHovered ? `rgba(${SECTION_COLOR_RGB}, 0.6)` : `rgba(${SECTION_COLOR_RGB}, 0.3)`}`,
          paddingBottom: '8px',
          transition: 'all 0.3s ease',
          textShadow: isHovered ? `0 0 10px rgba(${SECTION_COLOR_RGB}, 0.3)` : 'none'
        }}>
          {title}
        </h5>
        
        {description && (
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '15px',
            lineHeight: 1.5
          }}>
            {description}
          </p>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            color: SECTION_COLOR,
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Status:
          </div>
          <span style={{ 
            padding: '4px 12px', 
            borderRadius: '12px', 
            fontSize: '0.8rem',
            fontWeight: 'bold',
            background: `${getStatusColor(status)}20`,
            color: getStatusColor(status),
            textTransform: 'capitalize'
          }}>
            {status.replace('-', ' ')}
          </span>
        </div>
        
        {priority && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{
              color: SECTION_COLOR,
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Priority:
            </div>
            <span style={{ 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '0.8rem',
              fontWeight: 'bold',
              background: `${getPriorityColor(priority)}20`,
              color: getPriorityColor(priority),
              textTransform: 'capitalize'
            }}>
              {priority}
            </span>
          </div>
        )}
        
        {tickets && (
          <div>
            <div style={{
              color: SECTION_COLOR,
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Tickets:
            </div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              margin: 0,
              fontSize: '0.9rem',
              lineHeight: 1.4
            }}>
              {tickets}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Maintenance Tickets Content Component with New Styling
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

  const handleUpdateStatus = (ticketId: string, newStatus: 'open' | 'in-progress' | 'assigned' | 'completed' | 'closed') => {
    storage.updateMaintenanceTicket(ticketId, { status: newStatus });
    showToast(`Ticket status updated to ${newStatus.replace('-', ' ')}`);
    loadTickets();
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
      case 'open': return '#e53e3e';
      case 'in-progress': return '#d69e2e';
      case 'assigned': return '#d69e2e';
      case 'completed': return '#38a169';
      case 'closed': return '#718096';
      default: return '#718096';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#e53e3e';
      case 'high': return '#ed8936';
      case 'medium': return '#d69e2e';
      case 'low': return '#38a169';
      default: return '#718096';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quick Stats */}
      <AnimatedCard
        title="📊 Maintenance Overview"
        index={0}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginTop: '10px'
        }}>
          <MaintenanceCard
            title="Open Tickets"
            tickets={openTickets}
            status="open"
            index={0}
          />
          <MaintenanceCard
            title="In Progress"
            tickets={inProgressTickets + assignedTickets}
            status="in-progress"
            index={1}
          />
          <MaintenanceCard
            title="Completed"
            tickets={completedTickets}
            status="completed"
            index={2}
          />
          <MaintenanceCard
            title="Closed"
            tickets={closedTickets}
            status="closed"
            index={3}
          />
        </div>
      </AnimatedCard>

      {/* Filters */}
      <AnimatedCard
        title="🔍 Filter Tickets"
        index={1}
      >
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
          <div>
            <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>Status:</label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              style={{ 
                marginLeft: '8px', 
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px rgba(${SECTION_COLOR_RGB}, 0.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </AnimatedCard>

      {/* Tickets List */}
      <AnimatedCard
        title="📋 Maintenance Tickets"
        description={`Showing ${filteredTickets.length} tickets matching your filters`}
        index={2}
      >
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {filteredTickets.map((ticket, index) => (
              <div 
                key={ticket.id}
                style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = `rgba(${SECTION_COLOR_RGB}, 0.4)`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
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
                          background: '#d69e2e',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(214, 158, 46, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Assign to Me
                      </button>
                    )}
                    {(ticket.status === 'assigned' || ticket.status === 'in-progress') && (
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, 'completed')}
                        style={{ 
                          background: '#38a169',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(56, 161, 105, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(113, 128, 150, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Close Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedCard>
    </div>
  );
}

export default function AdminPanelSection() {
  const { isAdmin, showToast, currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [testResults, setTestResults] = useState<{email: string, user: User, results: Record<string, TestResult>}[]>([]);
  const [blockEmail, setBlockEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'tests' | 'management' | 'maintenance' | 'events | tasks'>('overview');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isAdmin && currentUser) {
      loadAllData();
    }
  }, [isAdmin, currentUser]);

  const loadAllData = () => {
  // Fix: Convert Record<string, User> to User[]
  const usersRecord = storage.getUsers();
  const allUsers: User[] = Object.values(usersRecord);
  
  const filteredUsers = allUsers.filter(user => 
    !HIDDEN_USERS.includes(user.email) || user.email === currentUser?.email
  );
  setUsers(filteredUsers);

  // Load user progress using our fixed function
  const progressData: UserProgress[] = filteredUsers.map(user => {
    const progress = getFixedProgressBreakdown(user.email);
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

  // Load test results
  const testData = filteredUsers.map(user => {
    const results = user.testResults || {};
    return { email: user.email, user, results };
  });
  setTestResults(testData);
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
        // Fix: Update user status to 'blocked' instead of isBlocked
        usersRecord[blockEmail] = { 
          ...usersRecord[blockEmail], 
          status: 'blocked' as const 
        };
        storage.saveUsers(usersRecord);
        showToast(`User ${blockEmail} has been blocked`);
        setBlockEmail('');
        loadAllData();
      } else {
        showToast('User not found, error');
      }
    }
  };

  const handleUnblockUser = (email: string) => {
    const usersRecord = storage.getUsers();
    if (usersRecord[email]) {
      // Fix: Update user status to 'active' instead of removing isBlocked
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
          ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(233, 116, 81, 0.15)'
          : '0 16px 50px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        animation: 'fadeIn 0.5s ease'
      }}
      className="active"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Section Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
        padding: '20px',
        borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Admin Dashboard
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Management tools and employee oversight
          </p>
        </div>
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
          Admin Only
        </span>
        {HIDDEN_USERS.includes(currentUser?.email || '') && (
          <span style={{ 
            marginLeft: '10px', 
            fontSize: '0.8rem', 
            color: '#d69e2e',
            background: '#fefcbf',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            🔒 Hidden User Mode
          </span>
        )}
      </div>

      <div style={{ padding: '25px' }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'progress', label: '📈 Progress' },
            { id: 'tests', label: '🎯 Tests' },
            { id: 'management', label: '👥 Management' },
            { id: 'maintenance', label: '🔧 Maintenance' }
          ].map(tab => (
            <button
              key={tab.id}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? SECTION_COLOR : 'transparent'}`,
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
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
                  e.currentTarget.style.background = 'none';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <AnimatedCard title="📊 Quick Stats" index={0}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '15px',
                marginTop: '10px'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <h4 style={{ margin: 0, color: SECTION_COLOR, fontSize: '1.8rem' }}>{users.length}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Total Users</p>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <h4 style={{ margin: 0, color: '#38a169', fontSize: '1.8rem' }}>
                    {userProgress.filter(u => u.progressPercentage >= 90).length}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Excellent Progress</p>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <h4 style={{ margin: 0, color: '#d69e2e', fontSize: '1.8rem' }}>{blockedUsers.length}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>Blocked Users</p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard title="📈 Progress Overview" index={1}>
              <div style={{ marginTop: '15px' }}>
                {userProgress.slice(0, 5).map((progress, index) => (
                  <div key={progress.user.email} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < 4 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                  }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: 600 }}>{progress.user.name}</div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        {progress.sectionsCompleted}/{progress.totalSections} sections
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: 
                        progress.completionStatus === 'excellent' ? 'rgba(56, 161, 105, 0.2)' :
                        progress.completionStatus === 'good' ? 'rgba(214, 158, 46, 0.2)' :
                        progress.completionStatus === 'poor' ? 'rgba(229, 62, 62, 0.2)' :
                        'rgba(113, 128, 150, 0.2)',
                      color: 
                        progress.completionStatus === 'excellent' ? '#38a169' :
                        progress.completionStatus === 'good' ? '#d69e2e' :
                        progress.completionStatus === 'poor' ? '#e53e3e' :
                        '#718096'
                    }}>
                      {progress.progressPercentage}%
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>

            <AnimatedCard title="⚡ Quick Actions" index={2}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                <button 
                  onClick={loadAllData}
                  style={{
                    background: SECTION_COLOR,
                    color: 'white',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 20px rgba(${SECTION_COLOR_RGB}, 0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🔄 Refresh Data
                </button>
                <button 
                  onClick={() => setActiveTab('management')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  👥 User Management
                </button>
                <button 
                  onClick={() => setActiveTab('maintenance')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔧 Maintenance
                </button>
              </div>
            </AnimatedCard>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <AnimatedCard
            title="📈 Employee Progress Tracking"
            description="Monitor employee training progress and completion rates"
            index={0}
          >
            <div style={{ marginTop: '15px' }}>
              {userProgress.map((progress, index) => (
                <div 
                  key={progress.user.email}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '15px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = `rgba(${SECTION_COLOR_RGB}, 0.4)`;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
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
                          progress.completionStatus === 'excellent' ? 'rgba(56, 161, 105, 0.2)' :
                          progress.completionStatus === 'good' ? 'rgba(214, 158, 46, 0.2)' :
                          progress.completionStatus === 'poor' ? 'rgba(229, 62, 62, 0.2)' :
                          'rgba(113, 128, 150, 0.2)',
                        color: 
                          progress.completionStatus === 'excellent' ? '#38a169' :
                          progress.completionStatus === 'good' ? '#d69e2e' :
                          progress.completionStatus === 'poor' ? '#e53e3e' :
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
                          progress.completionStatus === 'excellent' ? '#38a169' :
                          progress.completionStatus === 'good' ? '#d69e2e' :
                          progress.completionStatus === 'poor' ? '#e53e3e' :
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
          </AnimatedCard>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <AnimatedCard
            title="🎯 Test Results & Performance"
            description="View employee test scores and assessment performance"
            index={0}
          >
            <div style={{ marginTop: '15px' }}>
              {testResults.map((userResult, userIndex) => (
                <div 
                  key={userResult.email}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    marginBottom: '15px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = `rgba(${SECTION_COLOR_RGB}, 0.4)`;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
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
                            background: 'rgba(255, 255, 255, 0.06)',
                            borderRadius: '8px',
                            border: `1px solid ${result.passed ? 'rgba(56, 161, 105, 0.3)' : 'rgba(229, 62, 62, 0.3)'}`
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
                              background: result.passed ? 'rgba(56, 161, 105, 0.2)' : 'rgba(229, 62, 62, 0.2)',
                              color: result.passed ? '#38a169' : '#e53e3e'
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
          </AnimatedCard>
        )}

        {/* Management Tab */}
        {activeTab === 'management' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AnimatedCard
              title="👥 User Management"
              description="Manage user accounts and access permissions"
              index={0}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginTop: '15px' }}>
                <input
                  type="email"
                  placeholder="Enter email to block"
                  value={blockEmail}
                  onChange={(e) => setBlockEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '10px 15px',
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
                    background: blockEmail && blockEmail !== currentUser?.email ? '#e53e3e' : 'rgba(229, 62, 62, 0.5)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: blockEmail && blockEmail !== currentUser?.email ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (blockEmail && blockEmail !== currentUser?.email) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 62, 62, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (blockEmail && blockEmail !== currentUser?.email) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  🚫 Block User
                </button>
              </div>
            </AnimatedCard>

            <AnimatedCard
              title="🚫 Blocked Users"
              description={`${blockedUsers.length} users currently blocked from access`}
              index={1}
            >
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                  {blockedUsers.map((user, index) => (
                    <div 
                      key={user.email}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(229, 62, 62, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
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
                          background: '#38a169',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(56, 161, 105, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AnimatedCard>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && <MaintenanceTicketsContent />}
      </div>
    </div>
  );
}
