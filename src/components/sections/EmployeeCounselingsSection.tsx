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

  // Styles object for the component
  const styles = {
    section: {
      background: 'linear-gradient(135deg, rgba(255, 245, 245, 0.1) 0%, rgba(255, 215, 215, 0.15) 50%, rgba(175, 238, 238, 0.1) 100%)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '25px',
      margin: '20px 0',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '2px solid rgba(239, 108, 117, 0.3)',
    },
    headerTitle: {
      color: '#2c5aa0',
      fontSize: '24px',
      fontWeight: '700',
      margin: '0',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    badge: {
      background: 'linear-gradient(135deg, #ef6c75, #ff8e9e)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(239, 108, 117, 0.3)',
    },
    tabNavigation: {
      marginBottom: '25px',
      borderBottom: '1px solid rgba(44, 90, 160, 0.2)',
      display: 'flex',
    },
    tabButton: {
      padding: '12px 24px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      position: 'relative' as const,
      overflow: 'hidden',
      color: '#5a6c8c',
    },
    tabButtonActive: {
      borderBottom: '3px solid #2c5aa0',
      color: '#2c5aa0',
      fontWeight: '700',
    },
    tabButtonHover: {
      background: 'linear-gradient(135deg, rgba(44, 90, 160, 0.05), rgba(175, 238, 238, 0.1))',
      color: '#2c5aa0',
    },
    counselingForm: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 245, 245, 0.3) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '25px',
      marginBottom: '30px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
    },
    formTitle: {
      color: '#2c5aa0',
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '1px solid rgba(44, 90, 160, 0.2)',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#2c5aa0',
      fontSize: '14px',
    },
    formControl: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '10px',
      border: '1px solid rgba(44, 90, 160, 0.2)',
      background: 'rgba(255, 255, 255, 0.7)',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
    },
    formControlFocus: {
      outline: 'none',
      borderColor: '#2c5aa0',
      boxShadow: '0 0 0 3px rgba(44, 90, 160, 0.2)',
      background: 'rgba(255, 255, 255, 0.9)',
    },
    textarea: {
      minHeight: '100px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
    },
    button: {
      background: 'linear-gradient(135deg, #2c5aa0, #3a6bc0)',
      color: 'white',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(44, 90, 160, 0.3)',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(44, 90, 160, 0.4)',
      background: 'linear-gradient(135deg, #3a6bc0, #4a7bd0)',
    },
    buttonSecondary: {
      background: 'linear-gradient(135deg, #ef6c75, #ff8e9e)',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 3px 10px rgba(239, 108, 117, 0.3)',
      marginRight: '10px',
    },
    buttonSecondaryHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(239, 108, 117, 0.4)',
      background: 'linear-gradient(135deg, #ff8e9e, #ffa5b3)',
    },
    foldersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    employeeFolder: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(175, 238, 238, 0.15) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '20px',
      transition: 'all 0.3s ease',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    },
    employeeFolderHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 25px rgba(0, 0, 0, 0.15)',
      borderColor: 'rgba(44, 90, 160, 0.4)',
    },
    folderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px solid rgba(44, 90, 160, 0.2)',
    },
    folderTitle: {
      color: '#2c5aa0',
      fontSize: '18px',
      fontWeight: '600',
      margin: '0',
    },
    positionBadge: {
      background: 'linear-gradient(135deg, #20b2aa, #40e0d0)',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: '500',
    },
    recordItem: {
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '15px',
      border: '1px solid rgba(44, 90, 160, 0.1)',
      transition: 'all 0.3s ease',
    },
    recordItemHover: {
      transform: 'translateX(5px)',
      borderColor: 'rgba(44, 90, 160, 0.3)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    recordHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    recordType: {
      background: 'linear-gradient(135deg, #ef6c75, #ff8e9e)',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
    },
    recordDate: {
      color: '#5a6c8c',
      fontSize: '12px',
    },
    recordDescription: {
      color: '#4a5568',
      fontSize: '14px',
      lineHeight: '1.5',
      marginBottom: '10px',
    },
    recordActions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  };

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
      <div style={styles.section} id="employee-counselings">
        <div style={styles.sectionHeader}>
          <h3 style={styles.headerTitle}>Employee Counselings & Write-ups</h3>
          <span style={styles.badge}>Admin Only</span>
        </div>
        <p>Access to this section is restricted to management only.</p>
      </div>
    );
  }

  return (
    <div style={styles.section} id="employee-counselings">
      <div style={styles.sectionHeader}>
        <h3 style={styles.headerTitle}>Employee Counselings & Write-ups</h3>
        <span style={styles.badge}>Admin Only</span>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabNavigation}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'violation' ? styles.tabButtonActive : {}),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = styles.tabButtonHover.background;
            e.currentTarget.style.color = styles.tabButtonHover.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = activeTab === 'violation' ? styles.tabButtonActive.color : styles.tabButton.color;
          }}
          onClick={() => setActiveTab('violation')}
        >
          📝 Violation & Counseling
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'writeup' ? styles.tabButtonActive : {}),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = styles.tabButtonHover.background;
            e.currentTarget.style.color = styles.tabButtonHover.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = activeTab === 'writeup' ? styles.tabButtonActive.color : styles.tabButton.color;
          }}
          onClick={() => setActiveTab('writeup')}
        >
          ⚠️ Formal Write-up
        </button>
      </div>

      {/* Counseling Form */}
      <div style={styles.counselingForm}>
        <h4 style={styles.formTitle}>
          {activeTab === 'violation' ? 'Employee Violation & Counseling' : 'Formal Employee Write-up'}
        </h4>
        
        <div style={styles.formGroup}>
          <label htmlFor="counseling-employee" style={styles.label}>Employee *</label>
          <select 
            id="counseling-employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            style={styles.formControl}
            onFocus={(e) => Object.assign(e.target, styles.formControlFocus)}
            onBlur={(e) => Object.assign(e.target, styles.formControl)}
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.email} value={employee.email}>
                {employee.name} ({employee.position})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="counseling-type" style={styles.label}>Type *</label>
          <select 
            id="counseling-type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            style={styles.formControl}
            onFocus={(e) => Object.assign(e.target, styles.formControlFocus)}
            onBlur={(e) => Object.assign(e.target, styles.formControl)}
          >
            <option value="observation">Observation Note</option>
            <option value="verbal">Verbal Warning</option>
            <option value="written">Written Warning</option>
            <option value="suspension">Suspension Notice</option>
            <option value="termination">Termination Notice</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="counseling-date" style={styles.label}>Date of Incident *</label>
          <input
            type="date"
            id="counseling-date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            style={styles.formControl}
            onFocus={(e) => Object.assign(e.target, styles.formControlFocus)}
            onBlur={(e) => Object.assign(e.target, styles.formControl)}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="counseling-manager" style={styles.label}>Manager's Name *</label>
          <input
            type="text"
            id="counseling-manager"
            value={formData.managerName}
            onChange={(e) => handleInputChange('managerName', e.target.value)}
            style={styles.formControl}
            placeholder="Enter manager's full name"
            onFocus={(e) => Object.assign(e.target, styles.formControlFocus)}
            onBlur={(e) => Object.assign(e.target, styles.formControl)}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="counseling-description" style={styles.label}>
            {activeTab === 'violation' ? 'Violation Details *' : 'Incident Description *'}
          </label>
          <textarea
            id="counseling-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            style={{...styles.formControl, ...styles.textarea}}
            rows={4}
            placeholder={activeTab === 'violation' 
              ? 'Describe the violation or performance issue...' 
              : 'Provide detailed description of the policy violation or incident...'
            }
            onFocus={(e) => Object.assign(e.target, styles.formControlFocus)}
            onBlur={(e) => Object.assign(e.target, styles.formControl)}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="counseling-action" style={styles.label}>
            {activeTab === 'violation' ? 'Counseling & Action Plan *' : 'Corrective Actions *'}
          </label>
          <textarea
            id="counseling-action"
            value={formData.actionPlan}
            onChange={(e) => handleInputChange('actionPlan', e.target.value)}
            style={{...styles.formControl, ...styles.textarea}}
            rows={3}
            placeholder={activeTab === 'violation'
              ? 'Outline the counseling provided and expected improvements...'
              : 'Specify required corrective actions and timeline...'
            }
            onFocus={(e) => Object.assign(e.target, styles.formControlFocus)}
            onBlur={(e) => Object.assign(e.target, styles.formControl)}
          />
        </div>

        {activeTab === 'writeup' && (
          <div style={styles.formGroup}>
            <label htmlFor="counseling-consequences" style={styles.label}>Consequences</label>
            <textarea
              id="counseling-consequences"
              value={formData.consequences}
              onChange={(e) => handleInputChange('consequences', e.target.value)}
              style={{...styles.formControl, ...styles.textarea}}
              rows={2}
              placeholder="Outline potential consequences for non-compliance..."
              onFocus={(e) => Object.assign(e.target, styles.formControlFocus)}
              onBlur={(e) => Object.assign(e.target, styles.formControl)}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label htmlFor="counseling-signature" style={styles.label}>Employee Signature (for acknowledgment)</label>
          <input
            type="text"
            id="counseling-signature"
            value={formData.employeeSignature}
            onChange={(e) => handleInputChange('employeeSignature', e.target.value)}
            style={styles.formControl}
            placeholder="Employee's signature (if present)"
            onFocus={(e) => Object.assign(e.target, styles.formControlFocus)}
            onBlur={(e) => Object.assign(e.target, styles.formControl)}
          />
        </div>

        <button 
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.target, styles.buttonHover)}
          onMouseLeave={(e) => {
            e.target.style.transform = 'none';
            e.target.style.boxShadow = styles.button.boxShadow;
            e.target.style.background = styles.button.background;
          }}
          onClick={submitCounselingRecord}
        >
          {activeTab === 'violation' ? 'Save Violation Record' : 'Create Write-up'}
        </button>
      </div>

      {/* Employee Folders */}
      <div style={{ marginTop: '30px' }}>
        <h4 style={{...styles.formTitle, borderBottom: 'none', marginBottom: '15px'}}>Employee Records</h4>
        
        {employees.length === 0 ? (
          <p>No employee records found.</p>
        ) : (
          <div style={styles.foldersGrid}>
            {employees.map(employee => (
              <div 
                key={employee.email} 
                style={styles.employeeFolder}
                onMouseEnter={(e) => Object.assign(e.currentTarget, styles.employeeFolderHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = styles.employeeFolder.boxShadow;
                  e.currentTarget.style.borderColor = styles.employeeFolder.border;
                }}
              >
                <div style={styles.folderHeader}>
                  <h5 style={styles.folderTitle}>{employee.name}</h5>
                  <span style={styles.positionBadge}>{employee.position}</span>
                </div>
                <div>
                  <p><strong>Email:</strong> {employee.email}</p>
                  <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
                  <p><strong>Total Records:</strong> {employee.counselingRecords.length}</p>
                  
                  {employee.counselingRecords.length > 0 && (
                    <div style={{marginTop: '15px'}}>
                      <h6 style={{margin: '0 0 10px 0', color: '#2c5aa0', fontSize: '16px'}}>Recent Records:</h6>
                      {employee.counselingRecords.slice(0, 3).map(record => (
                        <div 
                          key={record.id} 
                          style={styles.recordItem}
                          onMouseEnter={(e) => Object.assign(e.currentTarget, styles.recordItemHover)}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.borderColor = styles.recordItem.border;
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={styles.recordHeader}>
                            <span style={styles.recordType}>{record.type}</span>
                            <span style={styles.recordDate}>{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                          <p style={styles.recordDescription}>{record.description.substring(0, 100)}...</p>
                          <div style={styles.recordActions}>
                            <button 
                              style={styles.buttonSecondary}
                              onMouseEnter={(e) => Object.assign(e.target, styles.buttonSecondaryHover)}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'none';
                                e.target.style.boxShadow = styles.buttonSecondary.boxShadow;
                                e.target.style.background = styles.buttonSecondary.background;
                              }}
                              onClick={() => activeTab === 'violation' ? exportViolation(record) : exportWriteUp(record)}
                            >
                              Export
                            </button>
                            {!record.acknowledged && (
                              <button 
                                style={styles.button}
                                onMouseEnter={(e) => Object.assign(e.target, styles.buttonHover)}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'none';
                                  e.target.style.boxShadow = styles.button.boxShadow;
                                  e.target.style.background = styles.button.background;
                                }}
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