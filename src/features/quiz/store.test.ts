import { beforeEach, describe, expect, it } from 'vitest';
import { useQuizHistoryStore } from '@/features/quiz/store';

const BASE_INPUT = {
  categoryId: 'agent-fundamentals',
  completedAt: '2026-06-19T10:00:00.000Z',
  score: 4,
  total: 5,
  answers: [1, 0, 2, 3, 1],
};

function addAttempt(overrides: Partial<typeof BASE_INPUT> = {}) {
  useQuizHistoryStore.getState().addAttempt({ ...BASE_INPUT, ...overrides });
}

beforeEach(() => {
  useQuizHistoryStore.setState({ attempts: [] });
  localStorage.clear();
});

describe('addAttempt', () => {
  it('saves an attempt and assigns a UUID id', () => {
    // When
    addAttempt();

    // Then
    const { attempts } = useQuizHistoryStore.getState();
    expect(attempts).toHaveLength(1);
    expect(attempts[0].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(attempts[0].categoryId).toBe('agent-fundamentals');
  });

  it('evicts the oldest attempt when the 11th is added for the same category', () => {
    // Given: 10 attempts already in the store
    for (let i = 0; i < 10; i++) {
      addAttempt({ score: i });
    }
    const oldestId = useQuizHistoryStore.getState().attempts[0].id;

    // When
    addAttempt({ score: 10 });

    // Then
    const categoryAttempts = useQuizHistoryStore
      .getState()
      .attempts.filter((a) => a.categoryId === 'agent-fundamentals');
    expect(categoryAttempts).toHaveLength(10);
    expect(categoryAttempts.map((a) => a.id)).not.toContain(oldestId);
  });

  it('cap is per-category: 10 in each of two categories gives 20 total', () => {
    // Given / When
    for (let i = 0; i < 10; i++) {
      addAttempt({ categoryId: 'agent-fundamentals', score: i });
      addAttempt({ categoryId: 'prompt-engineering', score: i });
    }

    // Then
    expect(useQuizHistoryStore.getState().attempts).toHaveLength(20);
  });
});

describe('clearHistory', () => {
  it('empties the attempts array', () => {
    // Given
    addAttempt();
    expect(useQuizHistoryStore.getState().attempts).toHaveLength(1);

    // When
    useQuizHistoryStore.getState().clearHistory();

    // Then
    expect(useQuizHistoryStore.getState().attempts).toHaveLength(0);
  });
});

describe('getAttemptsByCategory', () => {
  it('returns only attempts for the specified category', () => {
    // Given
    addAttempt({ categoryId: 'agent-fundamentals' });
    addAttempt({ categoryId: 'prompt-engineering' });
    addAttempt({ categoryId: 'agent-fundamentals' });

    // When
    const results = useQuizHistoryStore.getState().getAttemptsByCategory('agent-fundamentals');

    // Then
    expect(results).toHaveLength(2);
    expect(results.every((a) => a.categoryId === 'agent-fundamentals')).toBe(true);
  });

  it('returns an empty array when no attempts exist for the category', () => {
    // Given
    addAttempt({ categoryId: 'prompt-engineering' });

    // When / Then
    expect(useQuizHistoryStore.getState().getAttemptsByCategory('agent-fundamentals')).toHaveLength(
      0,
    );
  });
});

describe('rehydration', () => {
  it('rehydrates to an empty array when localStorage contains corrupted data', async () => {
    // Given: invalid data in localStorage
    localStorage.setItem(
      'quiz-history',
      JSON.stringify({ state: { attempts: [{ corrupted: 'data' }] }, version: 0 }),
    );

    // When
    await useQuizHistoryStore.persist.rehydrate();

    // Then
    expect(useQuizHistoryStore.getState().attempts).toEqual([]);
  });
});
