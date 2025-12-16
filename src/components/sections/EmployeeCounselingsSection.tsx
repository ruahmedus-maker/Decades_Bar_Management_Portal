'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { CardProps } from '@/types';
import { supabase } from '@/lib/supabase';
import { getAllUsers } from '@/lib/supabase-auth';

// Define the section color for employee counseling - teal blue theme
const SECTION_COLOR = '#0D9488'; // Teal color for counseling
const SECTION_COLOR_RGB = '13, 148, 136';

// Types for counseling records
interface CounselingRecord {
  id: string;
  employee_email: string;
  employee_name: string;
  type: 'observation' | 'verbal' | 'written' | 'suspension' | 'termination';
  date: string;
  description: string;
  action_plan?: string;
  recorded_by: string;
  recorded_date: string;
  acknowledged: boolean;
  employee_signature?: string;
  created_at?: string;
  updated_at?: string;
}

interface Employee {
  email: string;
  name: string;
  position: string;
}

// Animated Card Component without Hover Effects
function AnimatedCard({ title, description, items, footer, index, children }: CardProps) {
  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        transition: 'none', // Removed cubic-bezier - caused browser crashes
        transform: 'translateY(0) scale(1)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
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
          {description && (
            <p style={{
              margin: '8px 0 0 0',
              opacity: 0.9,
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem'
            }}>
              {description}
            </p>
          )}
        </div>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Counseling Record Item Component without Hover Effects
function CounselingRecordItem({ record, onExport, onAcknowledge, index }: any) {
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      observation: '#3B82F6',
      verbal: '#F59E0B',
      written: '#EF4444',
      suspension: '#8B5CF6',
      termination: '#DC2626'
    };
    return colors[type] || SECTION_COLOR;
  };

  return (
    <div
      style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: 'none', // Removed - caused scroll crashes
        transform: 'translateY(0)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{
            background: `linear-gradient(135deg, ${getTypeColor(record.type)}, ${getTypeColor(record.type)}99)`,
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {record.type.replace('_', ' ')}
          </span>
          <span style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            {new Date(record.date).toLocaleDateString()}
          </span>
        </div>

        <h5 style={{
          color: 'white',
          margin: '0 0 8px 0',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'color 0.3s ease'
        }}>
          {record.employee_name}
        </h5>

        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          margin: '0 0 12px 0',
          fontSize: '0.9rem',
          lineHeight: 1.5
        }}>
          {record.description.substring(0, 120)}...
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            color: record.acknowledged ? '#10B981' : 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            {record.acknowledged ? '✅ Acknowledged' : '⏳ Pending'}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                transition: 'none', // Removed - caused scroll crashes
                fontSize: '0.8rem',
                fontWeight: '500',
                backdropFilter: 'blur(10px)'
              }}
              onClick={() => onExport(record)}
            >
              Export
            </button>

            {!record.acknowledged && (
              <button
                style={{
                  padding: '6px 12px',
                  background: 'rgba(13, 148, 136, 0.3)',
                  border: '1px solid rgba(13, 148, 136, 0.5)',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'none', // Removed - caused scroll crashes
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={() => onAcknowledge(record.id)}
              >
                Acknowledge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeCounselingSection() {
  const { currentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'violation' | 'writeup'>('violation');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [counselingRecords, setCounselingRecords] = useState<CounselingRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'observation' as CounselingRecord['type'],
    date: new Date().toISOString().split('T')[0],
    description: '',
    actionPlan: '',
    consequences: '',
    managerName: currentUser?.name || '',
    employeeSignature: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);

      // Load employees (bartenders and trainees only)
      const allUsers = await getAllUsers();
      const bartendersAndTrainees = allUsers.filter(user =>
        user.position === 'Bartender' || user.position === 'Trainee'
      );
      setEmployees(bartendersAndTrainees);

      // Load counseling records
      const { data: records, error } = await supabase
        .from('counseling_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCounselingRecords(records || []);
    } catch (error: any) {
      console.error('Error loading counseling data:', error);
      showToast(error.message || 'Error loading counseling records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitCounselingRecord = async () => {
    if (!selectedEmployee || !formData.description || !formData.managerName) {
      showToast('Please select an employee, provide a description, and enter manager name.');
      return;
    }

    const selectedEmployeeData = employees.find(emp => emp.email === selectedEmployee);
    if (!selectedEmployeeData) {
      showToast('Employee not found.');
      return;
    }

    try {
      // Create record payload (let Supabase generate ID)
      const recordPayload = {
        employee_email: selectedEmployee,
        employee_name: selectedEmployeeData.name,
        type: formData.type,
        date: formData.date,
        description: formData.description,
        action_plan: formData.actionPlan,
        recorded_by: formData.managerName,
        recorded_date: new Date().toISOString(),
        acknowledged: false,
        employee_signature: formData.employeeSignature || null
      };

      const { error } = await supabase
        .from('counseling_records')
        .insert([recordPayload]);

      if (error) throw error;

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

      showToast('Counseling record saved successfully!');
      loadData(); // Reload records
    } catch (error: any) {
      console.error('Error saving counseling record:', error);
      showToast(error.message || 'Error saving counseling record');
    }
  };

  const exportViolation = (record: CounselingRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Violation & Counseling - ${record.employee_name}</title>
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
            <p><strong>Name:</strong> ${record.employee_name}</p>
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
            <p>${record.action_plan || 'No action plan specified.'}</p>
          </div>
        </div>

        <div class="signature-area">
          <div style="float: left; width: 45%;">
            <p>_________________________</p>
            <p><strong>Manager Signature</strong></p>
            <p>${record.recorded_by}</p>
            <p>Date: ${new Date(record.recorded_date).toLocaleDateString()}</p>
          </div>
          <div style="float: right; width: 45%;">
            <p>${record.employee_signature ? '_________________________' : ''}</p>
            <p><strong>Employee Signature</strong></p>
            <p>${record.employee_signature || ''}</p>
            <p>Date: ${record.employee_signature ? new Date().toLocaleDateString() : '___________________'}</p>
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
        <title>Employee Write-Up - ${record.employee_name}</title>
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
            <p><strong>Name:</strong> ${record.employee_name}</p>
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
            <p>${record.action_plan || 'No corrective action plan specified.'}</p>
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
            <p>${record.recorded_by}</p>
            <p>Date: ${new Date(record.recorded_date).toLocaleDateString()}</p>
          </div>
          <div style="float: right; width: 45%;">
            <p>${record.employee_signature ? '_________________________' : ''}</p>
            <p><strong>Employee Signature</strong></p>
            <p>${record.employee_signature || ''}</p>
            <p>Date: ${record.employee_signature ? new Date().toLocaleDateString() : '___________________'}</p>
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

  const acknowledgeRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('counseling_records')
        .update({
          acknowledged: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId);

      if (error) throw error;

      showToast('Record acknowledged successfully!');
      loadData(); // Reload records
    } catch (error: any) {
      console.error('Error acknowledging record:', error);
      showToast(error.message || 'Error acknowledging record');
    }
  };

  // Group counseling records by employee
  const employeeRecordsMap = counselingRecords.reduce((acc, record) => {
    if (!acc[record.employee_email]) {
      acc[record.employee_email] = [];
    }
    acc[record.employee_email].push(record);
    return acc;
  }, {} as Record<string, CounselingRecord[]>);

  if (!currentUser || currentUser.position !== 'Admin') {
    return (
      <div
        id="employee-counseling-section"
        style={{
          marginBottom: '30px',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px) saturate(170%)',
          WebkitBackdropFilter: 'blur(15px) saturate(170%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
        }}
        className="active"
      >
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Employee Counselings & Write-ups
          </h3>
          <span style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: 'white',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '8px',
            display: 'inline-block'
          }}>
            Admin Only
          </span>
        </div>
        <div style={{ padding: '25px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
          <p>Access to this section is restricted to management only.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        id="employee-counseling-section"
        style={{
          marginBottom: '30px',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px) saturate(170%)',
          WebkitBackdropFilter: 'blur(15px) saturate(170%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
          padding: '40px',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
        <h3>Loading Counseling Records...</h3>
        <p>Connecting to cloud database</p>
      </div>
    );
  }

  return (
    <div
      id="employee-counseling-section"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        WebkitBackdropFilter: 'blur(15px) saturate(170%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
        transition: 'none', // Removed cubic-bezier - caused browser crashes
        transform: 'translateY(0)',
        animation: 'fadeIn 0.5s ease'
      }}
      className="active"
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
            Employee Counselings & Write-ups
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Manage employee counseling records and formal write-ups
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
      </div>

      <div style={{ padding: '25px' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            style={{
              padding: '12px 24px',
              background: activeTab === 'violation'
                ? `rgba(${SECTION_COLOR_RGB}, 0.3)`
                : 'rgba(255, 255, 255, 0.1)',
              border: activeTab === 'violation'
                ? `1px solid rgba(${SECTION_COLOR_RGB}, 0.5)`
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'none', // Removed - caused scroll crashes
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setActiveTab('violation')}
          >
            📝 Violation & Counseling
          </button>
          <button
            style={{
              padding: '12px 24px',
              background: activeTab === 'writeup'
                ? `rgba(${SECTION_COLOR_RGB}, 0.3)`
                : 'rgba(255, 255, 255, 0.1)',
              border: activeTab === 'writeup'
                ? `1px solid rgba(${SECTION_COLOR_RGB}, 0.5)`
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'none', // Removed - caused scroll crashes
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setActiveTab('writeup')}
          >
            ⚠️ Formal Write-up
          </button>
        </div>

        {/* Counseling Form */}
        <AnimatedCard
          title={activeTab === 'violation' ? 'Employee Violation & Counseling' : 'Formal Employee Write-up'}
          description="Create new counseling records and manage employee documentation"
          index={0}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Employee *
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.email} value={employee.email}>
                    {employee.name} ({employee.position})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              >
                <option value="observation">Observation Note</option>
                <option value="verbal">Verbal Warning</option>
                <option value="written">Written Warning</option>
                <option value="suspension">Suspension Notice</option>
                <option value="termination">Termination Notice</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Date of Incident *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Manager's Name *
              </label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) => handleInputChange('managerName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                placeholder="Enter manager's full name"
              />
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
              {activeTab === 'violation' ? 'Violation Details *' : 'Incident Description *'}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.9rem',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder={activeTab === 'violation'
                ? 'Describe the violation or performance issue...'
                : 'Provide detailed description of the policy violation or incident...'
              }
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
              {activeTab === 'violation' ? 'Counseling & Action Plan *' : 'Corrective Actions *'}
            </label>
            <textarea
              value={formData.actionPlan}
              onChange={(e) => handleInputChange('actionPlan', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.9rem',
                minHeight: '60px',
                resize: 'vertical'
              }}
              placeholder={activeTab === 'violation'
                ? 'Outline the counseling provided and expected improvements...'
                : 'Specify required corrective actions and timeline...'
              }
            />
          </div>

          {activeTab === 'writeup' && (
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                Consequences
              </label>
              <textarea
                value={formData.consequences}
                onChange={(e) => handleInputChange('consequences', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
                placeholder="Outline potential consequences for non-compliance..."
              />
            </div>
          )}

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
              Employee Signature (for acknowledgment)
            </label>
            <input
              type="text"
              value={formData.employeeSignature}
              onChange={(e) => handleInputChange('employeeSignature', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.9rem'
              }}
              placeholder="Employee's signature (if present)"
            />
          </div>

          <button
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: `rgba(${SECTION_COLOR_RGB}, 0.3)`,
              border: `1px solid rgba(${SECTION_COLOR_RGB}, 0.5)`,
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'none', // Removed - caused scroll crashes
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
            onClick={submitCounselingRecord}
          >
            {activeTab === 'violation' ? 'Save Violation Record' : 'Create Write-up'}
          </button>
        </AnimatedCard>

        {/* Employee Records */}
        <AnimatedCard
          title="📁 Employee Records"
          description="View and manage counseling records for all employees"
          index={1}
        >
          {employees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
              No employees found.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '15px',
              marginTop: '15px'
            }}>
              {employees.map((employee, index) => {
                const employeeRecords = employeeRecordsMap[employee.email] || [];
                return (
                  <div key={employee.email} style={{
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h5 style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                        {employee.name}
                      </h5>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '500'
                      }}>
                        {employee.position}
                      </span>
                    </div>

                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', marginBottom: '10px' }}>
                      <div>Email: {employee.email}</div>
                      <div>Total Records: {employeeRecords.length}</div>
                    </div>

                    {employeeRecords.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <h6 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '600' }}>
                          Recent Records:
                        </h6>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {employeeRecords.slice(0, 2).map((record, recordIndex) => (
                            <CounselingRecordItem
                              key={record.id}
                              record={record}
                              onExport={activeTab === 'violation' ? exportViolation : exportWriteUp}
                              onAcknowledge={acknowledgeRecord}
                              index={recordIndex}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </AnimatedCard>
      </div>
    </div>
  );
}