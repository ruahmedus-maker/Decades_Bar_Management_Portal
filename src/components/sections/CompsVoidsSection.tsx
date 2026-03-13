'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function StaticCard({ title, description, items, footer, children }: any) {
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
        </div>
        <div style={{ padding: '16px 20px' }}>
          {children || (
            <>
              <p style={{ ...premiumBodyStyle, marginBottom: '12px', fontSize: '0.95rem' }}>{description}</p>
              <ul style={{ paddingLeft: '18px', marginBottom: '0', marginTop: '12px' }}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ ...premiumBodyStyle, marginBottom: '6px', fontSize: '0.9rem' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompsVoidsSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Wait 60 seconds then mark as complete
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'comps-voids', 60);
      console.log('Section auto-completed after 60 seconds');
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentUser]);

  return (
    <div
      id="comps-voids"
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
            Comps & Voids
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
            Financial accuracy and accountability
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
          FINANCIAL
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Overview Card */}
        <StaticCard
          title="💰 Protocol Overview"
          description="Proper procedures for handling complimentary items and voided transactions to maintain financial accuracy."
          items={[
            'Active Manager approval required for all comps',
            'Full documentation of reason for every void',
            'Strict adherence to POS system procedures',
            'Mandatory end-of-shift reconciliation'
          ]}
        />

        {/* Naming Convention Card */}
        <StaticCard
          title="🏷️ System Naming Convention"
          description="Use the 'xxx' + code + 'xxx' pattern for all descriptions to ensure audit tracking."
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '15px',
            marginTop: '10px'
          }}>
            <div style={{
              padding: '18px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <h5 style={{ color: 'white', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7 }}>
                Customer Experience
              </h5>
              <ul style={{ margin: 0, paddingLeft: '18px', ...premiumBodyStyle, fontSize: '0.9rem', fontWeight: 300 }}>
                <li><strong>xxxdecxxx</strong> - Customer declined/refused</li>
                <li><strong>xxxdissxxx</strong> - Customer dissatisfied</li>
                <li><strong>xxxwaitxxx</strong> - Wait time compensation</li>
                <li><strong>xxxvipxxx</strong> - VIP guest treatment</li>
              </ul>
            </div>

            <div style={{
              padding: '18px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <h5 style={{ color: 'white', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7 }}>
                Product & Service
              </h5>
              <ul style={{ margin: 0, paddingLeft: '18px', ...premiumBodyStyle, fontSize: '0.9rem', fontWeight: 300 }}>
                <li><strong>xxxqualxxx</strong> - Product quality issue</li>
                <li><strong>xxxspilxxx</strong> - Drink spill/accident</li>
                <li><strong>xxxwrongxxx</strong> - Wrong item made/ordered</li>
                <li><strong>xxxremakexxx</strong> - Remake requested</li>
              </ul>
            </div>

            <div style={{
              padding: '18px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <h5 style={{ color: 'white', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7 }}>
                Administrative
              </h5>
              <ul style={{ margin: 0, paddingLeft: '18px', ...premiumBodyStyle, fontSize: '0.9rem', fontWeight: 300 }}>
                <li><strong>xxxvoidxxx</strong> - General transaction void</li>
                <li><strong>xxxdupxxx</strong> - Duplicate charge</li>
                <li><strong>xxxerrxxx</strong> - Bartender/System error</li>
                <li><strong>xxxempxxx</strong> - Employee comp</li>
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <p style={{
              margin: 0,
              ...premiumBodyStyle,
              fontSize: '0.85rem',
              fontStyle: 'italic',
              opacity: 0.8
            }}>
              Example: For a dissatisfied guest, enter <strong>"xxxdissxxx"</strong> in the POS reason field.
            </p>
          </div>
        </StaticCard>

        {/* Comp/Void Procedures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <StaticCard title="🎁 Comp Standards">
            <ul style={{ ...premiumBodyStyle, fontSize: '0.9rem', paddingLeft: '18px', margin: 0, fontWeight: 300 }}>
              <li style={{ marginBottom: '8px' }}>Manager must authorize every complimentary item</li>
              <li style={{ marginBottom: '8px' }}>Name and specific reason must be documented</li>
              <li style={{ marginBottom: '8px' }}>Specific codes must be applied in the POS</li>
            </ul>
          </StaticCard>

          <StaticCard title="📝 Void Standards">
            <ul style={{ ...premiumBodyStyle, fontSize: '0.9rem', paddingLeft: '18px', margin: 0, fontWeight: 300 }}>
              <li style={{ marginBottom: '8px' }}>Manager swipe or login required for all voids</li>
              <li style={{ marginBottom: '8px' }}>Transaction ID must be referenced for audits</li>
              <li style={{ marginBottom: '8px' }}>Customer signature required for credit disputes</li>
            </ul>
          </StaticCard>
        </div>

        {/* Progress Section */}
        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}