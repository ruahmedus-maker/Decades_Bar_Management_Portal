import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define unique coral color for comps & voids
const SECTION_COLOR = '#FF6B6B'; // Bright coral
const SECTION_COLOR_RGB = '255, 107, 107';

// Static Card Component without Hover Effects
function StaticCard({ title, description, items, footer, index, children }: any) {
  // Different background colors for different cards
  const backgroundColors = [
    `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.25), rgba(${SECTION_COLOR_RGB}, 0.1))`,
    `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.2), rgba(${SECTION_COLOR_RGB}, 0.08))`,
    `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.3), rgba(${SECTION_COLOR_RGB}, 0.12))`,
    `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.22), rgba(${SECTION_COLOR_RGB}, 0.09))`
  ];

  const backgroundColor = backgroundColors[index] || `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.25), rgba(${SECTION_COLOR_RGB}, 0.1))`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: backgroundColor,
          padding: '20px',
          borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`,
          backdropFilter: 'blur(8px)'
        }}>
          <h4 style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 600
          }}>
            {title}
          </h4>
        </div>
        <div style={{ padding: '20px' }}>
          {children || (
            <>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px' }}>{description}</p>
              <ul style={{paddingLeft: '20px', marginBottom: '0', marginTop: '15px'}}>
                {items?.map((item: string, i: number) => (
                  <li key={i} style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {footer && (
          <div style={{
            padding: '15px 20px',
            background: 'rgba(237, 242, 247, 0.15)',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
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
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        WebkitBackdropFilter: 'blur(15px) saturate(170%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.5s ease'
      }}
      className="active"
    >
      
      {/* Section Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.4), rgba(${SECTION_COLOR_RGB}, 0.2))`,
        padding: '20px',
        borderBottom: `1px solid rgba(${SECTION_COLOR_RGB}, 0.4)`,
        backdropFilter: 'blur(10px)',
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
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Comps & Voids Procedures
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Financial procedures for complimentary items and void transactions
          </p>
        </div>
        <span style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          color: 'white',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          Financial
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <StaticCard
          title="💰 Comps & Voids Overview"
          description="Proper procedures for handling complimentary items and voided transactions to maintain financial accuracy and accountability."
          items={[
            'Manager approval required for all comps',
            'Document reason for every void',
            'Follow POS system procedures',
            'Daily reconciliation process'
          ]}
          footer={{ left: 'Financial compliance', right: '📊 Procedures' }}
          index={0}
        />

        {/* Standardized Naming Convention Card */}
        <StaticCard
          title="🏷️ Standard Comp Naming Convention"
          description="Use the 'xxx' + code + 'xxx' pattern for all comps and voids to ensure clear communication and proper tracking."
          index={1}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '15px',
            marginTop: '10px'
          }}>
            <div style={{
              padding: '18px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>
                Customer Situations
              </h5>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>
                <li><strong>xxxdecxxx</strong> - Customer declined/refused</li>
                <li><strong>xxxdissxxx</strong> - Customer dissatisfied</li>
                <li><strong>xxxwaitxxx</strong> - Long wait time compensation</li>
                <li><strong>xxxvipxxx</strong> - VIP guest treatment</li>
                <li><strong>xxxregxxx</strong> - Regular customer appreciation</li>
              </ul>
            </div>

            <div style={{
              padding: '18px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>
                Product Issues
              </h5>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>
                <li><strong>xxxqualxxx</strong> - Product quality issue</li>
                <li><strong>xxxspilxxx</strong> - Drink spilled/accident</li>
                <li><strong>xxxwrongxxx</strong> - Wrong item made/ordered</li>
                <li><strong>xxxremakexxx</strong> - Item remake requested</li>
                <li><strong>xxxexpiredxxx</strong> - Product expired/out of date</li>
              </ul>
            </div>

            <div style={{
              padding: '18px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>
                System & Operational
              </h5>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>
                <li><strong>xxxvoidxxx</strong> - General void transaction</li>
                <li><strong>xxxdupxxx</strong> - Duplicate charge</li>
                <li><strong>xxxerrxxx</strong> - Bartender/System error</li>
                <li><strong>xxxpromoxxx</strong> - Promotion/discount</li>
                <li><strong>xxxempxxx</strong> - Employee comp</li>
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h5 style={{ 
              color: SECTION_COLOR, 
              marginBottom: '10px', 
              fontSize: '1rem', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📝 Usage Example
            </h5>
            <p style={{ 
              margin: 0, 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '0.9rem',
              fontStyle: 'italic'
            }}>
              When a customer is dissatisfied with their drink and you need to comp it, use: <strong>"xxxdissxxx"</strong> in the comp reason field.
            </p>
          </div>
        </StaticCard>

        {/* Comps Procedures */}
        <StaticCard
          title="🎁 Complimentary Items Procedures"
          index={2}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '10px'
          }}>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                Manager Approval
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
                <li>All comps require manager approval</li>
                <li>Document customer name and reason</li>
                <li>Use designated comp codes in POS</li>
                <li>Limit comps per shift</li>
              </ul>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                Valid Reasons
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
                <li>Customer service recovery</li>
                <li>VIP guest treatment</li>
                <li>Product quality issues</li>
                <li>Special promotions</li>
              </ul>
            </div>
          </div>
        </StaticCard>

        {/* Voids Procedures */}
        <StaticCard
          title="📝 Void Transaction Procedures"
          index={3}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '10px'
          }}>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                Void Requirements
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
                <li>Manager approval for all voids</li>
                <li>Document detailed reason</li>
                <li>Include original transaction ID</li>
                <li>Customer signature if applicable</li>
              </ul>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                Common Void Scenarios
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
                <li>Duplicate charges</li>
                <li>Incorrect items ordered</li>
                <li>System errors</li>
                <li>Customer disputes</li>
              </ul>
            </div>
          </div>
        </StaticCard>

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}