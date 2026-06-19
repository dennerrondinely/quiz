import type { UserAttempt } from '@/features/quiz/schemas';

export function getRecentAttempts(attempts: UserAttempt[], maxCategories = 5): UserAttempt[] {
  const latestByCategory = new Map<string, UserAttempt>();

  for (const attempt of attempts) {
    const existing = latestByCategory.get(attempt.categoryId);
    if (!existing || attempt.completedAt > existing.completedAt) {
      latestByCategory.set(attempt.categoryId, attempt);
    }
  }

  return [...latestByCategory.values()]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, maxCategories);
}
