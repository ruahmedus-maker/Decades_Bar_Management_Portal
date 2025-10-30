import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define unique coral color for policies
const SECTION_COLOR = '#FF8C42'; // Orange coral
const SECTION_COLOR_RGB = '255, 140, 66';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards
  const glowColors = [
    'linear-gradient(45deg, #FF8C42, #FFA366, transparent)',
    'linear-gradient(45deg, #FFA366, #FFBA8C, transparent)',
    'linear-gradient(45deg, #FF7B2C, #FF8C42, transparent)',
    'linear-gradient(45deg, #FF6A13, #FF8C42, transparent)'
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #FFA366, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(255, 140, 66, 0.1)' 
          : '0 8px 30px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: isHovered ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: isHovered ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(160%)',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.18)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Colored Glow Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '18px',
          background: glowColor,
          zIndex: 0,
          opacity: 0.7,
          animation: 'pulse 2s infinite'
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${SECTION_COLOR_RGB}, 0.25), rgba(${SECTION_COLOR_RGB}, 0.1))`,
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

export default function PoliciesSection() {
  const { currentUser } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  if (!currentUser) return;

  // Wait 30 seconds then mark as complete
  timerRef.current = setTimeout(() => {
    trackSectionVisit(currentUser.email, 'policies', 30);
    console.log('Section auto-completed after 30 seconds');
  }, 30000);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [currentUser]);

  return (
    <div 
      id="policies"
      style={{
        marginBottom: '30px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(170%)',
        WebkitBackdropFilter: 'blur(15px) saturate(170%)',
        border: isHovered 
          ? '1px solid rgba(255, 255, 255, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isHovered 
          ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(255, 140, 66, 0.15)'
          : '0 16px 50px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        animation: 'fadeIn 0.5s ease'
      }}
      className="active"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            Policies and Procedures
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Essential guidelines and operational procedures for all staff members
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
          Required Reading
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <AnimatedCard
          title="📋 Essential Policies Overview"
          description="All staff members must be familiar with and adhere to these policies to ensure a safe, professional, and compliant work environment."
          items={[
            'Code of conduct and professionalism',
            'Health and safety protocols',
            'Customer service standards',
            'Emergency procedures',
            'Dress code and appearance'
          ]}
          footer={{ left: 'Mandatory reading', right: '📖 Policies' }}
          index={0}
        />

        {/* Code of Conduct */}
        <AnimatedCard
          title="👔 Code of Conduct"
          index={1}
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
              transition: 'all 0.3s ease'
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                Professional Standards
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
                <li>Punctuality and attendance</li>
                <li>Professional communication</li>
                <li>Conflict resolution</li>
                <li>Teamwork and collaboration</li>
                <li>Respect for colleagues and guests</li>
              </ul>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s ease'
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                Prohibited Behaviors
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
                <li>Harassment of any kind</li>
                <li>Substance abuse during work</li>
                <li>Theft or dishonesty</li>
                <li>Unauthorized discounts</li>
                <li>Confidentiality breaches</li>
              </ul>
            </div>
          </div>
        </AnimatedCard>

        {/* Safety Procedures */}
        <AnimatedCard
          title="🛡️ Health & Safety Procedures"
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
              transition: 'all 0.3s ease'
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                Emergency Protocols
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
                <li>Fire evacuation procedures</li>
                <li>Medical emergency response</li>
                <li>Severe weather protocols</li>
                <li>Security incident reporting</li>
                <li>Emergency contact numbers</li>
              </ul>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s ease'
            }}>
              <h5 style={{ color: SECTION_COLOR, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                Workplace Safety
              </h5>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
                <li>Slip and fall prevention</li>
                <li>Proper lifting techniques</li>
                <li>Chemical handling procedures</li>
                <li>Equipment safety guidelines</li>
                <li>Incident reporting process</li>
              </ul>
            </div>
          </div>
        </AnimatedCard>

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}