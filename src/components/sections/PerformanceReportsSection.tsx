import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { storage } from '@/lib/storage';
import { User } from '@/types';

// Define the section color for performance tracking - blue theme
const SECTION_COLOR = '#3B82F6';
const SECTION_COLOR_RGB = '59, 130, 246';

// Performance metrics interface
interface PerformanceMetrics {
  id: string;
  bartender: User;
  shiftSales: number;
  checkAverage: number;
  totalChecks: number;
  station: string;
  shiftType: 'day' | 'night';
  shiftDay: 'thursday' | 'friday' | 'saturday' | 'sunday';
  date: string;
  specialsSold: number;
  notes?: string;
}

// Report types
type ReportType = 'sales-summary' | 'performance-comparison' | 'shift-analysis' | 'station-performance';

interface ReportConfig {
  type: ReportType;
  dateRange: { start: string; end: string };
  bartenders: string[];
  stations: string[];
  shiftTypes: ('day' | 'night')[];
  metrics: string[];
}

export default function PerformanceReportsSection() {
  const { currentUser, showToast } = useApp();
  const [bartenders, setBartenders] = useState<User[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportType>('sales-summary');
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Input form state
  const [inputForm, setInputForm] = useState({
    bartenderEmail: '',
    shiftSales: '',
    checkAverage: '',
    totalChecks: '',
    station: 'Main Bar',
    shiftType: 'night' as 'day' | 'night',
    shiftDay: 'friday' as 'thursday' | 'friday' | 'saturday' | 'sunday',
    date: new Date().toISOString().split('T')[0],
    specialsSold: '',
    notes: ''
  });

  // Report configuration state
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'sales-summary',
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    bartenders: [],
    stations: ['Main Bar', 'Service Bar', 'Patio Bar', 'VIP Bar'],
    shiftTypes: ['day', 'night'],
    metrics: ['shiftSales', 'checkAverage', 'totalChecks']
  });

  // Load bartenders and performance data
  useEffect(() => {
    if (currentUser?.position === 'Admin') {
      const users = Object.values(storage.getUsers());
      const bartendersList = users.filter(user => 
        user.position === 'Bartender' || user.position === 'Trainee'
      );
      setBartenders(bartendersList);
      
      // Load performance data from localStorage
      const savedData = localStorage.getItem('bartenderPerformanceData');
      if (savedData) {
        setPerformanceData(JSON.parse(savedData));
      }
    }
  }, [currentUser]);

  // Save performance data to localStorage whenever it changes
  useEffect(() => {
    if (performanceData.length > 0) {
      localStorage.setItem('bartenderPerformanceData', JSON.stringify(performanceData));
    }
  }, [performanceData]);

  const handleInputChange = (field: string, value: string) => {
    setInputForm(prev => ({ ...prev, [field]: value }));
  };

  const submitPerformanceData = () => {
    const newEntry: PerformanceMetrics = {
      id: `perf-${Date.now()}`,
      bartender: bartenders.find(b => b.email === inputForm.bartenderEmail)!,
      shiftSales: parseFloat(inputForm.shiftSales) || 0,
      checkAverage: parseFloat(inputForm.checkAverage) || 0,
      totalChecks: parseInt(inputForm.totalChecks) || 0,
      station: inputForm.station,
      shiftType: inputForm.shiftType,
      shiftDay: inputForm.shiftDay,
      date: inputForm.date,
      specialsSold: parseInt(inputForm.specialsSold) || 0,
      notes: inputForm.notes
    };

    setPerformanceData(prev => [...prev, newEntry]);
    showToast('Performance data added successfully!');
    setShowInputModal(false);
    
    // Reset form
    setInputForm({
      bartenderEmail: '',
      shiftSales: '',
      checkAverage: '',
      totalChecks: '',
      station: 'Main Bar',
      shiftType: 'night',
      shiftDay: 'friday',
      date: new Date().toISOString().split('T')[0],
      specialsSold: '',
      notes: ''
    });
  };

  const generateReport = () => {
    const filteredData = performanceData.filter(entry => {
      const entryDate = new Date(entry.date);
      const startDate = new Date(reportConfig.dateRange.start);
      const endDate = new Date(reportConfig.dateRange.end);
      
      return entryDate >= startDate && entryDate <= endDate &&
             (reportConfig.bartenders.length === 0 || reportConfig.bartenders.includes(entry.bartender.email)) &&
             reportConfig.stations.includes(entry.station) &&
             reportConfig.shiftTypes.includes(entry.shiftType);
    });

    let reportData: any = {};

    switch (reportConfig.type) {
      case 'sales-summary':
        reportData = generateSalesSummary(filteredData);
        break;
      case 'performance-comparison':
        reportData = generatePerformanceComparison(filteredData);
        break;
      case 'shift-analysis':
        reportData = generateShiftAnalysis(filteredData);
        break;
      case 'station-performance':
        reportData = generateStationPerformance(filteredData);
        break;
    }

    setGeneratedReport(reportData);
    setShowReportModal(false);
    showToast('Report generated successfully!');
  };

  const generateSalesSummary = (data: PerformanceMetrics[]) => {
    const totalSales = data.reduce((sum, entry) => sum + entry.shiftSales, 0);
    const averageCheck = data.length > 0 ? data.reduce((sum, entry) => sum + entry.checkAverage, 0) / data.length : 0;
    const totalChecks = data.reduce((sum, entry) => sum + entry.totalChecks, 0);
    
    const salesByDay = data.reduce((acc: any, entry) => {
      if (!acc[entry.shiftDay]) acc[entry.shiftDay] = 0;
      acc[entry.shiftDay] += entry.shiftSales;
      return acc;
    }, {});

    return {
      type: 'sales-summary',
      totalSales,
      averageCheck,
      totalChecks,
      salesByDay,
      dataCount: data.length,
      period: reportConfig.dateRange
    };
  };

  const generatePerformanceComparison = (data: PerformanceMetrics[]) => {
    const bartenderPerformance = bartenders.map(bartender => {
      const bartenderData = data.filter(entry => entry.bartender.email === bartender.email);
      const totalSales = bartenderData.reduce((sum, entry) => sum + entry.shiftSales, 0);
      const averageCheck = bartenderData.length > 0 ? 
        bartenderData.reduce((sum, entry) => sum + entry.checkAverage, 0) / bartenderData.length : 0;
      const shiftsWorked = bartenderData.length;

      return {
        bartender: bartender.name,
        totalSales,
        averageCheck,
        shiftsWorked,
        performanceScore: Math.round((totalSales / 3000 + averageCheck / 50) * 50) // Simple scoring
      };
    });

    return {
      type: 'performance-comparison',
      bartenderPerformance: bartenderPerformance.sort((a, b) => b.performanceScore - a.performanceScore),
      period: reportConfig.dateRange
    };
  };

  const generateShiftAnalysis = (data: PerformanceMetrics[]) => {
    const shiftAnalysis = data.reduce((acc: any, entry) => {
      const key = `${entry.shiftDay}-${entry.shiftType}`;
      if (!acc[key]) {
        acc[key] = {
          shiftSales: 0,
          totalChecks: 0,
          count: 0,
          averageCheck: 0
        };
      }
      acc[key].shiftSales += entry.shiftSales;
      acc[key].totalChecks += entry.totalChecks;
      acc[key].count += 1;
      return acc;
    }, {});

    // Calculate averages
    Object.keys(shiftAnalysis).forEach(key => {
      shiftAnalysis[key].averageCheck = shiftAnalysis[key].shiftSales / shiftAnalysis[key].totalChecks;
    });

    return {
      type: 'shift-analysis',
      shiftAnalysis,
      period: reportConfig.dateRange
    };
  };

  const generateStationPerformance = (data: PerformanceMetrics[]) => {
    const stationPerformance = data.reduce((acc: any, entry) => {
      if (!acc[entry.station]) {
        acc[entry.station] = {
          totalSales: 0,
          totalChecks: 0,
          averageCheck: 0,
          shiftCount: 0
        };
      }
      acc[entry.station].totalSales += entry.shiftSales;
      acc[entry.station].totalChecks += entry.totalChecks;
      acc[entry.station].shiftCount += 1;
      return acc;
    }, {});

    // Calculate averages
    Object.keys(stationPerformance).forEach(station => {
      stationPerformance[station].averageCheck = 
        stationPerformance[station].totalSales / stationPerformance[station].totalChecks;
    });

    return {
      type: 'station-performance',
      stationPerformance,
      period: reportConfig.dateRange
    };
  };

  // Calculate key metrics for dashboard
  const totalSales = performanceData.reduce((sum, data) => sum + data.shiftSales, 0);
  const averageCheck = performanceData.length > 0 
    ? performanceData.reduce((sum, data) => sum + data.checkAverage, 0) / performanceData.length 
    : 0;
  const totalShifts = performanceData.length;

  if (!currentUser || currentUser.position !== 'Admin') {
    return (
      <div 
        id="performance-tracking-section"
        style={{
          marginBottom: '30px',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px) saturate(170%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 700,
            margin: 0,
          }}>
            Bartender Performance Tracking
          </h3>
          <span style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: 'white',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '8px',
            display: 'inline-block'
          }}>
            Admin Only
          </span>
        </div>
        <div style={{ padding: '25px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
          <p>Access to performance tracking is restricted to management only.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="performance-tracking-section"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
      }}
    >
      
      {/* Section Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
        padding: '20px',
        borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
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
          }}>
            Bartender Performance Tracking
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Comprehensive sales tracking and performance analytics
          </p>
        </div>
        <span style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          color: 'white',
          fontWeight: '600',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          Admin Only
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderLeft: '4px solid #3B82F6'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Total Sales</p>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
              ${totalSales.toLocaleString()}
            </h3>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderLeft: '4px solid #10B981'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Avg Check</p>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
              ${averageCheck.toFixed(2)}
            </h3>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderLeft: '4px solid #F59E0B'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Total Shifts</p>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
              {totalShifts}
            </h3>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderLeft: '4px solid #8B5CF6'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Active Bartenders</p>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
              {bartenders.length}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <button 
            onClick={() => setShowInputModal(true)}
            style={{
              padding: '15px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
            }}
          >
            ➕ Add Shift Data
          </button>
          <button 
            onClick={() => setShowReportModal(true)}
            style={{
              padding: '15px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
            }}
          >
            📊 Generate Report
          </button>
        </div>

        {/* Recent Data Table */}
        {performanceData.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            marginBottom: '25px'
          }}>
            <h4 style={{ color: 'white', margin: '0 0 20px 0', fontSize: '1.2rem' }}>
              Recent Shift Data
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Bartender</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Shift</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Sales</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Check Avg</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}># Checks</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Specials</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Station</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.slice(-5).map((data, index) => (
                    <tr 
                      key={data.id}
                      style={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px' }}>{data.bartender.name}</td>
                      <td style={{ padding: '12px' }}>{new Date(data.date).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}>
                        {data.shiftDay.charAt(0).toUpperCase() + data.shiftDay.slice(1)} {data.shiftType}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>${data.shiftSales.toLocaleString()}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>${data.checkAverage.toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{data.totalChecks}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{data.specialsSold}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{data.station}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Generated Report Display */}
        {generatedReport && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>
                {generatedReport.type === 'sales-summary' && 'Sales Summary Report'}
                {generatedReport.type === 'performance-comparison' && 'Performance Comparison Report'}
                {generatedReport.type === 'shift-analysis' && 'Shift Analysis Report'}
                {generatedReport.type === 'station-performance' && 'Station Performance Report'}
              </h4>
              <button 
                onClick={() => setGeneratedReport(null)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Close Report
              </button>
            </div>
            
            {/* Report content would be rendered here based on report type */}
            <div style={{ color: 'white' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {JSON.stringify(generatedReport, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Input Data Modal */}
      {showInputModal && (
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
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            borderRadius: '16px',
            padding: '30px',
            width: '95%',
            maxWidth: '800px',
            maxHeight: '90vh',
            border: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
              flexShrink: 0
            }}>
              <h3 style={{ margin: 0, color: 'white' }}>Add Shift Performance Data</h3>
              <button 
                onClick={() => setShowInputModal(false)}
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

            {/* Scrollable Content */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              paddingRight: '10px',
              marginRight: '-10px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Bartender *
                  </label>
                  <select
                    value={inputForm.bartenderEmail}
                    onChange={(e) => handleInputChange('bartenderEmail', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    required
                  >
                    <option value="">Select Bartender</option>
                    {bartenders.map(bartender => (
                      <option key={bartender.email} value={bartender.email}>
                        {bartender.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={inputForm.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Shift Day *
                  </label>
                  <select
                    value={inputForm.shiftDay}
                    onChange={(e) => handleInputChange('shiftDay', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    required
                  >
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Shift Type *
                  </label>
                  <select
                    value={inputForm.shiftType}
                    onChange={(e) => handleInputChange('shiftType', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    required
                  >
                    <option value="day">Day Shift</option>
                    <option value="night">Night Shift</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Station *
                  </label>
                  <select
                    value={inputForm.station}
                    onChange={(e) => handleInputChange('station', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    required
                  >
                    <option value="Main Bar">Main Bar</option>
                    <option value="Service Bar">Service Bar</option>
                    <option value="Patio Bar">Patio Bar</option>
                    <option value="VIP Bar">VIP Bar</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Shift Sales ($) *
                  </label>
                  <input
                    type="number"
                    value={inputForm.shiftSales}
                    onChange={(e) => handleInputChange('shiftSales', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Check Average ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputForm.checkAverage}
                    onChange={(e) => handleInputChange('checkAverage', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Total Checks *
                  </label>
                  <input
                    type="number"
                    value={inputForm.totalChecks}
                    onChange={(e) => handleInputChange('totalChecks', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                    Specials Sold
                  </label>
                  <input
                    type="number"
                    value={inputForm.specialsSold}
                    onChange={(e) => handleInputChange('specialsSold', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                  Notes
                </label>
                <textarea
                  value={inputForm.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                  placeholder="Additional notes about this shift..."
                />
              </div>
            </div>

            {/* Modal Footer with Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end', 
              marginTop: '25px',
              paddingTop: '15px',
              borderTop: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
              flexShrink: 0
            }}>
              <button 
                onClick={() => setShowInputModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={submitPerformanceData}
                disabled={!inputForm.bartenderEmail || !inputForm.shiftSales || !inputForm.checkAverage || !inputForm.totalChecks}
                style={{
                  background: inputForm.bartenderEmail && inputForm.shiftSales && inputForm.checkAverage && inputForm.totalChecks 
                    ? SECTION_COLOR 
                    : 'rgba(59, 130, 246, 0.5)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: inputForm.bartenderEmail && inputForm.shiftSales && inputForm.checkAverage && inputForm.totalChecks 
                    ? 'pointer' 
                    : 'not-allowed',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Save Shift Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
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
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            borderRadius: '16px',
            padding: '30px',
            width: '95%',
            maxWidth: '600px',
            border: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`
            }}>
              <h3 style={{ margin: 0, color: 'white' }}>Generate Performance Report</h3>
              <button 
                onClick={() => setShowReportModal(false)}
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

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                Report Type *
              </label>
              <select
                value={reportConfig.type}
                onChange={(e) => setReportConfig(prev => ({ ...prev, type: e.target.value as ReportType }))}
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                }}
                required
              >
                <option value="sales-summary">Sales Summary</option>
                <option value="performance-comparison">Performance Comparison</option>
                <option value="shift-analysis">Shift Analysis</option>
                <option value="station-performance">Station Performance</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={reportConfig.dateRange.start}
                  onChange={(e) => setReportConfig(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                  End Date *
                </label>
                <input
                  type="date"
                  value={reportConfig.dateRange.end}
                  onChange={(e) => setReportConfig(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
                Filter by Bartender
              </label>
              <select
                multiple
                value={reportConfig.bartenders}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setReportConfig(prev => ({ ...prev, bartenders: selected }));
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  minHeight: '120px'
                }}
              >
                <option value="">All Bartenders</option>
                {bartenders.map(bartender => (
                  <option key={bartender.email} value={bartender.email}>
                    {bartender.name}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '5px' }}>
                Hold Ctrl/Cmd to select multiple bartenders
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '25px' }}>
              <button 
                onClick={() => setShowReportModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={generateReport}
                style={{
                  background: SECTION_COLOR,
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}