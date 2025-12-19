// components/TestsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { testService, type TestResult } from '@/lib/test-service';
import { getActiveTests, type TestConfig } from '@/lib/test-config';
import { goldTextStyle, brandFont, sectionHeaderStyle, cardHeaderStyle as brandCardHeaderStyle } from '@/lib/brand-styles';
import GoldHeading from '../ui/GoldHeading';

const ENABLE_TESTS = process.env.NEXT_PUBLIC_ENABLE_TESTS === 'true';

// Coral color scheme
const CORAL_COLOR = '#FF7F7F';
const CORAL_COLOR_RGB = '255, 127, 127';
const CORAL_COLOR_DARK = '#E57373';

// Style objects
const sectionStyle = {
  background: 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: '20px',
  padding: '30px',
  marginBottom: '30px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(255, 127, 127, 0.1)',
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
  transition: 'none', // Removed - caused scroll crashes
  color: '#ffffff',
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
  transition: 'none', // Removed - caused scroll crashes
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

const passedStyle = {
  color: '#10B981',
  fontWeight: 'bold',
  fontSize: '1.1rem',
};

const failedStyle = {
  color: '#EF4444',
  fontWeight: 'bold',
  fontSize: '1.1rem',
};

export default function TestsSection() {
  const { currentUser, showToast } = useApp();
  const [activeTest, setActiveTest] = useState<TestConfig | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [userTests, setUserTests] = useState<TestConfig[]>([]);

  if (!ENABLE_TESTS) {
    return null; // Or a message saying tests are disabled
  }


  // Load user's available tests
  useEffect(() => {
    if (currentUser) {
      const availableTests = getActiveTests(currentUser.position);
      setUserTests(availableTests);
      loadTestResults();
    }
  }, [currentUser]);

  const loadTestResults = async () => {
    if (!currentUser) return;
    try {
      const results = await testService.getUserTestResults(currentUser.email);
      setTestResults(results);
    } catch (error) {
      console.error('Error loading test results:', error);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setTestAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const submitTest = async () => {
    if (!currentUser || !activeTest) return;

    // Check if all questions are answered
    const unansweredQuestions = activeTest.questions.filter(q => testAnswers[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      showToast(`Please answer all questions before submitting. ${unansweredQuestions.length} unanswered.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await testService.submitTest(currentUser.email, {
        testId: activeTest.id,
        answers: testAnswers
      });

      // Refresh results
      await loadTestResults();

      showToast(`Test submitted! Score: ${result.score}/${result.total_questions} (${result.percentage}%) - ${result.passed ? 'PASSED' : 'FAILED'}`);

      // Clear for next test
      setTestAnswers({});
      setActiveTest(null);

    } catch (error: any) {
      console.error('Error submitting test:', error);
      showToast(error.message || 'Error submitting test');
    } finally {
      setSubmitting(false);
    }
  };

  const startTest = (test: TestConfig) => {
    setActiveTest(test);
    setTestAnswers({});
  };

  const cancelTest = () => {
    setActiveTest(null);
    setTestAnswers({});
  };

  // Don't show if no tests available for user
  if (!currentUser || userTests.length === 0) {
    return null;
  }

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
        <h3 style={sectionHeaderStyle}>
          <GoldHeading text="Training Tests & Assessments" />
        </h3>
        <span style={{
          background: `linear-gradient(135deg, ${CORAL_COLOR}, ${CORAL_COLOR_DARK})`,
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
        }}>Evaluation</span>
      </div>

      {/* Test Selection */}
      {!activeTest && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h4 style={brandCardHeaderStyle}>
              <GoldHeading text="📝 Available Tests" />
            </h4>
          </div>
          <div style={cardBodyStyle}>
            {userTests.map(test => (
              <div key={test.id} style={{
                padding: '15px',
                marginBottom: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <h5 style={{ color: 'white', margin: '0 0 8px 0' }}>{test.name}</h5>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 12px 0', fontSize: '0.9rem' }}>
                  {test.description}
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 12px 0', fontSize: '0.8rem' }}>
                  <strong>Passing Score:</strong> {test.passingScore}% | <strong>Questions:</strong> {test.questions.length}
                </p>
                <button
                  style={buttonStyle}
                  onClick={() => startTest(test)}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Test */}
      {activeTest && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h4 style={brandCardHeaderStyle}>
              <GoldHeading text={`🧪 ${activeTest.name}`} />
            </h4>
          </div>
          <div style={cardBodyStyle}>
            <div style={{ marginBottom: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <p>{activeTest.description}</p>
              <p><strong>Passing Score:</strong> {activeTest.passingScore}%</p>
              <p><strong>Progress:</strong> {Object.keys(testAnswers).length}/{activeTest.questions.length} questions answered</p>
            </div>

            <div id="test-questions">
              {activeTest.questions.map((q, index) => (
                <div key={q.id} style={questionStyle}>
                  <p style={questionTextStyle}><strong>{index + 1}. {q.question}</strong></p>
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      style={{
                        ...optionLabelStyle,
                        ...(testAnswers[q.id] === i ? {
                          background: `rgba(${CORAL_COLOR_RGB}, 0.2)`,
                          borderColor: CORAL_COLOR
                        } : {})
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

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                style={{
                  ...buttonStyle,
                  ...(submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                }}
                onClick={submitTest}
                disabled={submitting}
                onMouseEnter={(e) => !submitting && Object.assign(e.currentTarget.style, buttonHoverStyle)}
                onMouseLeave={(e) => !submitting && Object.assign(e.currentTarget.style, buttonStyle)}
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
              <button
                style={{
                  ...buttonStyle,
                  background: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: 'none'
                }}
                onClick={cancelTest}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Results History */}
      {testResults.length > 0 && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h4 style={brandCardHeaderStyle}>
              <GoldHeading text="📈 Test History" />
            </h4>
          </div>
          <div style={cardBodyStyle}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Test</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Score</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result) => (
                    <tr key={result.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <td style={{ padding: '12px' }}>{result.test_name}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {new Date(result.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {result.score}/{result.total_questions} ({result.percentage}%)
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={result.passed ? passedStyle : failedStyle}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}