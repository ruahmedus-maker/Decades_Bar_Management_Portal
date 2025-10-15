'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { CounselingRecord, EmployeeFolder } from '@/types';

export default function EmployeeCounselingSection() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'violation' | 'writeup'>('violation');
  const [employees, setEmployees] = useState<EmployeeFolder[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [formData, setFormData] = useState({
    type: 'observation',
    date: new Date().toISOString().split('T')[0],
    description: '',
    actionPlan: '',
    consequences: '',
    managerName: currentUser?.name || '',
    employeeSignature: ''
  });

  useEffect(() => {
    loadEmployeeFolders();
  }, []);

  const loadEmployeeFolders = () => {
    const folders = storage.getEmployeeFolders();
    setEmployees(folders);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitCounselingRecord = () => {
    if (!selectedEmployee || !formData.description || !formData.managerName) {
      alert('Please select an employee, provide a description, and enter manager name.');
      return;
    }

    const users = storage.getUsers();
    const employee = users[selectedEmployee];
    if (!employee) {
      alert('Employee not found.');
      return;
    }

    const record: CounselingRecord = {
      id: Date.now().toString(),
      employeeEmail: selectedEmployee,
      employeeName: employee.name,
      type: formData.type as CounselingRecord['type'],
      date: formData.date,
      description: formData.description,
      actionPlan: formData.actionPlan,
      recordedBy: formData.managerName,
      recordedDate: new Date().toISOString(),
      acknowledged: false,
      employeeSignature: formData.employeeSignature
    };

    storage.saveCounselingRecord(record);
    
    // Reset form but keep manager name
    setFormData({
      type: 'observation',
      date: new Date().toISOString().split('T')[0],
      description: '',
      actionPlan: '',
      consequences: '',
      managerName: formData.managerName,
      employeeSignature: ''
    });

    loadEmployeeFolders();
    alert('Record saved successfully.');
  };

  const exportViolation = (record: CounselingRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Violation & Counseling - ${record.employeeName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section-title { background: #f5f5f5; padding: 10px; font-weight: bold; }
          .content { padding: 15px; border: 1px solid #ddd; margin-top: 5px; }
          .signature-area { margin-top: 50px; border-top: 1px solid #333; padding-top: 20px; }
          .footer { margin-top: 50px; font-size: 12px; color: #666; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DECADES BAR - EMPLOYEE VIOLATION & COUNSELING</h1>
          <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <div class="section-title">EMPLOYEE INFORMATION</div>
          <div class="content">
            <p><strong>Name:</strong> ${record.employeeName}</p>
            <p><strong>Position:</strong> ${record.type === 'observation' ? 'Observation Note' : 
              record.type === 'verbal' ? 'Verbal Warning' :
              record.type === 'written' ? 'Written Warning' :
              record.type === 'suspension' ? 'Suspension Notice' : 'Termination Notice'}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">VIOLATION DESCRIPTION</div>
          <div class="content">
            <p>${record.description}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">COUNSELING & ACTION PLAN</div>
          <div class="content">
            <p>${record.actionPlan}</p>
          </div>
        </div>

        <div class="signature-area">
          <div style="float: left; width: 45%;">
            <p>_________________________</p>
            <p><strong>Manager Signature</strong></p>
            <p>${record.recordedBy}</p>
            <p>Date: ${new Date(record.recordedDate).toLocaleDateString()}</p>
          </div>
          <div style="float: right; width: 45%;">
            <p>${record.employeeSignature ? '_________________________' : ''}</p>
            <p><strong>Employee Signature</strong></p>
            <p>${record.employeeSignature || ''}</p>
            <p>Date: ${record.employeeSignature ? new Date().toLocaleDateString() : '___________________'}</p>
          </div>
          <div style="clear: both;"></div>
        </div>

        <div class="footer">
          <p>This document becomes part of the employee's permanent record.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const exportWriteUp = (record: CounselingRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Write-Up - ${record.employeeName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section-title { background: #f5f5f5; padding: 10px; font-weight: bold; }
          .content { padding: 15px; border: 1px solid #ddd; margin-top: 5px; }
          .signature-area { margin-top: 50px; border-top: 1px solid #333; padding-top: 20px; }
          .footer { margin-top: 50px; font-size: 12px; color: #666; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DECADES BAR - FORMAL EMPLOYEE WRITE-UP</h1>
          <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <div class="section-title">EMPLOYEE INFORMATION</div>
          <div class="content">
            <p><strong>Name:</strong> ${record.employeeName}</p>
            <p><strong>Position:</strong> Bartender</p>
            <p><strong>Write-Up Type:</strong> ${record.type.toUpperCase()}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">INCIDENT DESCRIPTION</div>
          <div class="content">
            <p>${record.description}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">CORRECTIVE ACTION PLAN</div>
          <div class="content">
            <p>${record.actionPlan}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">CONSEQUENCES</div>
          <div class="content">
            <p>Failure to comply with the above corrective actions may result in further disciplinary action, up to and including termination.</p>
          </div>
        </div>

        <div class="signature-area">
          <div style="float: left; width: 45%;">
            <p>_________________________</p>
            <p><strong>Manager Signature</strong></p>
            <p>${record.recordedBy}</p>
            <p>Date: ${new Date(record.recordedDate).toLocaleDateString()}</p>
          </div>
          <div style="float: right; width: 45%;">
            <p>${record.employeeSignature ? '_________________________' : ''}</p>
            <p><strong>Employee Signature</strong></p>
            <p>${record.employeeSignature || ''}</p>
            <p>Date: ${record.employeeSignature ? new Date().toLocaleDateString() : '___________________'}</p>
          </div>
          <div style="clear: both;"></div>
        </div>

        <div class="footer">
          <p>This document becomes part of the employee's permanent record.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const acknowledgeRecord = (recordId: string) => {
    storage.acknowledgeCounselingRecord(recordId);
    loadEmployeeFolders();
  };

  if (!currentUser || currentUser.position !== 'Admin') {
    return (
      <div className="section active" id="employee-counselings">
        <div className="section-header">
          <h3>Employee Counselings & Write-ups</h3>
          <span className="badge">Admin Only</span>
        </div>
        <p>Access to this section is restricted to management only.</p>
      </div>
    );
  }

  return (
    <div className="section active" id="employee-counselings">
      <div className="section-header">
        <h3>Employee Counselings & Write-ups</h3>
        <span className="badge">Admin Only</span>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <button
          className={`tab-button ${activeTab === 'violation' ? 'active' : ''}`}
          onClick={() => setActiveTab('violation')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'violation' ? '2px solid #d4af37' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'violation' ? 'bold' : 'normal'
          }}
        >
          📝 Violation & Counseling
        </button>
        <button
          className={`tab-button ${activeTab === 'writeup' ? 'active' : ''}`}
          onClick={() => setActiveTab('writeup')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'writeup' ? '2px solid #d4af37' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'writeup' ? 'bold' : 'normal'
          }}
        >
          ⚠️ Formal Write-up
        </button>
      </div>

      {/* Counseling Form */}
      <div className="counseling-form">
        <h4>{activeTab === 'violation' ? 'Employee Violation & Counseling' : 'Formal Employee Write-up'}</h4>
        
        <div className="form-group">
          <label htmlFor="counseling-employee">Employee *</label>
          <select 
            id="counseling-employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="form-control"
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.email} value={employee.email}>
                {employee.name} ({employee.position})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="counseling-type">Type *</label>
          <select 
            id="counseling-type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="form-control"
          >
            <option value="observation">Observation Note</option>
            <option value="verbal">Verbal Warning</option>
            <option value="written">Written Warning</option>
            <option value="suspension">Suspension Notice</option>
            <option value="termination">Termination Notice</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="counseling-date">Date of Incident *</label>
          <input
            type="date"
            id="counseling-date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="counseling-manager">Manager's Name *</label>
          <input
            type="text"
            id="counseling-manager"
            value={formData.managerName}
            onChange={(e) => handleInputChange('managerName', e.target.value)}
            className="form-control"
            placeholder="Enter manager's full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="counseling-description">
            {activeTab === 'violation' ? 'Violation Details *' : 'Incident Description *'}
          </label>
          <textarea
            id="counseling-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="form-control"
            rows={4}
            placeholder={activeTab === 'violation' 
              ? 'Describe the violation or performance issue...' 
              : 'Provide detailed description of the policy violation or incident...'
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="counseling-action">
            {activeTab === 'violation' ? 'Counseling & Action Plan *' : 'Corrective Actions *'}
          </label>
          <textarea
            id="counseling-action"
            value={formData.actionPlan}
            onChange={(e) => handleInputChange('actionPlan', e.target.value)}
            className="form-control"
            rows={3}
            placeholder={activeTab === 'violation'
              ? 'Outline the counseling provided and expected improvements...'
              : 'Specify required corrective actions and timeline...'
            }
          />
        </div>

        {activeTab === 'writeup' && (
          <div className="form-group">
            <label htmlFor="counseling-consequences">Consequences</label>
            <textarea
              id="counseling-consequences"
              value={formData.consequences}
              onChange={(e) => handleInputChange('consequences', e.target.value)}
              className="form-control"
              rows={2}
              placeholder="Outline potential consequences for non-compliance..."
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="counseling-signature">Employee Signature (for acknowledgment)</label>
          <input
            type="text"
            id="counseling-signature"
            value={formData.employeeSignature}
            onChange={(e) => handleInputChange('employeeSignature', e.target.value)}
            className="form-control"
            placeholder="Employee's signature (if present)"
          />
        </div>

        <button className="btn" onClick={submitCounselingRecord}>
          {activeTab === 'violation' ? 'Save Violation Record' : 'Create Write-up'}
        </button>
      </div>

      {/* Employee Folders */}
      <div className="employee-folders" style={{ marginTop: '30px' }}>
        <h4>Employee Records</h4>
        
        {employees.length === 0 ? (
          <p>No employee records found.</p>
        ) : (
          <div className="folders-grid">
            {employees.map(employee => (
              <div key={employee.email} className="employee-folder">
                <div className="folder-header">
                  <h5>{employee.name}</h5>
                  <span className="position-badge">{employee.position}</span>
                </div>
                <div className="folder-content">
                  <p><strong>Email:</strong> {employee.email}</p>
                  <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
                  <p><strong>Total Records:</strong> {employee.counselingRecords.length}</p>
                  
                  {employee.counselingRecords.length > 0 && (
                    <div className="records-list">
                      <h6>Recent Records:</h6>
                      {employee.counselingRecords.slice(0, 3).map(record => (
                        <div key={record.id} className={`record-item ${record.type}`}>
                          <div className="record-header">
                            <span className="record-type">{record.type}</span>
                            <span className="record-date">{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                          <p className="record-description">{record.description.substring(0, 100)}...</p>
                          <div className="record-actions">
                            <button 
                              className="btn-secondary"
                              onClick={() => activeTab === 'violation' ? exportViolation(record) : exportWriteUp(record)}
                            >
                              Export
                            </button>
                            {!record.acknowledged && (
                              <button 
                                className="btn"
                                onClick={() => acknowledgeRecord(record.id)}
                              >
                                Mark Acknowledged
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}