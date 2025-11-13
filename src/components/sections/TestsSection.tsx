// components/TestsSection.tsx
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TEST_QUESTIONS, ENABLE_TESTS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

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

const resultsStyle = {
  marginTop: '20px',
  padding: '20px',
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#ffffff',
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

interface TestResult {
  id: string;
  user_email: string;
  test_number: number;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  test_name: string;
  date: string;
  answers: Record<number, number>;
}

export default function TestsSection() {
  const { currentUser, showToast } = useApp();
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [submitting, setSubmitting] = useState(false);

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

  const submitTest = async (testNumber: number) => {
    if (!currentUser) return;

    // Check if all questions are answered
    const unansweredQuestions = TEST_QUESTIONS.filter(q => testAnswers[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      showToast(`Please answer all questions before submitting. ${unansweredQuestions.length} unanswered.`);
      return;
    }

    setSubmitting(true);
    try {
      let score = 0;
      const totalQuestions = TEST_QUESTIONS.length;

      // Calculate score
      TEST_QUESTIONS.forEach(q => {
        const selectedIndex = testAnswers[q.id];
        if (selectedIndex !== undefined && q.options[selectedIndex].correct) {
          score++;
        }
      });

      const percentage = Math.round((score / totalQuestions) * 100);
      const passed = percentage >= 70;

      // Save test results to Supabase
      const { data, error } = await supabase
        .from('test_results')
        .insert({
          user_email: currentUser.email,
          test_number: testNumber,
          score,
          total_questions: totalQuestions,
          percentage,
          passed,
          test_name: "Bartending Fundamentals",
          answers: testAnswers
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving test results:', error);
        showToast('Error saving test results');
        return;
      }

      // Add to local state
      setTestResults(prev => [data, ...prev]);
      
      showToast(`Test submitted! Score: ${score}/${totalQuestions} (${percentage}%) - ${passed ? 'PASSED' : 'FAILED'}`);
      
      // Clear answers for next attempt
      setTestAnswers({});

    } catch (error) {
      console.error('Error submitting test:', error);
      showToast('Error submitting test');
    } finally {
      setSubmitting(false);
    }
  };

  const loadTestResults = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_email', currentUser.email)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading test results:', error);
        return;
      }

      setTestResults(data || []);
    } catch (error) {
      console.error('Error loading test results:', error);
    }
  };

  // Load test results on component mount
  useState(() => {
    if (currentUser) {
      loadTestResults();
    }
  });

  const latestResult = testResults[0];

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

      {/* Latest Test Result */}
      {latestResult && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h4 style={cardTitleStyle}>📊 Latest Test Result</h4>
          </div>
          <div style={cardBodyStyle}>
            <div style={resultsStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span><strong>Test:</strong> {latestResult.test_name}</span>
                <span style={latestResult.passed ? passedStyle : failedStyle}>
                  {latestResult.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Score:</strong> {latestResult.score}/{latestResult.total_questions} ({latestResult.percentage}%)</span>
                <span><strong>Date:</strong> {new Date(latestResult.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    style={{
                      ...optionLabelStyle,
                      ...(testAnswers[q.id] === i ? {
                        background: `rgba(${CORAL_COLOR_RGB}, 0.2)`,
                        borderColor: CORAL_COLOR
                      } : {})
                    }}
                    onMouseEnter={(e) => {
                      if (testAnswers[q.id] !== i) {
                        Object.assign(e.currentTarget.style, optionLabelHoverStyle);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (testAnswers[q.id] !== i) {
                        Object.assign(e.currentTarget.style, {
                          ...optionLabelStyle,
                          ...(testAnswers[q.id] === i ? {
                            background: `rgba(${CORAL_COLOR_RGB}, 0.2)`,
                            borderColor: CORAL_COLOR
                          } : {})
                        });
                      }
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
            style={{
              ...buttonStyle,
              ...(submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {})
            }}
            onClick={() => submitTest(1)}
            disabled={submitting}
            onMouseEnter={(e) => {
              if (!submitting) {
                Object.assign(e.currentTarget.style, buttonHoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                Object.assign(e.currentTarget.style, buttonStyle);
              }
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Test 1'}
          </button>

          {/* Test Statistics */}
          <div style={{ marginTop: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
            <p>
              <strong>Progress:</strong> {Object.keys(testAnswers).length}/{TEST_QUESTIONS.length} questions answered
              {Object.keys(testAnswers).length === TEST_QUESTIONS.length && ' - Ready to submit!'}
            </p>
          </div>
        </div>
      </div>

      {/* Previous Attempts */}
      {testResults.length > 1 && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h4 style={cardTitleStyle}>📈 Previous Attempts</h4>
          </div>
          <div style={cardBodyStyle}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Score</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Percentage</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.slice(1).map((result, index) => (
                    <tr 
                      key={result.id}
                      style={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px' }}>{new Date(result.date).toLocaleDateString()}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{result.score}/{result.total_questions}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{result.percentage}%</td>
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