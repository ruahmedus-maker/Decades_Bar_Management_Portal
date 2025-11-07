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
  shiftTypes: ('day' | 'night')[];
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
  station: "2000's Main Bar", // Updated default
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
  shiftTypes: ['day', 'night']
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

  const deletePerformanceData = (id: string) => {
  if (window.confirm('Are you sure you want to delete this shift data? This action cannot be undone.')) {
    setPerformanceData(prev => prev.filter(data => data.id !== id));
    showToast('Shift data deleted successfully!');
  }
};

  const generateReport = () => {
  const filteredData = performanceData.filter(entry => {
    const entryDate = new Date(entry.date);
    const startDate = new Date(reportConfig.dateRange.start);
    const endDate = new Date(reportConfig.dateRange.end);
    
    return entryDate >= startDate && entryDate <= endDate &&
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
            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {performanceData.slice(-5).reverse().map((data, index) => (
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
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button 
                  onClick={() => deletePerformanceData(data.id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                  title="Delete this shift record"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

 {/* Generated Report Display - VISUAL UI */}
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
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          fontSize: '0.9rem',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          {new Date(generatedReport.period.start).toLocaleDateString()} - {new Date(generatedReport.period.end).toLocaleDateString()}
        </span>
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
    </div>
    
    {/* Custom UI for each report type */}
    {generatedReport.type === 'sales-summary' && (
      <div style={{ color: 'white' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Total Sales</p>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
              ${generatedReport.totalSales.toLocaleString()}
            </h3>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Average Check</p>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
              ${generatedReport.averageCheck.toFixed(2)}
            </h3>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Total Checks</p>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
              {generatedReport.totalChecks}
            </h3>
          </div>
          <div style={{
            background: 'rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Shifts Analyzed</p>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
              {generatedReport.dataCount}
            </h3>
          </div>
        </div>

        {generatedReport.salesByDay && Object.keys(generatedReport.salesByDay).length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h5 style={{ color: 'white', marginBottom: '15px' }}>Sales by Day</h5>
            <div style={{ display: 'grid', gap: '10px' }}>
              {Object.entries(generatedReport.salesByDay).map(([day, sales]) => (
                <div key={day} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '15px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: 'white', 
                    textTransform: 'capitalize',
                    fontWeight: '600'
                  }}>
                    {day}
                  </span>
                  <span style={{ 
                    color: '#10B981',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    ${(sales as number).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    {generatedReport.type === 'performance-comparison' && (
      <div style={{ color: 'white' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Bartender</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Total Sales</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Avg Check</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Shifts Worked</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Performance Score</th>
              </tr>
            </thead>
            <tbody>
              {generatedReport.bartenderPerformance.map((bartender: any, index: number) => (
                <tr 
                  key={bartender.bartender}
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '12px', fontWeight: '600' }}>{bartender.bartender}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>${bartender.totalSales.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>${bartender.averageCheck.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{bartender.shiftsWorked}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{
                      background: bartender.performanceScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : 
                                 bartender.performanceScore >= 60 ? 'rgba(245, 158, 11, 0.3)' : 
                                 'rgba(239, 68, 68, 0.3)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      {bartender.performanceScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {generatedReport.type === 'shift-analysis' && (
      <div style={{ color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          {Object.entries(generatedReport.shiftAnalysis).map(([shift, data]: [string, any]) => (
            <div key={shift} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h5 style={{ 
                margin: '0 0 15px 0', 
                color: 'white',
                textTransform: 'capitalize',
                fontSize: '1.1rem'
              }}>
                {shift.replace('-', ' ')} Shift
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Total Sales</p>
                  <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>${data.shiftSales.toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Avg Check</p>
                  <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>${data.averageCheck.toFixed(2)}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Total Checks</p>
                  <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>{data.totalChecks}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Shifts</p>
                  <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>{data.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {generatedReport.type === 'station-performance' && (
      <div style={{ color: 'white' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Station</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Total Sales</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Avg Check</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Total Checks</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Shifts</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(generatedReport.stationPerformance).map(([station, data]: [string, any], index) => (
                <tr 
                  key={station}
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '12px', fontWeight: '600' }}>{station}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>${data.totalSales.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>${data.averageCheck.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{data.totalChecks}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{data.shiftCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)}
      </div>
{/* Input Data Modal - FIXED LAYOUT */}
{showInputModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  }}>
    <div style={{
      background: 'rgba(30, 41, 59, 0.98)',
      borderRadius: '16px',
      padding: '30px',
      width: '95%',
      height: '95%',
      maxWidth: '1000px',
      border: `2px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Modal Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: `2px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
        flexShrink: 0
      }}>
        <div>
          <h3 style={{ margin: 0, color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
            Add Shift Performance Data
          </h3>
          <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
            Fill in all required fields to record shift performance
          </p>
        </div>
        <button 
          onClick={() => setShowInputModal(false)}
          style={{
            background: 'rgba(239, 68, 68, 0.3)',
            border: '1px solid rgba(239, 68, 68, 0.6)',
            color: 'white',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}
          title="Close without saving"
        >
          ×
        </button>
      </div>

      {/* Scrollable Content - Simplified Layout */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        paddingRight: '10px'
      }}>
        {/* First Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Bartender Selection */}
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
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
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

          {/* Date */}
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
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              required
            />
          </div>
        </div>

        {/* Second Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Shift Day */}
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
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              required
            >
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>

          {/* Shift Type */}
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
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              required
            >
              <option value="day">Day Shift</option>
              <option value="night">Night Shift</option>
            </select>
          </div>
        </div>

        {/* Third Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Station */}
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
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem'
  }}
  required
>
  <option value="2000's Main Bar">2000's Main Bar</option>
  <option value="2010's Side Bar">2010's Side Bar</option>
  <option value="2010's Main Bar">2010's Main Bar</option>
  <option value="2010's Back Bar">2010's Back Bar</option>
  <option value="Hip Hop Back Bar">Hip Hop Back Bar</option>
  <option value="Hip Hop Main Bar">Hip Hop Main Bar</option>
  <option value="Rooftop Main Bar">Rooftop Main Bar</option>
</select>
          </div>

          {/* Shift Sales */}
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
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Fourth Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Check Average */}
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
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              placeholder="0.00"
              required
            />
          </div>

          {/* Total Checks */}
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
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Fifth Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Specials Sold */}
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
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              placeholder="0"
            />
          </div>
          
          {/* Empty div for spacing */}
          <div></div>
        </div>

        {/* Notes Section - Full Width */}
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <label style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600' }}>
            Notes
          </label>
          <textarea
            value={inputForm.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            style={{ 
              width: '100%', 
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              resize: 'vertical',
              fontSize: '1rem'
            }}
            placeholder="Additional notes about this shift (special events, challenges, compliments, etc.)..."
          />
        </div>
      </div>

      {/* Fixed Footer with Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        justifyContent: 'flex-end', 
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: `2px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
        flexShrink: 0
      }}>
        <button 
          onClick={() => setShowInputModal(false)}
          style={{
            background: 'rgba(239, 68, 68, 0.3)',
            color: 'white',
            border: '1px solid rgba(239, 68, 68, 0.6)',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            minWidth: '120px'
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
              : 'rgba(59, 130, 246, 0.4)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: inputForm.bartenderEmail && inputForm.shiftSales && inputForm.checkAverage && inputForm.totalChecks 
              ? 'pointer' 
              : 'not-allowed',
            fontWeight: '600',
            fontSize: '1rem',
            minWidth: '150px'
          }}
        >
          Save Shift Data
        </button>
      </div>
    </div>
  </div>
)}
{/* Report Generation Modal - SIMPLIFIED */}
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
      maxWidth: '500px',
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

      <div style={{ marginBottom: '20px' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
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