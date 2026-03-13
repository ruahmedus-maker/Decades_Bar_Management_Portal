import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/supabase-auth';
import { CardProps } from '@/types';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, description, items, children }: CardProps) {
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
        <div style={{ padding: '20px' }}>
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
      </div>
    </div>
  );
}

// FAQ Item Component - ALOHA STYLED
function FAQItem({ question, answer }: any) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '18px',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        position: 'relative',
        marginBottom: '10px'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h5 style={{
          color: 'white',
          margin: 0,
          fontSize: '0.95rem',
          fontWeight: 300,
          letterSpacing: '0.5px',
          opacity: 0.95
        }}>
          {question}
        </h5>
        <span style={{
          fontSize: '0.7rem',
          color: 'white',
          marginLeft: '15px',
          opacity: 0.5,
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)'
        }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <p style={{
            ...premiumBodyStyle,
            fontSize: '0.9rem',
            fontWeight: 300,
            margin: 0,
            opacity: 0.8
          }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    timerRef.current = setTimeout(() => {
      trackSectionVisit(currentUser.email, 'faq', 60);
    }, 60000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentUser]);

  const faqData = [
    {
      question: "What are the standard operating hours?",
      answer: "Decades operates Thursday through Saturday from 9:00 PM to 2:00 AM. Arrival times for staff are typically 8:00 PM unless specified otherwise by management."
    },
    {
      question: "How do I request time off?",
      answer: "Requests must be submitted via the 7shifts app at least 2 weeks in advance. Last-minute requests require direct manager approval."
    },
    {
      question: "What is the mandatory uniform policy?",
      answer: "Staff must wear Decades branded apparel or specified theme attire. Black pants/jeans and clean footwear are required at all times."
    },
    {
      question: "Protocol for customer issues?",
      answer: "De-escalate professionally. If a guest remains hostile or refuses to comply with house rules, notify security and management immediately."
    },
    {
      question: "Comps and voids procedure?",
      answer: "All comps/voids require a manager's swipe. bartender errors should be logged as 'xxxerrxxx' in the POS description."
    },
    {
      question: "How to report equipment failure?",
      answer: "Use the Maintenance Request section in this portal to log the issue. For urgent problems (leaks, power loss), notify management instantly."
    }
  ];

  return (
    <div
      id="faq"
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
            Operations FAQ
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
            Quick reference for common workplace queries
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
          SUPPORT
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        <AnimatedCard
          title="❓ Frequently Asked"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard
          title="🆘 Direct Support"
          description="Still have questions? Reach out to your floor manager or the lead bartender for real-time guidance."
          items={[
            'Check specific training modules for deep-dives',
            'Refer to the digital Employee Handbook',
            'Post in the team communications channel',
            'Request a 1-on-1 performance review'
          ]}
        />

        <div style={{ marginTop: '30px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}
