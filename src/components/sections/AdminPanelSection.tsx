'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { User } from '@/types';

interface TestResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  date: string;
  testName: string;
}

export default function AdminPanelSection() {
  const { isAdmin, showToast } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [testResults, setTestResults] = useState<{email: string, user: User, results: Record<string, TestResult>}[]>([]);
  const [blockEmail, setBlockEmail] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = () => {
    const usersData = storage.getUsers();
    const userList = Object.values(usersData);
    setUsers(userList);

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
      loadAdminData(); // Refresh the data
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

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status !== 'blocked').length;
  const blockedUsers = users.filter(u => u.status === 'blocked').length;
  const completedTraining = users.filter(u => u.progress >= 100).length;
  const acknowledgedCount = users.filter(u => u.acknowledged).length;

  return (
    <div className="section active">
      <div className="section-header">
        <h3>Admin Dashboard</h3>
        <span className="badge">Admin Only</span>
      </div>

      {/* Quick Stats */}
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>📊 Quick Stats</h4>
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
              <i className="fas fa-sync-alt"></i> Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Employee Test Results */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h4>📊 Employee Test Results</h4>
        </div>
        <div className="card-body">
          {testResults.length === 0 ? (
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
                  {testResults.flatMap(({ email, user, results }) =>
                    Object.entries(results).map(([testId, result]) => {
                      const date = new Date(result.date);
                      const formattedDate = date.toLocaleDateString();

                      return (
                        <tr key={`${email}-${testId}`}>
                          <td>{user.name}</td>
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

      {/* User Management */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h4>👥 Employee Management</h4>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
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
                  {users.map((user) => {
                    const progressColor = user.progress >= 100 ? 'green' :
                      user.progress >= 50 ? 'orange' : 'red';

                    const status = user.status === 'blocked' ?
                      <span style={{ color: 'red' }}>🔒 Blocked</span> :
                      <span style={{ color: 'green' }}>✅ Active</span>;

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
                        <td style={{ padding: '12px' }}>{user.name}</td>
                        <td style={{ padding: '12px' }}>{user.email}</td>
                        <td style={{ padding: '12px' }}>{user.position}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '60px', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                              <div style={{ width: `${user.progress || 0}%`, height: '100%', background: progressColor, borderRadius: '4px' }}></div>
                            </div>
                            <span>{user.progress || 0}%</span>
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
    </div>
  );
}
