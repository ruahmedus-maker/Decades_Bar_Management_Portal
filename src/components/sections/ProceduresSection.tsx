'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { ChecklistItem } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Move static data outside componen
const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: '1', text: 'Arrive on time for scheduled shift', completed: false, category: 'opening' },
  { id: '2', text: 'Clock in using the POS system', completed: false, category: 'opening' },
  { id: '3', text: 'Read shift notes and Bartender text threads for shift specials and updates', completed: false, category: 'opening' },
  { id: '4', text: 'Pre-shift if scheduled', completed: false, category: 'opening' },
  { id: '5', text: 'Collect bank bag from office', completed: false, category: 'opening' },
  { id: '6', text: 'Remove all caps from bottles', completed: false, category: 'opening' },
  { id: '7', text: 'Straight face all bottles on back bar and fill any gaps', completed: false, category: 'opening' },
  { id: '8', text: 'Set up your well', completed: false, category: 'opening' },
  { id: '9', text: 'Display menu tents on bar top', completed: false, category: 'opening' },
  { id: '10', text: 'Fill up squeeze bottles with juices/syrups', completed: false, category: 'opening' },
  { id: '11', text: 'Check buttons in POS for any specials during shift', completed: false, category: 'opening' },
  { id: 'bank-2', text: 'Count $1 bills: 2 bands of $100 ($200 total)', completed: false, category: 'bank' },
  { id: 'bank-3', text: 'Count $5 bills: 1 band of $100 ($100 total)', completed: false, category: 'bank' },
  { id: 'bank-4', text: 'Verify total bank amount: $300', completed: false, category: 'bank' },
  { id: 'cash-1', text: 'Use counterfeit pen on all $50+ bills received', completed: false, category: 'cash' },
  { id: 'cash-2', text: 'Check for security features: watermark, security strip', completed: false, category: 'cash' },
  { id: 'shift-1', text: 'Maintain clean and organized work area', completed: false, category: 'during-shift' },
  { id: 'shift-5', text: 'Follow responsible alcohol service guidelines', completed: false, category: 'during-shift' },
  { id: 'close-1', text: 'Count register drawer and prepare for checkout', completed: false, category: 'closing' },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'opening', label: 'Opening', icon: '🔓' },
  { id: 'bank', label: 'Bank', icon: '💰' },
  { id: 'cash', label: 'Cash', icon: '💵' },
  { id: 'during-shift', label: 'Shift', icon: '🍸' },
  { id: 'closing', label: 'Closing', icon: '🔒' }
];

export default function StandardOperatingProceduresSection() {
  const { currentUser, showToast } = useApp();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'procedures', 60);
    }, 60000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleCheckout = async () => {
    const closingItems = checklist.filter(i => i.category === 'closing');
    if (!closingItems.every(i => i.completed)) {
      showToast('Complete closing steps first.');
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.from('notifications').insert([{
        type: 'checkout_request',
        title: `Checkout: ${currentUser?.name}`,
        message: `${currentUser?.name} is ready for checkout.`,
        sender_id: currentUser?.auth_id,
        sender_name: currentUser?.name,
        recipient_role: 'Admin'
      }]);

      if (error) throw error;
      showToast('Manager notified.');
    } catch (e: any) {
      console.error('Notification error:', e);
      showToast(`Notification error: ${e.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const filteredItems = activeCategory === 'all' ? checklist : checklist.filter(i => i.category === activeCategory);
  const progressPct = (checklist.filter(i => i.completed).length / checklist.length) * 100;

  return (
    <div
      id="procedures"
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
            Operating SOPs
          </h3>
          <p style={{ margin: 0, opacity: 0.7, color: 'white', fontSize: '0.8rem', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Workflow compliance and checklists
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ height: '6px', width: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '8px' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: 'white', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
          </div>
          <span style={{ fontSize: '0.65rem', color: 'white', opacity: 0.5, letterSpacing: '1px' }}>{Math.round(progressPct)}% COMPLETE</span>
        </div>
      </div>

      <div style={{ padding: '25px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '30px',
                background: activeCategory === cat.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: activeCategory === cat.id ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '0.75rem',
                cursor: 'pointer',
                letterSpacing: '1px'
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', marginTop: '10px' }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              style={{
                padding: '18px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: item.completed ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                opacity: item.completed ? 1 : 0.8
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                background: item.completed ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}>
                {item.completed && '✓'}
              </div>
              <span style={{ ...premiumBodyStyle, fontSize: '0.85rem', textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.5 : 1 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ ...premiumWhiteStyle, fontSize: '0.95rem', letterSpacing: '1px', marginBottom: '4px' }}>End of Shift Protocol</h4>
            <p style={{ ...premiumBodyStyle, fontSize: '0.75rem', opacity: 0.6 }}>Notify management once all closing tasks are verified.</p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isSending}
            style={{
              padding: '10px 24px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '30px',
              color: 'white',
              fontSize: '0.8rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: isSending ? 'not-allowed' : 'pointer'
            }}
          >
            {isSending ? 'SENDING...' : 'READY FOR CHECKOUT'}
          </button>
        </div>

        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}