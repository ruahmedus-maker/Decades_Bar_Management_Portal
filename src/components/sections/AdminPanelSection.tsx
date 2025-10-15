'use client';
import SpecialEventsSection from './SpecialEventsSection';
import TasksSection from './TasksSection';
import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { getProgressBreakdown } from '@/lib/progress';
import { User } from '@/types';

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
  'riaz11@hotmail.com', // Replace with your actual email
  'user2@decadesbar.com',      // Replace with second hidden user email
  'user3@decadesbar.com'       // Replace with third hidden user email
];

export default function AdminPanelSection() {
  const { isAdmin, showToast, currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [testResults, setTestResults] = useState<{email: string, user: User, results: Record<string, TestResult>}[]>([]);
  const [blockEmail, setBlockEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'tests' | 'management' | 'special-events' | 'tasks'>('overview');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = () => {
    const usersData = storage.getUsers();
    let userList = Object.values(usersData);

    // Filter out hidden users if current user is not a hidden user
    if (currentUser && !HIDDEN_USERS.includes(currentUser.email)) {
      userList = userList.filter(user => !HIDDEN_USERS.includes(user.email));
    }

    setUsers(userList);

    // Calculate user progress using getProgressBreakdown
    const progressData = userList.map(user => {
      const breakdown = getProgressBreakdown(user);
      
      const lastActive = new Date(user.lastActive);
      const now = new Date();
      const daysSinceActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      
      let completionStatus: UserProgress['completionStatus'] = 'poor';
      if (breakdown.progress === 100 && user.acknowledged) completionStatus = 'excellent';
      else if (breakdown.progress >= 70) completionStatus = 'good';
      else if (daysSinceActive > 7) completionStatus = 'inactive';
      else completionStatus = 'poor';

      return {
        user,
        sectionsCompleted: breakdown.sectionsVisited,
        totalSections: breakdown.totalSections,
        progressPercentage: breakdown.progress,
        lastActive: user.lastActive,
        timeSinceLastActive: daysSinceActive === 0 ? 'Today' : `${daysSinceActive} day${daysSinceActive === 1 ? '' : 's'} ago`,
        completionStatus
      };
    });

    setUserProgress(progressData);

    // Compile test results
    const results = userList
      .filter(user => user.testResults && Object.keys(user.testResults).length > 0)
      .map(user => ({
        email: user.email,
        user: user,
        results: user.testResults || {}
      }));
    setTestResults(results);
  };

  const toggleUserBlock = (email: string) => {
    const usersData = storage.getUsers();
    const user = usersData[email];
    
    if (user) {
      if (user.status === 'blocked') {
        user.status = 'active';
        showToast(`User ${email} has been unblocked.`);
      } else {
        user.status = 'blocked';
        showToast(`User ${email} has been blocked.`);
      }
      
      storage.saveUsers(usersData);
      loadAdminData();
    }
  };

  const handleQuickBlock = () => {
    if (!blockEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    const usersData = storage.getUsers();
    if (!usersData[blockEmail]) {
      alert('User not found.');
      return;
    }

    toggleUserBlock(blockEmail);
    setBlockEmail('');
  };

  const getCompletionColor = (status: UserProgress['completionStatus']) => {
    switch (status) {
      case 'excellent': return '#38a169';
      case 'good': return '#d69e2e';
      case 'poor': return '#e53e3e';
      case 'inactive': return '#718096';
      default: return '#e53e3e';
    }
  };

  const getCompletionText = (status: UserProgress['completionStatus']) => {
    switch (status) {
      case 'excellent': return 'Completed';
      case 'good': return 'Good Progress';
      case 'poor': return 'Needs Attention';
      case 'inactive': return 'Inactive';
      default: return 'Needs Attention';
    }
  };

  if (!isAdmin) {
    return (
      <div className="section active">
        <div className="section-header">
          <h3>Admin Dashboard</h3>
          <span className="badge">Admin Only</span>
        </div>
        <div className="card">
          <div className="card-body">
            <p>Admin access required to view this section.</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter users based on hidden users list
  const visibleUsers = currentUser && HIDDEN_USERS.includes(currentUser.email) 
    ? users 
    : users.filter(user => !HIDDEN_USERS.includes(user.email));

  const visibleUserProgress = currentUser && HIDDEN_USERS.includes(currentUser.email)
    ? userProgress
    : userProgress.filter(progress => !HIDDEN_USERS.includes(progress.user.email));

  const visibleTestResults = currentUser && HIDDEN_USERS.includes(currentUser.email)
    ? testResults
    : testResults.filter(result => !HIDDEN_USERS.includes(result.user.email));

  const totalUsers = visibleUsers.length;
  const activeUsers = visibleUsers.filter(u => u.status !== 'blocked').length;
  const blockedUsers = visibleUsers.filter(u => u.status === 'blocked').length;
  const completedTraining = visibleUserProgress.filter(u => u.completionStatus === 'excellent').length;
  const acknowledgedCount = visibleUsers.filter(u => u.acknowledged).length;
  const excellentProgress = visibleUserProgress.filter(u => u.completionStatus === 'excellent').length;
  const goodProgress = visibleUserProgress.filter(u => u.completionStatus === 'good').length;
  const poorProgress = visibleUserProgress.filter(u => u.completionStatus === 'poor').length;
  const inactiveUsers = visibleUserProgress.filter(u => u.completionStatus === 'inactive').length;

  return (
    <div className="section active">
      <div className="section-header">
        <h3>Admin Dashboard</h3>
        <span className="badge">Admin Only</span>
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

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #d4af37' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'overview' ? 'bold' : 'normal'
          }}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'progress' ? '2px solid #d4af37' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'progress' ? 'bold' : 'normal'
          }}
        >
          📈 Progress Tracking
        </button>
        <button
          className={`tab-button ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'tests' ? '2px solid #d4af37' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'tests' ? 'bold' : 'normal'
          }}
        >
          🧪 Test Results
        </button>
        <button
          className={`tab-button ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => setActiveTab('management')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'management' ? '2px solid #d4af37' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'management' ? 'bold' : 'normal'
          }}
        >
          👥 User Management
        </button>
        <button
          className={`tab-button ${activeTab === 'special-events' ? 'active' : ''}`}
          onClick={() => setActiveTab('special-events')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'special-events' ? '2px solid #d4af37' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'special-events' ? 'bold' : 'normal'
          }}
        >
          🎉 Special Events
        </button>
        <button
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'tasks' ? '2px solid #d4af37' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'tasks' ? 'bold' : 'normal'
          }}
        >
          ✅ Tasks
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="card-grid">
          <div className="card">
            <div className="card-header">
              <h4>📊 Quick Stats</h4>
              {HIDDEN_USERS.includes(currentUser?.email || '') && (
                <span style={{ fontSize: '0.7rem', color: '#d69e2e' }}>Hidden users excluded</span>
              )}
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>Total Users:</strong> {totalUsers}</div>
                <div><strong>Active:</strong> {activeUsers}</div>
                <div><strong>Blocked:</strong> {blockedUsers}</div>
                <div><strong>Completed Training:</strong> {completedTraining}</div>
                <div><strong>Submitted Acknowledgements:</strong> {acknowledgedCount}</div>
                <div><strong>Completion Rate:</strong> {totalUsers ? Math.round((completedTraining / totalUsers) * 100) : 0}%</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>📈 Progress Overview</h4>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>✅ Completed:</span>
                  <strong style={{ color: '#38a169' }}>{excellentProgress}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📖 Good Progress:</span>
                  <strong style={{ color: '#d69e2e' }}>{goodProgress}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>⚠️ Needs Attention:</span>
                  <strong style={{ color: '#e53e3e' }}>{poorProgress}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>💤 Inactive:</span>
                  <strong style={{ color: '#718096' }}>{inactiveUsers}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>⚡ Quick Actions</h4>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Block/Unblock User</label>
                <input 
                  type="email" 
                  value={blockEmail}
                  onChange={(e) => setBlockEmail(e.target.value)}
                  placeholder="user@decadesbar.com"
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <button 
                  className="btn" 
                  onClick={handleQuickBlock}
                  style={{ width: '100%' }}
                >
                  Toggle Block Status
                </button>
              </div>
              <button className="btn" onClick={loadAdminData} style={{ width: '100%', marginTop: '10px' }}>
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tracking Tab */}
      {activeTab === 'progress' && (
        <div className="card">
          <div className="card-header">
            <h4>📈 Detailed Progress Tracking</h4>
            {HIDDEN_USERS.includes(currentUser?.email || '') && (
              <span style={{ fontSize: '0.7rem', color: '#d69e2e' }}>Hidden users excluded</span>
            )}
          </div>
          <div className="card-body">
            {visibleUserProgress.length === 0 ? (
              <p>No user progress data available.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Employee</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Position</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Progress</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Sections</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Last Active</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Acknowledged</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUserProgress.map(({ user, sectionsCompleted, totalSections, progressPercentage, timeSinceLastActive, completionStatus }) => {
                      const progressColor = getCompletionColor(completionStatus);
                      
                      return (
                        <tr key={user.email} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px' }}>
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.email}</div>
                              {HIDDEN_USERS.includes(user.email) && (
                                <span style={{ fontSize: '0.7rem', color: '#d69e2e' }}>🔒 Hidden</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>{user.position}</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '80px', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                                <div style={{ 
                                  width: `${progressPercentage}%`, 
                                  height: '100%', 
                                  background: progressColor, 
                                  borderRadius: '4px' 
                                }}></div>
                              </div>
                              <span>{progressPercentage}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '12px', 
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              background: `${progressColor}20`,
                              color: progressColor
                            }}>
                              {getCompletionText(completionStatus)}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {sectionsCompleted}/{totalSections}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.8rem', color: '#666' }}>
                            {timeSinceLastActive}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {user.acknowledged ? (
                              <span style={{ color: '#38a169', fontWeight: 'bold' }}>✓ Yes</span>
                            ) : (
                              <span style={{ color: '#e53e3e' }}>No</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test Results Tab */}
      {activeTab === 'tests' && (
        <div className="card">
          <div className="card-header">
            <h4>🧪 Employee Test Results</h4>
            {HIDDEN_USERS.includes(currentUser?.email || '') && (
              <span style={{ fontSize: '0.7rem', color: '#d69e2e' }}>Hidden users excluded</span>
            )}
          </div>
          <div className="card-body">
            {visibleTestResults.length === 0 ? (
              <p>No test results available.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="test-results-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Position</th>
                      <th>Test</th>
                      <th>Score</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTestResults.flatMap(({ email, user, results }) =>
                      Object.entries(results).map(([testId, result]) => {
                        const date = new Date(result.date);
                        const formattedDate = date.toLocaleDateString();

                        return (
                          <tr key={`${email}-${testId}`}>
                            <td>
                              {user.name}
                              {HIDDEN_USERS.includes(user.email) && (
                                <span style={{ fontSize: '0.7rem', color: '#d69e2e', marginLeft: '5px' }}>🔒</span>
                              )}
                            </td>
                            <td>{user.position}</td>
                            <td>{result.testName || testId}</td>
                            <td>{result.score}/{result.total} ({result.percentage}%)</td>
                            <td>
                              <span className={result.passed ? 'test-pass-badge' : 'test-fail-badge'}>
                                {result.passed ? 'Passed' : 'Failed'}
                              </span>
                            </td>
                            <td>{formattedDate}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'management' && (
        <div className="card">
          <div className="card-header">
            <h4>👥 Employee Management</h4>
            {HIDDEN_USERS.includes(currentUser?.email || '') && (
              <span style={{ fontSize: '0.7rem', color: '#d69e2e' }}>Hidden users excluded</span>
            )}
          </div>
          <div className="card-body">
            {visibleUsers.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Position</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Progress</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUsers.map((user) => {
                      // Find the user's progress data
                      const userProgressData = visibleUserProgress.find(up => up.user.email === user.email);
                      const progressPercentage = userProgressData?.progressPercentage || 0;
                      
                      const progressColor = progressPercentage >= 100 ? '#38a169' :
                        progressPercentage >= 50 ? '#d69e2e' : '#e53e3e';

                      const status = user.status === 'blocked' ?
                        <span style={{ color: '#e53e3e' }}>🔒 Blocked</span> :
                        <span style={{ color: '#38a169' }}>✅ Active</span>;

                      const actionButton = user.status === 'blocked' ?
                        <button 
                          onClick={() => toggleUserBlock(user.email)}
                          style={{ background: '#38a169', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Unblock
                        </button> :
                        <button 
                          onClick={() => toggleUserBlock(user.email)}
                          style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Block
                        </button>;

                      return (
                        <tr key={user.email} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px' }}>
                            {user.name}
                            {HIDDEN_USERS.includes(user.email) && (
                              <span style={{ fontSize: '0.7rem', color: '#d69e2e', marginLeft: '5px' }}>🔒 Hidden</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>{user.email}</td>
                          <td style={{ padding: '12px' }}>{user.position}</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '60px', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                                <div style={{ width: `${progressPercentage}%`, height: '100%', background: progressColor, borderRadius: '4px' }}></div>
                              </div>
                              <span>{progressPercentage}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>{status}</td>
                          <td style={{ padding: '12px' }}>{actionButton}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Special Events Tab */}
      {/* Special Events Tab */}
{activeTab === 'special-events' && <SpecialEventsSection isAdminView={true} />}
      {/* Tasks Tab */}
      {activeTab === 'tasks' && <TasksSection />}
    </div>
  );
}