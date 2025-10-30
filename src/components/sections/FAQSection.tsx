import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressSection from '../ProgressSection';
import { trackSectionVisit } from '@/lib/progress';

// Define the section color for FAQ
const SECTION_COLOR = '#38B2AC'; // Teal color for FAQ
const SECTION_COLOR_RGB = '56, 178, 172';

// Animated Card Component with Colored Glow Effects
function AnimatedCard({ title, description, items, footer, index, children }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Different glow colors for different cards - teal theme for FAQ
  const glowColors = [
    'linear-gradient(45deg, #38B2AC, #4FD1C7, transparent)', // Teal
    'linear-gradient(45deg, #319795, #38B2AC, transparent)', // Dark Teal
    'linear-gradient(45deg, #2C7A7B, #319795, transparent)', // Deeper Teal
    'linear-gradient(45deg, #285E61, #2C7A7B, transparent)'  // Deep Teal
  ];

  const glowColor = glowColors[index] || `linear-gradient(45deg, ${SECTION_COLOR}, #4FD1C7, transparent)`;

  return (
    <div 
      style={{
        borderRadius: '16px',
        margin: '15px 0',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(56, 178, 172, 0.1)' 
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

// FAQ Item Component
function FAQItem({ question, answer, index }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '20px',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        backdropFilter: isHovered ? 'blur(15px)' : 'blur(8px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Individual FAQ Color Glow */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '14px',
          background: `linear-gradient(45deg, ${SECTION_COLOR}, transparent)`,
          zIndex: 0,
          opacity: 0.6
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h5 style={{
            color: isHovered ? SECTION_COLOR : 'white',
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            flex: 1
          }}>
            {question}
          </h5>
          <span style={{ 
            fontSize: '1.2rem',
            color: SECTION_COLOR,
            marginLeft: '15px',
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)'
          }}>
            ▼
          </span>
        </div>
        
        {isExpanded && (
          <div style={{ 
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: `1px solid rgba(${SECTION_COLOR_RGB}, 0.3)`
          }}>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              margin: 0,
              lineHeight: 1.6
            }}>
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { currentUser } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (!currentUser) return;

  // Wait 30 seconds then mark as complete
  timerRef.current = setTimeout(() => {
    trackSectionVisit(currentUser.email, 'faq', 30);
    console.log('Section auto-completed after 30 seconds');
  }, 30000);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [currentUser]);

  const faqData = [
    {
      question: "What are the standard operating hours for Decades?",
      answer: "Decades operates Thursday through Saturday from 9:00 PM to 2:00 AM. Special events may have extended hours which will be communicated in advance."
    },
    {
      question: "How do I request time off?",
      answer: "Time off requests should be submitted at least 2 weeks in advance through the scheduling system. Please coordinate with your manager to ensure adequate coverage."
    },
    {
      question: "What is the dress code for staff?",
      answer: "Staff should refer to the Uniform Guide section for specific dress code requirements. Generally, black Decades branded shirts or theme-appropriate attire is required."
    },
    {
      question: "How do I handle difficult customers?",
      answer: "Always remain professional and calm. If a situation escalates, immediately notify security or management. Never engage in arguments with customers."
    },
    {
      question: "What's the procedure for comps and voids?",
      answer: "Comps and voids require manager approval. Use the POS system to flag items that need approval and notify your manager immediately."
    },
    {
      question: "How do I report maintenance issues?",
      answer: "Report any maintenance issues to your manager immediately. For urgent issues that affect safety or operations, notify management right away."
    }
  ];

  return (
    <div 
      id="faq"
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
            Frequently Asked Questions
          </h3>
          <p style={{
            margin: 0,
            opacity: 0.9,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            marginTop: '4px'
          }}>
            Quick answers to common questions about Decades operations
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
          {faqData.length} FAQs
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {/* Introduction Card */}
        <AnimatedCard
          title="❓ Decades FAQ"
          description="Find quick answers to the most common questions about Decades operations, policies, and procedures. Click on any question to reveal the answer."
          items={[
            'Operating hours and schedules',
            'Uniform and appearance standards',
            'Customer service protocols',
            'Emergency procedures'
          ]}
          footer={{ left: 'Quick reference', right: '💡 Help' }}
          index={0}
        />

        {/* FAQ Items */}
        <AnimatedCard
          title="📋 Common Questions"
          index={1}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>
        </AnimatedCard>

        {/* Additional Help */}
        <AnimatedCard
          title="🆘 Need More Help?"
          description="If you couldn't find the answer to your question here, please reach out to management or refer to the specific section in this training portal for more detailed information."
          items={[
            'Contact your manager for urgent issues',
            'Check the specific procedure sections',
            'Review the training materials',
            'Ask experienced team members'
          ]}
          footer={{ left: 'Additional support', right: '👥 Team' }}
          index={2}
        />

        {/* Progress Section */}
        <div style={{ marginTop: '25px' }}>
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}