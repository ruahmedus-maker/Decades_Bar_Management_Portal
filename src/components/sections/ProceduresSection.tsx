import { useEffect, useState, useCallback, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { ChecklistItem } from '@/types';

// Define the new color theme - Soft Coral Purple
const SECTION_COLOR = '#D4A5A5'; // Soft coral
const SECTION_COLOR_RGB = '212, 165, 165';
const ACCENT_COLOR = '#9F86C0'; // Soft purple
const ACCENT_COLOR_RGB = '159, 134, 192';

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

// Manager email configuration
const MANAGER_EMAILS = [
  'manager@yourbar.com',
  'assistantmanager@yourbar.com'
];

// Notification service
class NotificationService {
  // Send email notification to managers
  static async sendEmailNotification(bartenderName: string, bartenderEmail: string, timestamp: string) {
    try {
      // In production, this would call your backend API
      const emailData = {
        to: MANAGER_EMAILS,
        subject: `🚨 Bartender Ready for Checkout - ${bartenderName}`,
        body: `
          Bartender Checkout Request
          
          Bartender: ${bartenderName}
          Email: ${bartenderEmail}
          Time: ${timestamp}
          
          ${bartenderName} has completed all closing procedures and is ready for checkout.
          
          Please proceed with the final count and approval.
          
          Sent from Bar Management System
        `,
        timestamp
      };

      console.log('📧 Email notification payload:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, uncomment this:
      /*
      const response = await fetch('/api/send-checkout-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      if (!response.ok) throw new Error('Email sending failed');
      */
      
      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  // Send push notification (for web browsers)
  static async sendPushNotification(bartenderName: string, bartenderEmail: string, timestamp: string) {
    try {
      // Check if push notifications are supported
      if (!('Notification' in window)) {
        console.log('Push notifications not supported in this browser');
        return false;
      }

      // Request permission for notifications
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission denied');
          return false;
        }
      }

      if (Notification.permission === 'granted') {
        // Create browser notification with supported properties only
        const notification = new Notification('🚨 Bartender Ready for Checkout', {
          body: `${bartenderName} has completed closing procedures and is ready for checkout.`,
          icon: '/icon-192x192.png', // Your app icon
          tag: 'checkout-request'
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto-close after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Push notification failed:', error);
      return false;
    }
  }

  // Mobile push notification (for React Native/Expo) - Ready for future use
  static async sendMobilePushNotification(expoPushToken: string, bartenderName: string) {
    try {
      // This would be used in your mobile app
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: '🚨 Bartender Ready for Checkout',
        body: `${bartenderName} has completed closing procedures.`,
        data: { 
          type: 'checkout_request',
          bartenderName,
          timestamp: new Date().toISOString()
        },
      };

      console.log('📱 Mobile push notification payload:', message);
      
      // In production, this would call your push notification service
      /*
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      */
      
      return true;
    } catch (error) {
      console.error('Mobile push notification failed:', error);
      return false;
    }
  }

  // Send all notifications
  static async sendAllNotifications(bartenderName: string, bartenderEmail: string) {
    const timestamp = new Date().toLocaleString();
    
    const results = await Promise.allSettled([
      this.sendEmailNotification(bartenderName, bartenderEmail, timestamp),
      this.sendPushNotification(bartenderName, bartenderEmail, timestamp)
    ]);

    const emailSuccess = results[0].status === 'fulfilled' && results[0].value;
    const pushSuccess = results[1].status === 'fulfilled' && results[1].value;

    return {
      email: emailSuccess,
      push: pushSuccess,
      timestamp
    };
  }
}

export default function StandardOperatingProceduresSection() {
  const { currentUser, showToast } = useApp();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isReadyForCheckout, setIsReadyForCheckout] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Track section visit when currentUser is available
  useEffect(() => {
    if (!currentUser) return;

    // Wait 60 seconds then mark as complete
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'procedures', 60);
      console.log('Section auto-completed after 60 seconds');
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentUser]);

  // Load checklist on component mount with loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setChecklist(DEFAULT_CHECKLIST);
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Check notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
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
    setIsReadyForCheckout(false);
    showToast('🔄 Checklist reset!');
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

  // Check if closing procedures are complete
  const isClosingComplete = useCallback(() => {
    const closingItems = getCategoryItems('closing');
    return closingItems.length > 0 && closingItems.every(item => item.completed);
  }, [getCategoryItems]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      showToast('⚠️ Push notifications not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      setNotificationPermission('granted');
      return true;
    }

    if (Notification.permission === 'denied') {
      showToast('⚠️ Notifications blocked. Please enable them in browser settings.');
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      showToast('✅ Push notifications enabled!');
      return true;
    } else {
      showToast('ℹ️ Push notifications disabled. You will still receive email notifications.');
      return false;
    }
  }, [showToast]);

  // Handle ready for checkout notification
  const handleReadyForCheckout = useCallback(async () => {
    if (!isClosingComplete()) {
      showToast('⚠️ Please complete all closing procedures first!');
      return;
    }

    if (!currentUser) {
      showToast('❌ Please log in to request checkout');
      return;
    }

    setIsSendingNotification(true);
    
    try {
      // Send all notifications
      const results = await NotificationService.sendAllNotifications(
        currentUser.name || 'Bartender',
        currentUser.email
      );

      setIsReadyForCheckout(true);
      
      // Show success message based on which notifications worked
      if (results.email && results.push) {
        showToast('✅ Managers notified via email and push! You are ready for checkout.');
      } else if (results.email) {
        showToast('✅ Managers notified via email! You are ready for checkout.');
      } else if (results.push) {
        showToast('✅ Push notification sent! You are ready for checkout.');
      } else {
        showToast('⚠️ Checkout recorded, but failed to send notifications. Please inform manager directly.');
      }

      // Log for audit
      console.log(`🚨 Checkout Request: ${currentUser.email} at ${results.timestamp}`);
      console.log(`📧 Email: ${results.email ? '✅' : '❌'} | 📱 Push: ${results.push ? '✅' : '❌'}`);
      
      // Simulate manager acknowledgment after 3 seconds
      setTimeout(() => {
        showToast('ℹ️ Manager has acknowledged your checkout request.');
      }, 3000);

    } catch (error) {
      console.error('Checkout notification failed:', error);
      showToast('❌ Failed to send checkout notification. Please try again.');
    } finally {
      setIsSendingNotification(false);
    }
  }, [isClosingComplete, showToast, currentUser]);

  // Memoize filtered items to prevent unnecessary recalculations
  const filteredItems = getCategoryItems(activeCategory);
  const completedCount = getCompletedCount();
  const progressPercentage = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;
  const closingComplete = isClosingComplete();

  // Base glass styles with coral purple theme
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    color: 'white',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Main container style
  const mainContainerStyle = {
    ...glassStyle,
    marginBottom: '25px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  };

  const headerStyle = {
    background: `linear-gradient(135deg, rgba(${ACCENT_COLOR_RGB}, 0.3), rgba(${SECTION_COLOR_RGB}, 0.2))`,
    padding: '16px 20px',
    borderBottom: `1px solid rgba(${ACCENT_COLOR_RGB}, 0.3)`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const getCategoryButtonStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: isActive ? `rgba(${ACCENT_COLOR_RGB}, 0.2)` : 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    borderColor: isActive ? `rgba(${ACCENT_COLOR_RGB}, 0.4)` : 'rgba(255, 255, 255, 0.2)'
  });

  const getChecklistItemStyle = (completed: boolean) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px',
    background: completed ? 'rgba(56, 161, 105, 0.15)' : 'rgba(255, 255, 255, 0.06)',
    border: completed ? '1px solid rgba(56, 161, 105, 0.3)' : '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.9)'
  });

  if (isLoading) {
    return (
      <div style={mainContainerStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: 700,
                margin: 0,
              }}>
                Standard Operating Procedures
              </h3>
              <p style={{ 
                margin: 0, 
                opacity: 0.9, 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '0.9rem',
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
    >
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.3rem',
              fontWeight: 700,
              margin: 0,
            }}>
              Standard Operating Procedures
            </h3>
            <p style={{ 
              margin: 0, 
              opacity: 0.9, 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '0.9rem',
              marginTop: '4px'
            }}>
              Checklist for all staff - follow carefully
            </p>
          </div>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.15)', 
            padding: '6px 12px', 
            borderRadius: '16px', 
            fontSize: '0.85rem', 
            color: 'white', 
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {completedCount} / {checklist.length} Completed
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ margin: '16px 0', padding: '0 20px' }}>
        <div style={{
          height: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '5px',
          overflow: 'hidden',
          marginBottom: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div 
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${ACCENT_COLOR}, #B8A1CC)`,
              width: `${progressPercentage}%`,
              transition: 'width 0.3s ease',
            }}
          ></div>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '6px', margin: '16px', flexWrap: 'wrap' }}>
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            style={getCategoryButtonStyle(activeCategory === category.id)}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', margin: '16px', flexWrap: 'wrap' }}>
        <button 
          onClick={resetChecklist}
          style={{
            background: `linear-gradient(135deg, ${SECTION_COLOR}, #C89595)`,
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem'
          }}
        >
          <span>🔄</span>
          Reset Checklist
        </button>
        <button 
          onClick={() => showToast('💾 Checklist progress saved!')}
          style={{
            background: `linear-gradient(135deg, ${ACCENT_COLOR}, #8E7CB0)`,
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem'
          }}
        >
          <span>💾</span>
          Save Progress
        </button>
        
        {/* Notification Permission Button */}
        {notificationPermission !== 'granted' && (
          <button 
            onClick={requestNotificationPermission}
            style={{
              background: `linear-gradient(135deg, #FFA726, #FB8C00)`,
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <span>🔔</span>
            Enable Notifications
          </button>
        )}
        
        {/* Ready for Checkout Button */}
        <button 
          onClick={handleReadyForCheckout}
          disabled={!closingComplete || isReadyForCheckout || isSendingNotification}
          style={{
            background: closingComplete && !isReadyForCheckout && !isSendingNotification
              ? `linear-gradient(135deg, #4CAF50, #45a049)`
              : `linear-gradient(135deg, #666, #777)`,
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: closingComplete && !isReadyForCheckout && !isSendingNotification ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            opacity: closingComplete && !isReadyForCheckout && !isSendingNotification ? 1 : 0.6
          }}
        >
          <span>
            {isSendingNotification ? '⏳' : isReadyForCheckout ? '✅' : '🔔'}
          </span>
          {isSendingNotification ? 'Sending...' : isReadyForCheckout ? 'Manager Notified' : 'Ready for Checkout'}
        </button>
      </div>

      {/* Checkout Status Indicator */}
      {isReadyForCheckout && (
        <div style={{
          background: `linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.1))`,
          border: `1px solid rgba(76, 175, 80, 0.3)`,
          borderRadius: '12px',
          overflow: 'hidden',
          margin: '16px',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              background: '#4CAF50',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              ✅
            </div>
            <div>
              <h4 style={{
                margin: 0,
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Ready for Manager Checkout
              </h4>
              <p style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.85rem',
                marginTop: '4px'
              }}>
                Managers have been notified via email and push notifications.
              </p>
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <strong>Next Steps:</strong> Please wait for a manager to complete your final count and approval. 
            You will receive confirmation when checkout is complete.
          </div>
        </div>
      )}

      {/* Notification Setup Reminder */}
      {!isReadyForCheckout && closingComplete && (
        <div style={{
          background: `linear-gradient(135deg, rgba(${ACCENT_COLOR_RGB}, 0.15), rgba(${SECTION_COLOR_RGB}, 0.1))`,
          border: `1px solid rgba(${ACCENT_COLOR_RGB}, 0.3)`,
          borderRadius: '12px',
          margin: '16px',
          padding: '16px',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>📢</span>
            <strong>Notification System Active</strong>
          </div>
          <p style={{ margin: 0, lineHeight: 1.4 }}>
            When you click "Ready for Checkout", managers will be notified via:
          </p>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>📧 Email notification to all managers</li>
            <li>📱 Browser push notifications {notificationPermission === 'granted' ? '(✅ Enabled)' : '(❌ Click "Enable Notifications")'}</li>
          </ul>
        </div>
      )}

      {/* Important Notice */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${ACCENT_COLOR_RGB}, 0.2), rgba(${SECTION_COLOR_RGB}, 0.1))`,
        border: `1px solid rgba(${ACCENT_COLOR_RGB}, 0.3)`,
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '20px',
        margin: '16px'
      }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${ACCENT_COLOR_RGB}, 0.25), rgba(${SECTION_COLOR_RGB}, 0.15))`,
          padding: '14px 20px',
          borderBottom: `1px solid rgba(${ACCENT_COLOR_RGB}, 0.3)`,
        }}>
          <h4 style={{
            margin: 0,
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 700,
          }}>⚠️ Bank & Cash Handling Notice</h4>
        </div>
        <div style={{
          padding: '16px 20px',
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '0.95rem',
          lineHeight: 1.5
        }}>
          <p>
            <strong style={{ color: ACCENT_COLOR, fontWeight: 700 }}>Important:</strong> Banks must be counted before each shift. You are financially responsible for counterfeit bills. 
            Counterfeit pens must be returned with bank bag - $5 replacement fee applies if missing.
          </p>
        </div>
      </div>

      {/* Checklist Items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
        margin: '16px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{
              color: '#ffffff',
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: 600
            }}>{getCategoryName(activeCategory)}</h4>
            <span style={{
              background: `linear-gradient(135deg, ${ACCENT_COLOR}, #8E7CB0)`,
              color: 'white',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}>
              {filteredItems.length} items
            </span>
          </div>
          <div style={{ padding: '16px' }}>
            {filteredItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic', padding: '16px' }}>
                No items found for this category.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    style={getChecklistItemStyle(item.completed)}
                    onClick={(e) => toggleChecklistItem(item.id, e)}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      onClick={(e) => e.stopPropagation()} // Prevent double trigger
                      style={{
                        marginTop: '2px',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                        accentColor: ACCENT_COLOR
                      }}
                    />
                    <span style={{ 
                      flex: 1, 
                      lineHeight: 1.4, 
                      fontSize: '0.9rem',
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
      <div style={glassStyle}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h4 style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 600
          }}>💰 Bank Quick Reference</h4>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h5 style={{
                color: ACCENT_COLOR,
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontWeight: 600
              }}>Standard Bank:</h5>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  2 × $100 in $1 bills ($200)
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  1 × $100 in $5 bills ($100)
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  <strong style={{ color: ACCENT_COLOR }}>Total: $300</strong>
                </li>
              </ul>
            </div>
            <div>
              <h5 style={{
                color: ACCENT_COLOR,
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontWeight: 600
              }}>Bank Contents:</h5>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  Cash (as above)
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  Counterfeit pen
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  Card reader cleaner
                </li>
              </ul>
            </div>
            <div>
              <h5 style={{
                color: ACCENT_COLOR,
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontWeight: 600
              }}>Important:</h5>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  Count bank before shift
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  Report discrepancies immediately
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  You're responsible for counterfeits
                </li>
                <li style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}>
                  $5 pen replacement fee
                </li>
              </ul>
            </div>
          </div>
          
          {/* New section for bank rebuilding instructions */}
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.15), rgba(${ACCENT_COLOR_RGB}, 0.1))`,
            border: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
            borderRadius: '8px'
          }}>
            <h5 style={{
              color: ACCENT_COLOR,
              margin: '0 0 10px 0',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>🔄</span>
              Bank Rebuilding Instructions
            </h5>
            <p style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.85rem',
              lineHeight: 1.5
            }}>
              <strong>Note:</strong> When rebuilding your bank, please don't mix larger bills within the $1 bands. 
              Instead, place larger bills ($5, $10, $20) on the outside of the band for proper organization and easy counting.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <ProgressSection />
      </div>
    </div>
  );
}