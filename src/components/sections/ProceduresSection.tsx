import { useEffect, useState, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';
import { ChecklistItem } from '@/types';

// Move static data outside component to prevent recreation on every render
const DEFAULT_CHECKLIST: ChecklistItem[] = [
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

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'opening', label: 'Opening', icon: '🔓' },
  { id: 'bank', label: 'Bank', icon: '💰' },
  { id: 'cash', label: 'Cash', icon: '💵' },
  { id: 'during-shift', label: 'During Shift', icon: '🍸' },
  { id: 'closing', label: 'Closing', icon: '🔒' }
];

const CATEGORY_NAMES: { [key: string]: string } = {
  'all': 'All Procedures',
  'opening': 'Opening Procedures',
  'bank': 'Bank Counting',
  'cash': 'Cash Handling',
  'during-shift': 'During Shift',
  'closing': 'Closing Procedures'
};

export default function StandardOperatingProceduresSection() {
  const { currentUser, showToast } = useApp();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isQuickRefHovered, setIsQuickRefHovered] = useState(false);

  // Track section visit when currentUser is available
  useEffect(() => {
    if (currentUser?.email) {
      trackSectionVisit(currentUser.email, 'procedures');
    }
  }, [currentUser]);

  // Load checklist on component mount with loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setChecklist(DEFAULT_CHECKLIST);
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Fixed toggle function with proper event handling
  const toggleChecklistItem = useCallback((id: string, event?: React.MouseEvent) => {
    // Prevent event bubbling to avoid multiple triggers
    event?.stopPropagation();
    
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, []);

  const resetChecklist = useCallback(() => {
    setChecklist(prev => prev.map(item => ({ ...item, completed: false })));
    showToast('Checklist reset!');
  }, [showToast]);

  const getCompletedCount = useCallback(() => {
    return checklist.filter(item => item.completed).length;
  }, [checklist]);

  const getCategoryItems = useCallback((category: string) => {
    if (category === 'all') return checklist;
    return checklist.filter(item => item.category === category);
  }, [checklist]);

  const getCategoryName = useCallback((category: string) => {
    return CATEGORY_NAMES[category] || category;
  }, []);

  // Memoize filtered items to prevent unnecessary recalculations
  const filteredItems = getCategoryItems(activeCategory);
  const completedCount = getCompletedCount();
  const progressPercentage = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  // Base glass styles
  const glassStyle = {
    background: 'linear-gradient(135deg, rgba(74, 21, 75, 0.8), rgba(74, 21, 75, 0.95))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.22)',
    borderRadius: '20px',
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    transition: 'all 0.3s ease'
  };

  // Hover effects with deep purple glow
  const hoverGlowStyle = {
    border: '1px solid rgba(255, 127, 80, 0.6)',
    boxShadow: '0 0 30px rgba(74, 21, 75, 0.8), 0 0 50px rgba(255, 127, 80, 0.3)',
    transform: 'translateY(-2px)'
  };

  // Main container style
  const mainContainerStyle = {
    ...glassStyle,
    marginBottom: '30px',
    ...(isHeaderHovered && hoverGlowStyle)
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.15))',
    padding: '20px',
    borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const getCategoryButtonStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 18px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: isActive ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    borderColor: isActive ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.2)'
  });

  const getChecklistItemStyle = (completed: boolean) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px',
    background: completed ? 'rgba(56, 161, 105, 0.15)' : 'rgba(255, 255, 255, 0.08)',
    border: completed ? '1px solid rgba(56, 161, 105, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.9)'
  });

  // Quick reference card style with hover effect
  const quickRefStyle = {
    ...glassStyle,
    margin: '20px',
    marginTop: '20px',
    ...(isQuickRefHovered && hoverGlowStyle)
  };

  if (isLoading) {
    return (
      <div style={mainContainerStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.4rem',
                fontWeight: 700,
                margin: 0,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}>
                Standard Operating Procedures
              </h3>
              <p style={{ 
                margin: 0, 
                opacity: 0.9, 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '0.95rem',
                marginTop: '4px'
              }}>
                Loading checklist...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="active" 
      id="procedures"
      style={mainContainerStyle}
      onMouseEnter={() => setIsHeaderHovered(true)}
      onMouseLeave={() => setIsHeaderHovered(false)}
    >
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.4rem',
              fontWeight: 700,
              margin: 0,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Standard Operating Procedures
            </h3>
            <p style={{ 
              margin: 0, 
              opacity: 0.9, 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '0.95rem',
              marginTop: '4px'
            }}>
              Checklist for all staff - follow carefully
            </p>
          </div>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            fontSize: '0.9rem', 
            color: 'white', 
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {completedCount} / {checklist.length} Completed
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ margin: '20px 0', padding: '0 20px' }}>
        <div style={{
          height: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '15px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div 
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #38a169, #48bb78)',
              width: `${progressPercentage}%`,
              transition: 'width 0.5s ease',
              boxShadow: '0 2px 8px rgba(56, 161, 105, 0.4)'
            }}
          ></div>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '8px', margin: '20px', flexWrap: 'wrap' }}>
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            style={getCategoryButtonStyle(activeCategory === category.id)}
            onMouseEnter={(e) => {
              if (activeCategory !== category.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', margin: '20px', flexWrap: 'wrap' }}>
        <button 
          className="btn" 
          onClick={resetChecklist}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            fontSize: '0.9rem'
          }}
        >
          <span>🔄</span>
          Reset Checklist
        </button>
        <button 
          className="login-btn" 
          onClick={() => showToast('Checklist progress saved!')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            fontSize: '0.9rem'
          }}
        >
          <span>💾</span>
          Save Progress
        </button>
      </div>

      {/* Important Notice */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.1))',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '25px',
        backdropFilter: 'blur(15px) saturate(180%)',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
        margin: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.15))',
          padding: '18px 25px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{
            margin: 0,
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>⚠️ Bank & Cash Handling Notice</h4>
        </div>
        <div style={{
          padding: '25px',
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '1rem',
          lineHeight: 1.6
        }}>
          <p>
            <strong style={{ color: '#d4af37', fontWeight: 700 }}>Important:</strong> Banks must be counted before each shift. You are financially responsible for counterfeit bills. 
            Counterfeit pens must be returned with bank bag - $5 replacement fee applies if missing.
          </p>
        </div>
      </div>

      {/* Checklist Items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        margin: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px) saturate(160%)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{
              color: '#ffffff',
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: 600
            }}>{getCategoryName(activeCategory)}</h4>
            <span style={{
              background: 'linear-gradient(135deg, #d4af37, #c19b2a)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}>
              {filteredItems.length} items
            </span>
          </div>
          <div style={{ padding: '20px' }}>
            {filteredItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic', padding: '20px' }}>
                No items found for this category.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    style={getChecklistItemStyle(item.completed)}
                    onClick={(e) => toggleChecklistItem(item.id, e)}
                    onMouseEnter={(e) => {
                      if (!item.completed) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!item.completed) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      onClick={(e) => e.stopPropagation()} // Prevent double trigger
                      style={{
                        marginTop: '2px',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#d4af37'
                      }}
                    />
                    <span style={{ 
                      flex: 1, 
                      lineHeight: 1.5, 
                      fontSize: '0.95rem',
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.9)'
                    }}>
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
      <div 
        style={quickRefStyle}
        onMouseEnter={() => setIsQuickRefHovered(true)}
        onMouseLeave={() => setIsQuickRefHovered(false)}
      >
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h4 style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 600
          }}>💰 Bank Quick Reference</h4>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px'
          }}>
            <div>
              <h5 style={{
                color: '#d4af37',
                marginBottom: '12px',
                fontSize: '1rem',
                fontWeight: 600
              }}>Standard Bank:</h5>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  2 × $100 in $1 bills ($200)
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  1 × $100 in $5 bills ($100)
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  <strong style={{ color: '#d4af37' }}>Total: $300</strong>
                </li>
              </ul>
            </div>
            <div>
              <h5 style={{
                color: '#d4af37',
                marginBottom: '12px',
                fontSize: '1rem',
                fontWeight: 600
              }}>Bank Contents:</h5>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  Cash (as above)
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  Counterfeit pen
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  Card reader cleaner
                </li>
              </ul>
            </div>
            <div>
              <h5 style={{
                color: '#d4af37',
                marginBottom: '12px',
                fontSize: '1rem',
                fontWeight: 600
              }}>Important:</h5>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  Count bank before shift
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  Report discrepancies immediately
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  You're responsible for counterfeits
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                  fontSize: '0.9rem'
                }}>
                  $5 pen replacement fee
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ProgressSection />
    </div>
  );
}