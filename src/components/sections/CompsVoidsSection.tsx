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

        {/* Comp Naming Convention Card */}
        <StaticCard
          title="🏷️ Comp Naming Convention"
          description="Standard prefixes for all comp items in the POS system."
        >
          <div style={{
            padding: '25px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minHeight: '200px'
          }}>
            <h5 style={{ 
              color: '#D4AF37', 
              marginBottom: '20px', 
              fontSize: '1.2rem', 
              fontWeight: 400, 
              letterSpacing: '2px', 
              textTransform: 'uppercase' 
            }}>
              POS Entry Protocols
            </h5>
            <div style={{ ...premiumBodyStyle, opacity: 0.9 }}>
              <p style={{ marginBottom: '15px' }}>Enter specific reasons using the naming standard below:</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><strong>xxxcomp[reason]xxx</strong> - Standard comp format</li>
                <li>Example: <strong>xxxcompvipxxx</strong> for VIP guest treatment</li>
                <li>Example: <strong>xxxcompbrthdxxx</strong> for approved birthday promotions</li>
                <li>Example: <strong>xxxcompdissxxx</strong> for guest dissatisfaction apology</li>
              </ul>
            </div>
          </div>
        </StaticCard>

        {/* Comps Guide Card */}
        <StaticCard
          title="📖 Comps Guide"
          description="Step-by-step protocol for authorized complimentary items."
          items={[
            'Verify guest eligibility or management approval',
            'Select the correct item in the POS system',
            'Apply the mandatory Comp Naming Convention in the comment field',
            'Obtain manager swipe/authorization to finalize',
            'Document the comp in the nightly bar log'
          ]}
        />

        {/* Progress Section */}
        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}