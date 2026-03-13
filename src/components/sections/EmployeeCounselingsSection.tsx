'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { CardProps } from '@/types';
import { supabase } from '@/lib/supabase';
import { getAllUsers } from '@/lib/supabase-auth';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Types
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
}

interface Employee {
  email: string;
  name: string;
  position: string;
}

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, children }: CardProps) {
  return (
    <div
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={{
            ...cardHeaderStyle,
            ...premiumWhiteStyle,
            letterSpacing: '3px',
            fontSize: '1rem'
          }}>
            {title}
          </h4>
          {description && (
            <p style={{ ...premiumBodyStyle, margin: '6px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
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

// Record Item Component - ALOHA STYLED
function CounselingRecordItem({ record, onExport, onAcknowledge }: any) {
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      observation: '#3B82F6',
      verbal: '#F59E0B',
      written: '#EF4444',
      suspension: '#8B5CF6',
      termination: '#DC2626'
    };
    return colors[type] || '#FFFFFF';
  };

  return (
    <div
      style={{
        padding: '18px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '12px'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span style={{
            background: getTypeColor(record.type),
            color: 'white',
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {record.type.replace('_', ' ')}
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: 300 }}>
            {new Date(record.date).toLocaleDateString()}
          </span>
        </div>

        <h5 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 300, letterSpacing: '1px' }}>
          {record.employee_name}
        </h5>

        <p style={{ ...premiumBodyStyle, margin: '0 0 15px 0', fontSize: '0.9rem', fontWeight: 300, opacity: 0.8 }}>
          {record.description.length > 120 ? `${record.description.substring(0, 120)}...` : record.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
          <span style={{
            color: record.acknowledged ? '#10B981' : 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.75rem',
            fontWeight: 400,
            letterSpacing: '0.5px'
          }}>
            {record.acknowledged ? '✓ ACKNOWLEDGED' : 'PENDING'}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onClick={() => onExport(record)}
            >
              Export
            </button>
            {!record.acknowledged && (
              <button
                style={{
                  padding: '6px 12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onClick={() => onAcknowledge(record.id)}
              >
                Sign
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeCounselingsSection() {
  const { currentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'violation' | 'writeup' | 'history'>('violation');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [counselingRecords, setCounselingRecords] = useState<CounselingRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'observation' as CounselingRecord['type'],
    date: new Date().toISOString().split('T')[0],
    description: '',
    actionPlan: '',
    managerName: currentUser?.name || '',
    employeeSignature: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setEmployees(allUsers.filter(u => u.position === 'Bartender' || u.position === 'Trainee'));

      const { data: records, error } = await supabase
        .from('counseling_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCounselingRecords(records || []);
    } catch (error: any) {
      showToast('Error loading counseling records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.position === 'Admin') loadData();
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!selectedEmployee || !formData.description) {
      showToast('Selection and description are required');
      return;
    }

    const employee = employees.find(e => e.email === selectedEmployee);
    if (!employee) return;

    try {
      const { error } = await supabase
        .from('counseling_records')
        .insert([{
          employee_email: selectedEmployee,
          employee_name: employee.name,
          type: formData.type,
          date: formData.date,
          description: formData.description,
          action_plan: formData.actionPlan,
          recorded_by: formData.managerName,
          recorded_date: new Date().toISOString(),
          acknowledged: false,
          employee_signature: formData.employeeSignature || null
        }]);

      if (error) throw error;
      showToast('Record saved successfully');
      setFormData({ ...formData, description: '', actionPlan: '', employeeSignature: '' });
      loadData();
    } catch (error: any) {
      showToast('Error saving record');
    }
  };

  const exportRecord = (record: CounselingRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head><title>Counseling Record - ${record.employee_name}</title></head>
        <body style="font-family: sans-serif; padding: 40px; line-height: 1.5;">
          <h1 style="border-bottom: 2px solid #000; padding-bottom: 10px;">DECADES BAR - COUNSELING RECORD</h1>
          <p><strong>Employee:</strong> ${record.employee_name}</p>
          <p><strong>Type:</strong> ${record.type.toUpperCase()}</p>
          <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc;">
            <strong>Incident:</strong><br/>${record.description}
          </div>
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc;">
            <strong>Action Plan:</strong><br/>${record.action_plan || 'N/A'}
          </div>
          <p><strong>Manager:</strong> ${record.recorded_by}</p>
          <p><strong>Status:</strong> ${record.acknowledged ? 'Acknowledged' : 'Pending Signature'}</p>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (currentUser?.position !== 'Admin') {
    return (
      <div id="employee-counseling-section" style={{ ...uiBackground, padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
        <h3 style={sectionHeaderStyle}>Restricted Access</h3>
        <p style={premiumBodyStyle}>Management credentials required.</p>
      </div>
    );
  }

  return (
    <div
      id="employee-counseling-section"
      style={{
        marginBottom: '25px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: uiBackground,
        backdropFilter: uiBackdropFilter,
        WebkitBackdropFilter: uiBackdropFilterWebkit,
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
      }}
      className="active"
    >

      {/* Section Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
            HR & Counselings
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.7,
            color: 'white',
            fontSize: '0.8rem',
            marginTop: '4px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Employee documentation and performance logs
          </p>
        </div>
        <span style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          color: 'white',
          fontWeight: 300,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          letterSpacing: '1px'
        }}>
          MANAGEMENT
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['violation', 'writeup', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                padding: '10px 20px',
                borderRadius: '30px',
                background: activeTab === tab ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                color: 'white',
                border: activeTab === tab ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontWeight: 300
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'history' ? (
          <AnimatedCard title="📜 Record History">
            {loading ? <p style={premiumBodyStyle}>Loading...</p> : (
              <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                {counselingRecords.map(record => (
                  <CounselingRecordItem
                    key={record.id}
                    record={record}
                    onExport={exportRecord}
                    onAcknowledge={() => { }}
                  />
                ))}
              </div>
            )}
          </AnimatedCard>
        ) : (
          <AnimatedCard title={activeTab === 'violation' ? "New Violation Log" : "Formal Write-up"}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }}
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.email} value={e.email}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>Warning Level</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }}
                >
                  <option value="observation">Observation</option>
                  <option value="verbal">Verbal</option>
                  <option value="written">Written</option>
                  <option value="suspension">Suspension</option>
                  <option value="termination">Termination</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>Incident Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', minHeight: '120px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }}
                placeholder="Detail the infraction..."
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>Action Plan</label>
              <textarea
                value={formData.actionPlan}
                onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                style={{ width: '100%', minHeight: '80px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }}
                placeholder="Required corrective steps..."
              />
            </div>

            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Commit Record to Cloud
            </button>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
}