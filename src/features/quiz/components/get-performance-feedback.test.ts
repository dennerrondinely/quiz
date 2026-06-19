import { describe, expect, it } from 'vitest';
import { getPerformanceFeedback } from '@/features/quiz/components/get-performance-feedback';

describe('getPerformanceFeedback', () => {
  it('returns the excellent message for score >= 80%', () => {
    expect(getPerformanceFeedback(4, 5)).toBe(
      "Excellent! You're mastering AI development concepts!",
    );
  });

  it('returns the excellent message at exactly 80%', () => {
    expect(getPerformanceFeedback(8, 10)).toBe(
      "Excellent! You're mastering AI development concepts!",
    );
  });

  it('returns the good job message for score in 60–79%', () => {
    expect(getPerformanceFeedback(7, 10)).toBe("Good job! You're getting there!");
  });

  it('returns the good job message at exactly 60%', () => {
    expect(getPerformanceFeedback(3, 5)).toBe("Good job! You're getting there!");
  });

  it('returns the keep practicing message for score < 60%', () => {
    expect(getPerformanceFeedback(2, 5)).toBe('Keep practicing! Review the fundamentals.');
  });

  it('returns the keep practicing message for 0 correct', () => {
    expect(getPerformanceFeedback(0, 5)).toBe('Keep practicing! Review the fundamentals.');
  });

  it('returns the excellent message for all correct', () => {
    expect(getPerformanceFeedback(5, 5)).toBe(
      "Excellent! You're mastering AI development concepts!",
    );
  });

  it('returns the keep practicing message when total is 0', () => {
    expect(getPerformanceFeedback(0, 0)).toBe('Keep practicing! Review the fundamentals.');
  });
});
