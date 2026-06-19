import { beforeEach, describe, expect, it } from 'vitest';
import { useQuizSessionStore } from '@/features/quiz/session-store';

function getStore() {
  return useQuizSessionStore.getState();
}

beforeEach(() => {
  useQuizSessionStore.getState().resetSession();
});

describe('startSession', () => {
  it('sets isSessionActive and currentCategoryId', () => {
    // When
    getStore().startSession('agent-fundamentals');

    // Then
    expect(getStore().isSessionActive).toBe(true);
    expect(getStore().currentCategoryId).toBe('agent-fundamentals');
  });

  it('resets answers, index, and isAnswered', () => {
    // Given: some prior state
    getStore().startSession('agent-fundamentals');
    getStore().answerQuestion(1);
    getStore().nextQuestion();

    // When: start a new session
    getStore().startSession('prompt-engineering');

    // Then: state is fully reset
    expect(getStore().answers).toEqual([]);
    expect(getStore().currentQuestionIndex).toBe(0);
    expect(getStore().isAnswered).toBe(false);
    expect(getStore().currentCategoryId).toBe('prompt-engineering');
  });
});

describe('answerQuestion', () => {
  it('appends the answer and sets isAnswered to true', () => {
    // Given
    getStore().startSession('agent-fundamentals');

    // When
    getStore().answerQuestion(2);

    // Then
    expect(getStore().answers).toEqual([2]);
    expect(getStore().isAnswered).toBe(true);
  });

  it('accumulates multiple answers in order', () => {
    // Given
    getStore().startSession('agent-fundamentals');

    // When
    getStore().answerQuestion(0);
    getStore().nextQuestion();
    getStore().answerQuestion(3);

    // Then
    expect(getStore().answers).toEqual([0, 3]);
  });
});

describe('nextQuestion', () => {
  it('increments currentQuestionIndex and clears isAnswered', () => {
    // Given
    getStore().startSession('agent-fundamentals');
    getStore().answerQuestion(1);
    expect(getStore().isAnswered).toBe(true);

    // When
    getStore().nextQuestion();

    // Then
    expect(getStore().currentQuestionIndex).toBe(1);
    expect(getStore().isAnswered).toBe(false);
  });
});

describe('resetSession', () => {
  it('returns the store to its initial state', () => {
    // Given
    getStore().startSession('agent-fundamentals');
    getStore().answerQuestion(2);
    getStore().nextQuestion();

    // When
    getStore().resetSession();

    // Then
    const state = getStore();
    expect(state.currentCategoryId).toBeNull();
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.answers).toEqual([]);
    expect(state.isSessionActive).toBe(false);
    expect(state.isAnswered).toBe(false);
  });
});
