// lib/test-service.ts - Test business logic
import { supabase } from './supabase';
import { getTestById } from './test-config';

export interface TestSubmission {
  testId: string;
  answers: Record<number, number>; // questionId -> selectedOptionIndex
}

export interface TestResult {
  id: string;
  user_email: string;
  test_id: string;
  test_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  answers: Record<number, number>;
  date: string;
}

export interface TestResultWithUser extends TestResult {
  user_name: string;
  user_position: string;
}

export const testService = {
  async submitTest(userEmail: string, submission: TestSubmission): Promise<TestResult> {
    const testConfig = getTestById(submission.testId);
    if (!testConfig) {
      throw new Error('Test not found');
    }

    // Calculate score
    let score = 0;
    testConfig.questions.forEach(question => {
      const selectedIndex = submission.answers[question.id];
      if (selectedIndex !== undefined && question.options[selectedIndex].correct) {
        score++;
      }
    });

    const percentage = Math.round((score / testConfig.questions.length) * 100);
    const passed = percentage >= testConfig.passingScore;

    // Save to database
    const { data, error } = await supabase
      .from('test_results')
      .insert({
        user_email: userEmail,
        test_id: submission.testId,
        test_name: testConfig.name,
        score,
        total_questions: testConfig.questions.length,
        percentage,
        passed,
        answers: submission.answers
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving test results:', error);
      throw new Error('Failed to save test results');
    }

    return data as TestResult;
  },

  async getUserTestResults(userEmail: string): Promise<TestResult[]> {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_email', userEmail)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading test results:', error);
      return [];
    }

    return data as TestResult[];
  },

  async getAllTestResults(): Promise<TestResultWithUser[]> {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        users:user_email (
          name,
          position
        )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading all test results:', error);
      return [];
    }

    // Transform the data to include user info
    return (data || []).map(result => ({
      ...result,
      user_name: result.users?.name || 'Unknown',
      user_position: result.users?.position || 'Unknown'
    })) as TestResultWithUser[];
  },

  async getTestResultsByTest(testId: string): Promise<TestResultWithUser[]> {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        users:user_email (
          name,
          position
        )
      `)
      .eq('test_id', testId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading test results by test:', error);
      return [];
    }

    return (data || []).map(result => ({
      ...result,
      user_name: result.users?.name || 'Unknown',
      user_position: result.users?.position || 'Unknown'
    })) as TestResultWithUser[];
  },

  async getTestStatistics() {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        users:user_email (
          name,
          position
        )
      `);

    if (error) {
      console.error('Error loading test statistics:', error);
      return null;
    }

    const results = (data || []).map(result => ({
      ...result,
      user_name: result.users?.name || 'Unknown',
      user_position: result.users?.position || 'Unknown'
    }));

    // Calculate statistics
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const averageScore = totalTests > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalTests)
      : 0;

    const byTest = results.reduce((acc, result) => {
      if (!acc[result.test_id]) {
        acc[result.test_id] = {
          test_name: result.test_name,
          total: 0,
          passed: 0,
          average_score: 0
        };
      }
      acc[result.test_id].total++;
      if (result.passed) acc[result.test_id].passed++;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages for each test
    Object.keys(byTest).forEach(testId => {
      const testResults = results.filter(r => r.test_id === testId);
      byTest[testId].average_score = Math.round(
        testResults.reduce((sum, r) => sum + r.percentage, 0) / testResults.length
      );
    });

    return {
      total_tests: totalTests,
      passed_tests: passedTests,
      pass_rate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
      average_score: averageScore,
      by_test: byTest
    };
  }
};