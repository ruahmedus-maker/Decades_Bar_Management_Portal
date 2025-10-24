import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';
import { ChecklistItem } from '@/types';

export default function StandardOperatingProceduresSection() {
  const { currentUser, showToast } = useApp();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, 'procedures');
    }
  }, [currentUser]);

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = () => {
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
    <div className="section active" id="procedures">
      <div className="section-header">
        <div className="header-content">
          <div>
            <h3>Standard Operating Procedures</h3>
            <p className="section-subtitle">Checklist for all staff - follow carefully</p>
          </div>
          <div className="progress-badge">
            {getCompletedCount()} / {checklist.length} Completed
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(getCompletedCount() / checklist.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`category-filter ${activeCategory === category.id ? 'active' : ''}`}
          >
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-label">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={resetChecklist}>
          <span className="btn-icon">🔄</span>
          Reset Checklist
        </button>
        <button 
          className="btn login-btn" 
          onClick={() => showToast('Checklist progress saved!')}
        >
          <span className="btn-icon">💾</span>
          Save Progress
        </button>
      </div>

      {/* Important Notice */}
      <div className="card policy-notice">
        <div className="policy-header">
          <h4>⚠️ Bank & Cash Handling Notice</h4>
        </div>
        <div className="policy-content">
          <p>
            <strong>Important:</strong> Banks must be counted before each shift. You are financially responsible for counterfeit bills. 
            Counterfeit pens must be returned with bank bag - $5 replacement fee applies if missing.
          </p>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h4>{getCategoryName(activeCategory)}</h4>
            <span className="badge">
              {filteredItems.length} items
            </span>
          </div>
          <div className="card-body">
            {filteredItems.length === 0 ? (
              <p className="no-items">No items found for this category.</p>
            ) : (
              <div className="checklist-container">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={`checklist-item ${item.completed ? 'completed' : ''}`}
                    onClick={() => toggleChecklistItem(item.id)}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="checklist-checkbox"
                    />
                    <span className="checklist-text">
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
      <div className="card quick-reference-card">
        <div className="card-header">
          <h4>💰 Bank Quick Reference</h4>
        </div>
        <div className="card-body">
          <div className="reference-grid">
            <div className="reference-item">
              <h5>Standard Bank:</h5>
              <ul>
                <li>2 × $100 in $1 bills ($200)</li>
                <li>1 × $100 in $5 bills ($100)</li>
                <li><strong>Total: $300</strong></li>
              </ul>
            </div>
            <div className="reference-item">
              <h5>Bank Contents:</h5>
              <ul>
                <li>Cash (as above)</li>
                <li>Counterfeit pen</li>
                <li>Card reader cleaner</li>
              </ul>
            </div>
            <div className="reference-item">
              <h5>Important:</h5>
              <ul>
                <li>Count bank before shift</li>
                <li>Report discrepancies immediately</li>
                <li>You're responsible for counterfeits</li>
                <li>$5 pen replacement fee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ProgressSection />
    </div>
  );
}