// components/TestsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { testService, type TestResult } from '@/lib/test-service';
import { getActiveTests, type TestConfig } from '@/lib/test-config';
import { brandFont, sectionHeaderStyle, cardHeaderStyle as brandCardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';

const ENABLE_TESTS = process.env.NEXT_PUBLIC_ENABLE_TESTS === 'true';

// Aloha Blue Background
const SECTION_BLUE = 'rgba(37, 99, 235, 0.2)';

// Simplified Card Component - ALOHA STYLED
function AnimatedCard({ title, children, headerRight }: any) {
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
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h4 style={{
            ...brandCardHeaderStyle,
            ...premiumWhiteStyle,
            letterSpacing: '3px',
            fontSize: '1rem'
          }}>
            {title}
          </h4>
          {headerRight}
        </div>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TestsSection() {
  const { currentUser, showToast } = useApp();
  const [activeTest, setActiveTest] = useState<TestConfig | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [userTests, setUserTests] = useState<TestConfig[]>([]);

  useEffect(() => {
    if (currentUser) {
      setUserTests(getActiveTests(currentUser.position));
      loadTestResults();
    }
  }, [currentUser]);

  const loadTestResults = async () => {
    if (!currentUser) return;
    try {
      const results = await testService.getUserTestResults(currentUser.email);
      setTestResults(results);
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const submitTest = async () => {
    if (!currentUser || !activeTest) return;
    const unanswered = activeTest.questions.filter(q => testAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      showToast('Please complete all questions.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await testService.submitTest(currentUser.email, {
        testId: activeTest.id,
        answers: testAnswers
      });
      await loadTestResults();
      showToast(`Score: ${result.percentage}% - ${result.passed ? 'PASSED' : 'FAILED'}`);
      setTestAnswers({});
      setActiveTest(null);
    } catch (error: any) {
      showToast('Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!ENABLE_TESTS || !currentUser || userTests.length === 0) return null;

  return (
    <div
      id="tests"
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
            Training Tests
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
            Skill assessments and performance reviews
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
          EVALUATIONS
        </span>
      </div>

      <div style={{ padding: '25px' }}>
        {!activeTest ? (
          <AnimatedCard title="📝 Available Tests">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              {userTests.map(test => (
                <div key={test.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h5 style={{ ...premiumWhiteStyle, fontSize: '1rem', fontWeight: 300, marginBottom: '8px', letterSpacing: '1px' }}>{test.name}</h5>
                  <p style={{ ...premiumBodyStyle, fontSize: '0.85rem', opacity: 0.7, marginBottom: '15px' }}>{test.description}</p>
                  <button
                    onClick={() => setActiveTest(test)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          </AnimatedCard>
        ) : (
          <AnimatedCard title={`🧪 ${activeTest.name}`} headerRight={
            <button onClick={() => setActiveTest(null)} style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer', fontSize: '0.8rem' }}>CANCEL</button>
          }>
            <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
              {activeTest.questions.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: '25px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ ...premiumWhiteStyle, fontSize: '1rem', fontWeight: 300, marginBottom: '15px' }}>{idx + 1}. {q.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {q.options.map((opt, i) => (
                      <label key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 15px',
                        background: testAnswers[q.id] === i ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                        border: testAnswers[q.id] === i ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 300
                      }}>
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          checked={testAnswers[q.id] === i}
                          onChange={() => setTestAnswers(prev => ({ ...prev, [q.id]: i }))}
                          style={{ accentColor: 'white' }}
                        />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submitTest}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '20px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              {submitting ? 'Submitting...' : 'Commit Answers'}
            </button>
          </AnimatedCard>
        )}

        {testResults.length > 0 && (
          <AnimatedCard title="📈 Test History">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                <thead style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 400, textTransform: 'uppercase' }}>Assessment</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: 400, textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: 400, textTransform: 'uppercase' }}>Score</th>
                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: 400, textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem', fontWeight: 300 }}>
                  {testResults.map((result) => (
                    <tr key={result.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '15px' }}>{result.test_name}</td>
                      <td style={{ padding: '15px', textAlign: 'center', opacity: 0.6 }}>{new Date(result.date).toLocaleDateString()}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>{result.percentage}%</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <span style={{ color: result.passed ? '#10B981' : '#EF4444', fontWeight: 600, fontSize: '0.75rem' }}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
}