'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { User, TestResult } from '@/types';

// Define the type for admin test results
interface AdminTestResult extends TestResult {
  userName: string;
  userEmail: string;
  testId: string;
}

export default function AdminPanelSection() {
  const { currentUser, isAdmin } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [testResults, setTestResults] = useState<AdminTestResult[]>([]);
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

    // Aggregate test results
    const results: AdminTestResult[] = [];
    userList.forEach(user => {
      if (user.testResults) {
        Object.entries(user.testResults).forEach(([testId, result]) => {
          results.push({
            userName: user.name,
            userEmail: user.email,
            testId,
            ...result
          });
        });
      }
    });
    setTestResults(results);
  };

  const toggleUserBlock = (email: string) => {
    const usersData = storage.getUsers();
    if (usersData[email]) {
      usersData[email].status = usersData[email].status === 'blocked' ? 'active' : 'blocked';
      storage.saveUsers(usersData);
      loadAdminData();
    }
  };

  const handleToggleBlock = () => {
    if (blockEmail) {
      const user = users.find(u => u.email === blockEmail);
      if (user) {
        toggleUserBlock(blockEmail);
        setBlockEmail('');
      } else {
        alert('User not found');
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="section" id="admin-panel">
        <div className="section-header">
          <h3>Admin Dashboard</h3>
          <span className="badge">Admin Only</span>
        </div>
        <p>Access denied. Administrator privileges required.</p>
      </div>
    );
  }

  return (
    <div className="section" id="admin-panel">
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
            <div id="admin-stats">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>Total Users:</strong> {users.length}</div>
                <div><strong>Active:</strong> {users.filter(u => u.status !== 'blocked').length}</div>
                <div><strong>Blocked:</strong> {users.filter(u => u.status === 'blocked').length}</div>
                <div><strong>Completed Training:</strong> {users.filter(u => u.progress >= 100).length}</div>
                <div><strong>Submitted Acknowledgements:</strong> {users.filter(u => u.acknowledged).length}</div>
                <div><strong>Completion Rate:</strong> {users.length ? Math.round((users.filter(u => u.progress >= 100).length / users.length) * 100) : 0}%</div>
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
              <button className="btn" onClick={handleToggleBlock} style={{ width: '100%' }}>
                Toggle Block Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Test Results */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h4>📊 Employee Test Results</h4>
        </div>
        <div className="card-body">
          <div id="admin-test-results">
            {testResults.length > 0 ? (
              <table className="test-results-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Test</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result, index) => (
                    <tr key={index}>
                      <td>{result.userName}</td>
                      <td>{result.testName || result.testId}</td>
                      <td>{result.score}/{result.total} ({result.percentage}%)</td>
                      <td>
                        <span className={result.passed ? 'test-pass-badge' : 'test-fail-badge'}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td>{new Date(result.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No test results available.</p>
            )}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h4>👥 Employee Management</h4>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '15px' }}>
            <button className="btn" onClick={loadAdminData}>
              <i className="fas fa-sync-alt"></i> Refresh Data
            </button>
          </div>
          <div id="admin-user-list">
            {users.length > 0 ? (
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
                          <td style={{ padding: '12px' }}>
                            {user.status === 'blocked' ? 
                              <span style={{ color: 'red' }}>🔒 Blocked</span> : 
                              <span style={{ color: 'green' }}>✅ Active</span>
                            }
                          </td>
                          <td style={{ padding: '12px' }}>
                            <button 
                              onClick={() => toggleUserBlock(user.email)}
                              style={{ 
                                background: user.status === 'blocked' ? '#38a169' : '#e53e3e', 
                                color: 'white', 
                                border: 'none', 
                                padding: '5px 10px', 
                                borderRadius: '3px', 
                                cursor: 'pointer', 
                                fontSize: '0.8rem' 
                              }}
                            >
                              {user.status === 'blocked' ? 'Unblock' : 'Block'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}