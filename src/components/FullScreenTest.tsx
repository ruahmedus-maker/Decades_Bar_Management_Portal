// components/FullScreenTest.tsx
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TEST_QUESTIONS } from '@/lib/constants';
import { storage } from '@/lib/storage';

const CORAL_COLOR = '#FF7F7F';
const CORAL_COLOR_RGB = '255, 127, 127';
const CORAL_COLOR_DARK = '#E57373';

export default function FullScreenTest() {
  const { currentUser, showToast } = useApp();
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

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
      const passed = percentage >= 70;

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
            passed: passed,
            date: new Date().toISOString(),
            testName: "Bartending Fundamentals"
          };

          storage.saveUsers(users);
          showToast(`Test ${passed ? 'passed' : 'failed'}! Score: ${score}/${totalQuestions} (${percentage}%)`);
        }
      }

      setTestResults({ score, total: totalQuestions, percentage, passed });
      setTestSubmitted(true);
    }
  };

  const fullScreenStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #1a1f2e, #2d3748)',
    zIndex: 9999,
    overflow: 'auto' as const,
    padding: '20px'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
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

  const buttonStyle = {
    background: `linear-gradient(135deg, ${CORAL_COLOR}, ${CORAL_COLOR_DARK})`,
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    boxShadow: `0 4px 15px rgba(${CORAL_COLOR_RGB}, 0.3)`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '15px',
  };

  return (
    <div style={fullScreenStyle}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Test Mode Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: 700,
            margin: '0 0 10px 0',
          }}>
            🧪 Training Assessment
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Complete this test to demonstrate your understanding of the training material.
          </p>
          <div style={{
            background: `rgba(${CORAL_COLOR_RGB}, 0.2)`,
            color: CORAL_COLOR,
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            marginTop: '15px',
            fontWeight: 'bold',
            border: `1px solid rgba(${CORAL_COLOR_RGB}, 0.4)`
          }}>
            Test Mode Active
          </div>
        </div>

        {testSubmitted ? (
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h4 style={cardTitleStyle}>
                {testResults.passed ? '✅ Test Passed!' : '❌ Test Failed'}
              </h4>
            </div>
            <div style={cardBodyStyle}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <h3 style={{
                  color: testResults.passed ? '#10B981' : '#EF4444',
                  fontSize: '1.5rem',
                  marginBottom: '15px'
                }}>
                  Score: {testResults.score}/{testResults.total} ({testResults.percentage}%)
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.1rem',
                  marginBottom: '20px'
                }}>
                  {testResults.passed 
                    ? 'Congratulations! You have passed the assessment.' 
                    : 'You did not meet the passing score of 70%. Please review the material and try again.'
                  }
                </p>
                {!testResults.passed && (
                  <button 
                    style={buttonStyle}
                    onClick={() => {
                      setTestSubmitted(false);
                      setTestAnswers({});
                      setTestResults(null);
                    }}
                  >
                    Retry Test
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h4 style={cardTitleStyle}>🧪 Test 1: Bartending Fundamentals</h4>
            </div>
            <div style={cardBodyStyle}>
              <div>
                {TEST_QUESTIONS.map((q, index) => (
                  <div key={q.id} style={questionStyle}>
                    <p style={questionTextStyle}><strong>{index + 1}. {q.question}</strong></p>
                    {q.options.map((opt, i) => (
                      <label 
                        key={i} 
                        style={optionLabelStyle}
                      >
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          value={i}
                          checked={testAnswers[q.id] === i}
                          onChange={() => handleAnswerSelect(q.id, i)}
                          style={{ marginRight: '10px' }}
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
              >
                Submit Test
              </button>
            </div>
          </div>
        )}

        {/* Test Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{ color: '#ffffff', margin: '0 0 10px 0' }}>Test Instructions</h4>
          <ul style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, paddingLeft: '20px' }}>
            <li>Answer all questions to the best of your ability</li>
            <li>You must score 70% or higher to pass</li>
            <li>This test must be completed without assistance</li>
            <li>All other training materials are temporarily unavailable during this test</li>
          </ul>
        </div>
      </div>
    </div>
  );
}