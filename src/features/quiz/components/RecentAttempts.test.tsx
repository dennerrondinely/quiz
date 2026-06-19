import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RecentAttempts } from '@/features/quiz/components/RecentAttempts';
import type { QuizCategory, UserAttempt } from '@/features/quiz/schemas';
import { useQuizHistoryStore } from '@/features/quiz/store';
import { render } from '@/test/test-utils';

const CATEGORIES: QuizCategory[] = [
  {
    id: 'cat-a',
    title: 'Agent Fundamentals',
    description: 'Desc A',
    questions: [],
  },
  {
    id: 'cat-b',
    title: 'Prompt Engineering',
    description: 'Desc B',
    questions: [],
  },
];

function makeAttempt(
  id: string,
  categoryId: string,
  completedAt: string,
  score = 3,
  total = 5,
): UserAttempt {
  return { id, categoryId, completedAt, score, total, answers: [0, 1, 2, 3, 0] };
}

beforeEach(() => {
  useQuizHistoryStore.setState({ attempts: [] });
});

describe('RecentAttempts', () => {
  it('renders one row per category (most recent), showing title, score, and percentage', () => {
    // Given — 3 attempts: 2 for cat-a (different dates), 1 for cat-b
    const attempts = [
      makeAttempt('1', 'cat-a', '2026-06-17T10:00:00.000Z', 2, 5),
      makeAttempt('2', 'cat-a', '2026-06-19T10:00:00.000Z', 4, 5),
      makeAttempt('3', 'cat-b', '2026-06-18T10:00:00.000Z', 3, 5),
    ];

    // When
    render(<RecentAttempts attempts={attempts} categories={CATEGORIES} />);

    // Then — 2 list items (one per category)
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);

    // Category titles visible
    expect(screen.getByText('Agent Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Prompt Engineering')).toBeInTheDocument();

    // Score and percentage for cat-a most recent (4/5 = 80%)
    expect(screen.getByText('4 / 5')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('shows the formatted date for each attempt', () => {
    // Given
    const attempts = [makeAttempt('1', 'cat-a', '2026-06-19T10:00:00.000Z')];
    const expectedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
      new Date('2026-06-19T10:00:00.000Z'),
    );

    // When
    render(<RecentAttempts attempts={attempts} categories={CATEGORIES} />);

    // Then
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it('falls back to categoryId when category title is not found', () => {
    // Given — attempt with no matching category
    const attempts = [makeAttempt('1', 'unknown-cat', '2026-06-19T10:00:00.000Z')];

    // When
    render(<RecentAttempts attempts={attempts} categories={CATEGORIES} />);

    // Then
    expect(screen.getByText('unknown-cat')).toBeInTheDocument();
  });

  it('caps at 5 rows when 6 categories are present', () => {
    // Given — 6 attempts across 6 distinct categories
    const attempts = Array.from({ length: 6 }, (_, i) =>
      makeAttempt(
        String(i),
        `cat-${i}`,
        `2026-06-${String(10 + i).padStart(2, '0')}T10:00:00.000Z`,
      ),
    );

    // When
    render(<RecentAttempts attempts={attempts} categories={undefined} />);

    // Then
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('opens the confirmation dialog when "Clear History" is clicked', async () => {
    // Given
    const user = userEvent.setup();
    const attempts = [makeAttempt('1', 'cat-a', '2026-06-19T10:00:00.000Z')];
    render(<RecentAttempts attempts={attempts} categories={CATEGORIES} />);

    // When
    await user.click(screen.getByRole('button', { name: /clear history/i }));

    // Then
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/permanently delete/i)).toBeInTheDocument();
  });

  it('calls clearHistory when confirmed', async () => {
    // Given
    const user = userEvent.setup();
    const spy = vi.spyOn(useQuizHistoryStore.getState(), 'clearHistory');
    const attempts = [makeAttempt('1', 'cat-a', '2026-06-19T10:00:00.000Z')];
    render(<RecentAttempts attempts={attempts} categories={CATEGORIES} />);
    await user.click(screen.getByRole('button', { name: /clear history/i }));
    await screen.findByRole('dialog');

    // When
    await user.click(screen.getByRole('button', { name: /clear all/i }));

    // Then
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    spy.mockRestore();
  });

  it('does not call clearHistory when cancelled', async () => {
    // Given
    const user = userEvent.setup();
    const spy = vi.spyOn(useQuizHistoryStore.getState(), 'clearHistory');
    const attempts = [makeAttempt('1', 'cat-a', '2026-06-19T10:00:00.000Z')];
    render(<RecentAttempts attempts={attempts} categories={CATEGORIES} />);
    await user.click(screen.getByRole('button', { name: /clear history/i }));
    await screen.findByRole('dialog');

    // When
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Then
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
