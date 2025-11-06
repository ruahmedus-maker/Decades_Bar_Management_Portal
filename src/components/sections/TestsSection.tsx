// components/TestsSection.tsx
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TEST_QUESTIONS, ENABLE_TESTS } from '@/lib/constants';
import { storage } from '@/lib/storage';

// Soft Coral color scheme
const CORAL_COLOR = '#FF7F7F'; // Soft coral
const CORAL_COLOR_RGB = '255, 127, 127';
const CORAL_COLOR_DARK = '#E57373'; // Darker coral
const CORAL_COLOR_LIGHT = '#FFA8A8'; // Lighter coral

// Style objects with coral theme
const sectionStyle = {
  background: 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: '20px',
  padding: '30px',
  marginBottom: '30px',
  boxShadow: `
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 32px rgba(255, 127, 127, 0.1)
  `,
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px) saturate(170%)',
  WebkitBackdropFilter: 'blur(15px) saturate(170%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '16px',
  marginBottom: '25px',
  overflow: 'hidden' as const,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
};

const cardHeaderStyle = {
  background: `rgba(${CORAL_COLOR_RGB}, 0.2)`,
  borderLeft: `4px solid ${CORAL_COLOR}`,
  padding: '20px 25px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
};

const cardTitleStyle = {
  color: '#ffffff',
  fontSize: '1.2rem',
  fontWeight: 600,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const cardBodyStyle = {
  padding: '25px',
};

const questionStyle = {
  marginBottom: '25px',
  padding: '20px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const questionTextStyle = {
  color: '#ffffff',
  fontSize: '1.1rem',
  fontWeight: 600,
  marginBottom: '15px',
};

const optionLabelStyle = {
  display: 'block',
  margin: '8px 0',
  padding: '12px 15px',
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: '#ffffff',
};

const optionLabelHoverStyle = {
  background: 'rgba(255, 255, 255, 0.15)',
  borderColor: `rgba(${CORAL_COLOR_RGB}, 0.3)`,
  transform: 'translateX(5px)',
};

const radioStyle = {
  marginRight: '10px',
  cursor: 'pointer',
};

const buttonStyle = {
  background: `linear-gradient(135deg, ${CORAL_COLOR}, ${CORAL_COLOR_DARK})`,
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  boxShadow: `0 4px 15px rgba(${CORAL_COLOR_RGB}, 0.3)`,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '15px',
};

const buttonHoverStyle = {
  transform: 'translateY(-2px)',
  boxShadow: `0 6px 20px rgba(${CORAL_COLOR_RGB}, 0.4)`,
  background: `linear-gradient(135deg, ${CORAL_COLOR_DARK}, ${CORAL_COLOR})`,
};

export default function TestsSection() {
  const { currentUser, showToast } = useApp();
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});

  // If tests are disabled, don't show anything
  if (!ENABLE_TESTS) {
    return null;
  }

  // Only show this section to admins when tests are enabled
  // Bartenders/trainees will see the full screen version instead
  const shouldShowSection = currentUser && currentUser.position === 'Admin';

  if (!shouldShowSection) {
    return null;
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setTestAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const submitTest = (testNumber: number) => {
    if (testNumber === 1) {
      let score = 0;
      const totalQuestions = TEST_QUESTIONS.length;

      TEST_QUESTIONS.forEach(q => {
        const selectedIndex = testAnswers[q.id];
        if (selectedIndex !== undefined && q.options[selectedIndex].correct) {
          score++;
        }
      });

      const percentage = Math.round((score / totalQuestions) * 100);

      // Save test results
      if (currentUser) {
        const users = storage.getUsers();
        const user = users[currentUser.email];

        if (user) {
          if (!user.testResults) user.testResults = {};
          user.testResults[`test${testNumber}`] = {
            score,
            total: totalQuestions,
            percentage,
            passed: percentage >= 70,
            date: new Date().toISOString(),
            testName: "Bartending Fundamentals"
          };

          storage.saveUsers(users);
          showToast(`Test submitted! Score: ${score}/${totalQuestions} (${percentage}%)`);
        }
      }
    }
  };

  return (
    <div style={sectionStyle} id="tests">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '1.4rem',
          fontWeight: 700,
          margin: 0,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}>Training Tests & Assessments</h3>
        <span style={{
          background: `linear-gradient(135deg, ${CORAL_COLOR}, ${CORAL_COLOR_DARK})`,
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          boxShadow: `0 4px 12px rgba(${CORAL_COLOR_RGB}, 0.3)`,
        }}>Evaluation</span>
      </div>

      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h4 style={cardTitleStyle}>🧪 Test 1: Bartending Fundamentals</h4>
        </div>
        <div style={cardBodyStyle}>
          <div id="test1-questions">
            {TEST_QUESTIONS.map((q, index) => (
              <div key={q.id} style={questionStyle}>
                <p style={questionTextStyle}><strong>{index + 1}. {q.question}</strong></p>
                {q.options.map((opt, i) => (
                  <label 
                    key={i} 
                    style={optionLabelStyle}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, optionLabelHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, optionLabelStyle);
                    }}
                  >
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={i}
                      checked={testAnswers[q.id] === i}
                      onChange={() => handleAnswerSelect(q.id, i)}
                      style={radioStyle}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <button 
            style={buttonStyle}
            onClick={() => submitTest(1)}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, buttonHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, buttonStyle);
            }}
          >
            Submit Test 1
          </button>
        </div>
      </div>
    </div>
  );
}