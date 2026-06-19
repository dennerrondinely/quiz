import { describe, expect, it } from 'vitest';
import { getRecentAttempts } from '@/features/quiz/components/get-recent-attempts';
import type { UserAttempt } from '@/features/quiz/schemas';

function makeAttempt(overrides: Partial<UserAttempt> & { categoryId: string }): UserAttempt {
  return {
    id: crypto.randomUUID(),
    completedAt: '2026-06-19T10:00:00.000Z',
    score: 3,
    total: 5,
    answers: [0, 1, 2, 3, 0],
    ...overrides,
  };
}

describe('getRecentAttempts', () => {
  it('returns empty array when attempts is empty', () => {
    expect(getRecentAttempts([])).toEqual([]);
  });

  it('returns a single attempt as-is', () => {
    // Given
    const attempt = makeAttempt({ categoryId: 'cat-a' });

    // When / Then
    expect(getRecentAttempts([attempt])).toEqual([attempt]);
  });

  it('returns one entry per category (the most recent)', () => {
    // Given — two attempts for same category, different dates
    const older = makeAttempt({ categoryId: 'cat-a', completedAt: '2026-06-17T10:00:00.000Z' });
    const newer = makeAttempt({ categoryId: 'cat-a', completedAt: '2026-06-19T10:00:00.000Z' });

    // When
    const result = getRecentAttempts([older, newer]);

    // Then
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(newer);
  });

  it('caps at 5 categories when more are present', () => {
    // Given — 7 attempts across 7 distinct categories
    const attempts = Array.from({ length: 7 }, (_, i) =>
      makeAttempt({
        categoryId: `cat-${i}`,
        completedAt: `2026-06-${String(10 + i).padStart(2, '0')}T10:00:00.000Z`,
      }),
    );

    // When
    const result = getRecentAttempts(attempts);

    // Then
    expect(result).toHaveLength(5);
  });

  it('sorts by most-recent-attempt date descending (newest category first)', () => {
    // Given — three categories with different completion dates
    const jan = makeAttempt({ categoryId: 'cat-jan', completedAt: '2026-01-01T10:00:00.000Z' });
    const mar = makeAttempt({ categoryId: 'cat-mar', completedAt: '2026-03-01T10:00:00.000Z' });
    const jun = makeAttempt({ categoryId: 'cat-jun', completedAt: '2026-06-01T10:00:00.000Z' });

    // When — passed in unsorted order
    const result = getRecentAttempts([jan, jun, mar]);

    // Then — newest first
    expect(result.map((a) => a.categoryId)).toEqual(['cat-jun', 'cat-mar', 'cat-jan']);
  });

  it('respects the maxCategories parameter', () => {
    // Given — 4 categories
    const attempts = Array.from({ length: 4 }, (_, i) => makeAttempt({ categoryId: `cat-${i}` }));

    // When
    const result = getRecentAttempts(attempts, 2);

    // Then
    expect(result).toHaveLength(2);
  });
});
