'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TEST_QUESTIONS, ENABLE_TESTS } from '@/lib/constants';
import { storage } from '@/lib/storage';

export default function TestsSection() {
  const { currentUser } = useApp();
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});

  if (!ENABLE_TESTS) {
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
        }
      }

      // Show results (you might want to use a state to display results instead of alert)
      alert(`You scored ${score}/${totalQuestions} (${percentage}%)`);
    }
  };

  return (
    <div className="section" id="tests">
      <div className="section-header">
        <h3>Training Tests & Assessments</h3>
        <span className="badge">Evaluation</span>
      </div>

      <div className="card" style={{ marginBottom: '25px' }}>
        <div className="card-header">
          <h4>🧪 Test 1: Bartending Fundamentals</h4>
        </div>
        <div className="card-body">
          <div id="test1-questions">
            {TEST_QUESTIONS.map((q, index) => (
              <div key={q.id} className="test-question">
                <p><strong>{index + 1}. {q.question}</strong></p>
                {q.options.map((opt, i) => (
                  <label key={i} style={{ display: 'block', margin: '5px 0' }}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={i}
                      checked={testAnswers[q.id] === i}
                      onChange={() => handleAnswerSelect(q.id, i)}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <button className="btn" onClick={() => submitTest(1)} style={{ marginTop: '15px' }}>
            Submit Test 1
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>📊 Test Results</h4>
        </div>
        <div className="card-body">
          <div id="test-results">
            <p>No tests submitted yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}