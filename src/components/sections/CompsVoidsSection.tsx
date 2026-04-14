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
                <li><strong>xxx[NAME]xxx</strong> - Standard comp format</li>
                <li>Example: <strong>xxxDJEZxxx</strong> for House DJs</li>
                <li>Example: <strong>xxxBIRTHDAYSHOTSxxx</strong> for Birthday ExperienceShots</li>
                <li>Example: <strong>xxxOPENBARxxx</strong> for Open Bar promotions</li>
                <li>Example: <strong>xxxYourNamexxx</strong> for your promotional comp tab guests/friends</li>
                <li>Example: <strong>xxxYourName+Pxxx</strong> shots approved and consumed by you</li>
              </ul>
            </div>
          </div>
        </StaticCard>

        {/* Comps Guide Card */}
        <StaticCard
          title="📖 Comps Guide — Quick Reference"
          description="Specific protocols for staff, promoters, and event guests."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Comp Tabs & Red Bull */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h5 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '5px' }}>🧾 Comp Tabs & ⚡ Red Bull</h5>
              <ul style={{ ...premiumBodyStyle, fontSize: '0.85rem', paddingLeft: '18px', margin: 0 }}>
                <li><strong>Tabs Format:</strong> xxxNamexxx</li>
                <li><strong>Red Bull:</strong> Staff & promoters → $2</li>
                <li>If comped, ring full price under their comp tab</li>
              </ul>
            </div>

            {/* DJs */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h5 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '5px' }}>🎧 DJs</h5>
              <ul style={{ ...premiumBodyStyle, fontSize: '0.85rem', paddingLeft: '18px', margin: 0 }}>
                <li><strong>House DJs:</strong> $75 comp tab</li>
                <li>No free drinks off-shift without manager approval</li>
                <li><strong>Private Events:</strong> No comps unless approved</li>
              </ul>
            </div>

            {/* Security & Bartenders */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h5 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '5px' }}>🛡️ Security & 🍹 Bartenders</h5>
              <ul style={{ ...premiumBodyStyle, fontSize: '0.85rem', paddingLeft: '18px', margin: 0 }}>
                <li><strong>Security:</strong> 1 shift shot ONLY after clocking out</li>
                <li><strong>Bartender Tab:</strong> $75 max ($75 extension requires Mgr)</li>
                <li><strong>Personal:</strong> 3 shot max per shift (notate with "p")</li>
              </ul>
            </div>

            {/* VIP Hosts & Tickets */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h5 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '5px' }}>🎟️ VIP Hosts & 🎫 Tickets</h5>
              <ul style={{ ...premiumBodyStyle, fontSize: '0.85rem', paddingLeft: '18px', margin: 0 }}>
                <li><strong>Host Entry:</strong> xxxJTTIXxxx (or xxxJTxxx if no tix)</li>
                <li><strong>Drink Tickets:</strong> Rail, Beer, Red Bull, Water</li>
                <li><span style={{ color: '#fc8181' }}>NOT valid for premium liquor</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Rules */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'rgba(252, 129, 129, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(252, 129, 129, 0.2)' }}>
              <h5 style={{ color: '#fc8181', fontSize: '0.9rem', marginBottom: '10px' }}>✔️ Approval Rule</h5>
              <p style={{ ...premiumBodyStyle, fontSize: '0.85rem', margin: 0 }}>
                No oral approvals. Must have <strong>visual or text approval</strong> from management. Never accept "Someone said I could."
              </p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h5 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '10px' }}>📦 Barbacks</h5>
              <p style={{ ...premiumBodyStyle, fontSize: '0.85rem', margin: 0 }}>
                Cannot give anything away to customers. Water to staff only. Report violations to <strong>Joe at checkout</strong>.
              </p>
            </div>
          </div>
        </StaticCard>

        {/* Progress Section */}
        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}