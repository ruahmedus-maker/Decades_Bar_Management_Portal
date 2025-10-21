import { useEffect, useState } from 'react'; // Add this if not present
import { useApp } from '@/contexts/AppContext'; // Add this if not present
import ProgressSection from '../ProgressSection'; // Adjust path if necessary
import { trackSectionVisit } from '@/lib/progress'; // Add this import
import { ChecklistItem } from '@/types';


 export default function StandardOperatingProceduresSection() {
  const { currentUser, showToast } = useApp();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

   useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'welcome');
    }
  }, [currentUser]);



  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = () => {
    // In a real app, this would come from your database
    const defaultChecklist: ChecklistItem[] = [
      // Opening Procedures
      { id: '1', text: 'Arrive 15 minutes before scheduled shift time', completed: false, category: 'opening' },
      { id: '2', text: 'Clock in using the POS system', completed: false, category: 'opening' },
      { id: '3', text: 'Check daily specials and event board', completed: false, category: 'opening' },
      { id: '4', text: 'Review reservation list and any special requests', completed: false, category: 'opening' },
      { id: '5', text: 'Set up station with necessary equipment', completed: false, category: 'opening' },
      
      // Bank Counting & Verification
      { id: 'bank-1', text: 'Collect bank bag from office/safe', completed: false, category: 'bank' },
      { id: 'bank-2', text: 'Count $1 bills: 2 bands of $100 ($200 total)', completed: false, category: 'bank' },
      { id: 'bank-3', text: 'Count $5 bills: 1 band of $100 ($100 total)', completed: false, category: 'bank' },
      { id: 'bank-4', text: 'Verify total bank amount: $300', completed: false, category: 'bank' },
      { id: 'bank-5', text: 'Report any discrepancies to office immediately', completed: false, category: 'bank' },
      { id: 'bank-6', text: 'Verify counterfeit pen is in bank bag', completed: false, category: 'bank' },
      { id: 'bank-7', text: 'Use card reader cleaner before shift start', completed: false, category: 'bank' },
      
      // Cash Handling Procedures
      { id: 'cash-1', text: 'Use counterfeit pen on all $20+ bills received', completed: false, category: 'cash' },
      { id: 'cash-2', text: 'Check for security features: watermark, security strip', completed: false, category: 'cash' },
      { id: 'cash-3', text: 'Verify larger bills with black light feature', completed: false, category: 'cash' },
      { id: 'cash-4', text: 'Place bills in register in organized manner', completed: false, category: 'cash' },
      { id: 'cash-5', text: 'Remember: You are financially responsible for counterfeit bills', completed: false, category: 'cash' },
      { id: 'cash-6', text: 'Ensure counterfeit pen is returned with bank bag', completed: false, category: 'cash' },
      
      // During Shift
      { id: 'shift-1', text: 'Maintain clean and organized work area', completed: false, category: 'during-shift' },
      { id: 'shift-2', text: 'Follow proper pouring and serving procedures', completed: false, category: 'during-shift' },
      { id: 'shift-3', text: 'Upsell featured cocktails and promotions', completed: false, category: 'during-shift' },
      { id: 'shift-4', text: 'Check ID for all guests who appear under 30', completed: false, category: 'during-shift' },
      { id: 'shift-5', text: 'Follow responsible alcohol service guidelines', completed: false, category: 'during-shift' },
      
      // Closing Procedures
      { id: 'close-1', text: 'Count register drawer and prepare deposit', completed: false, category: 'closing' },
      { id: 'close-2', text: 'Complete end-of-shift report in POS system', completed: false, category: 'closing' },
      { id: 'close-3', text: 'Clean all work surfaces and equipment', completed: false, category: 'closing' },
      { id: 'close-4', text: 'Restock supplies for next shift', completed: false, category: 'closing' },
      { id: 'close-5', text: 'Return bank bag with all contents to office', completed: false, category: 'closing' },
      { id: 'close-6', text: 'Verify counterfeit pen is returned ($5 fee if missing)', completed: false, category: 'closing' },
      { id: 'close-7', text: 'Clock out and report any issues to manager', completed: false, category: 'closing' },
    ];
    
    setChecklist(defaultChecklist);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const resetChecklist = () => {
    setChecklist(prev => prev.map(item => ({ ...item, completed: false })));
    showToast('Checklist reset!');
  };

  const getCompletedCount = () => {
    return checklist.filter(item => item.completed).length;
  };

  const getCategoryItems = (category: string) => {
    if (category === 'all') return checklist;
    return checklist.filter(item => item.category === category);
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      'all': 'All Procedures',
      'opening': 'Opening Procedures',
      'bank': 'Bank Counting',
      'cash': 'Cash Handling',
      'during-shift': 'During Shift',
      'closing': 'Closing Procedures'
    };
    return names[category] || category;
  };

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'opening', label: 'Opening', icon: '🔓' },
    { id: 'bank', label: 'Bank', icon: '💰' },
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'during-shift', label: 'During Shift', icon: '🍸' },
    { id: 'closing', label: 'Closing', icon: '🔒' }
  ];

  const filteredItems = getCategoryItems(activeCategory);

  return (
    <div className="section active">
      <div className="section-header" style={{ 
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Standard Operating Procedures</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Checklist for all staff - follow carefully</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              {getCompletedCount()} / {checklist.length} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        background: '#e2e8f0', 
        borderRadius: '10px', 
        height: '8px', 
        margin: '15px 0',
        overflow: 'hidden'
      }}>
        <div style={{ 
          background: 'linear-gradient(90deg, #48bb78, #38a169)',
          height: '100%', 
          width: `${(getCompletedCount() / checklist.length) * 100}%`,
          transition: 'width 0.3s ease',
          borderRadius: '10px'
        }}></div>
      </div>

      {/* Category Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeCategory === category.id ? '#d4af37' : '#f7fafc',
              color: activeCategory === category.id ? 'white' : '#4a5568',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className="btn"
          onClick={resetChecklist}
          style={{ 
            background: '#e53e3e', 
            color: 'white',
            fontSize: '0.9rem'
          }}
        >
          🔄 Reset Checklist
        </button>
        <button 
          className="btn"
          onClick={() => showToast('Checklist progress saved!')}
          style={{ 
            background: '#3182ce', 
            color: 'white',
            fontSize: '0.9rem'
          }}
        >
          💾 Save Progress
        </button>
      </div>

      {/* Important Notice */}
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong>Bank & Cash Handling Notice:</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
              Banks must be counted before each shift. You are financially responsible for counterfeit bills. 
              Counterfeit pens must be returned with bank bag - $5 replacement fee applies if missing.
            </p>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>{getCategoryName(activeCategory)}</h4>
            <span style={{ 
              padding: '4px 12px', 
              background: '#edf2f7', 
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {filteredItems.length} items
            </span>
          </div>
          <div className="card-body">
            {filteredItems.length === 0 ? (
              <p>No items found for this category.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      background: item.completed ? '#f0fff4' : '#f8f9fa',
                      border: `1px solid ${item.completed ? '#c6f6d5' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      style={{
                        marginTop: '2px',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        textDecoration: item.completed ? 'line-through' : 'none',
                        color: item.completed ? '#718096' : '#2d3748',
                        fontSize: '0.95rem',
                        lineHeight: '1.4'
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Reference Card */}
      <div className="card" style={{ marginTop: '20px', background: '#f8f9fa' }}>
        <div className="card-header">
          <h4>💰 Bank Quick Reference</h4>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Standard Bank:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>2 × $100 in $1 bills ($200)</li>
                <li>1 × $100 in $5 bills ($100)</li>
                <li><strong>Total: $300</strong></li>
              </ul>
            </div>
            <div>
              <strong>Bank Contents:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Cash (as above)</li>
                <li>Counterfeit pen</li>
                <li>Card reader cleaner</li>
              </ul>
            </div>
            <div>
              <strong>Important:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Count bank before shift</li>
                <li>Report discrepancies immediately</li>
                <li>You're responsible for counterfeits</li>
                <li>$5 pen replacement fee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
