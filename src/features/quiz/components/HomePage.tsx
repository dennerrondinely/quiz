import { z } from 'zod';
import { CategoryCard } from '@/features/quiz/components/CategoryCard';
import { CategoryCardSkeleton } from '@/features/quiz/components/CategoryCardSkeleton';
import { useCategories } from '@/features/quiz/hooks/useCategories';
import { useQuizHistoryStore } from '@/features/quiz/store';
import { Route as HomeRoute } from '@/routes/index';
import { Button } from '@/shared/ui';

export const homeSearchSchema = z.object({
  error: z.enum(['category-not-found']).optional().catch(undefined),
});

type HomeSearch = z.infer<typeof homeSearchSchema>;

function getLastScorePercent(
  categoryId: string,
  getAttemptsByCategory: (id: string) => { score: number; total: number; completedAt: string }[],
): number | null {
  const attempts = getAttemptsByCategory(categoryId);
  if (attempts.length === 0) return null;
  const latest = [...attempts].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
  return Math.round((latest.score / latest.total) * 100);
}

export function HomePage() {
  const { error } = HomeRoute.useSearch() as HomeSearch;
  const { data: categories, isPending, isError, refetch } = useCategories();
  const getAttemptsByCategory = useQuizHistoryStore((s) => s.getAttemptsByCategory);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Development Quiz</h1>
        <p className="text-muted-foreground">Test your knowledge of AI development concepts</p>
      </header>

      {error === 'category-not-found' && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Category not found. Please select a valid category below.
        </div>
      )}

      {isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CategoryCardSkeleton />
          <CategoryCardSkeleton />
          <CategoryCardSkeleton />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-destructive">Failed to load categories.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {categories && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              lastScorePercent={getLastScorePercent(category.id, getAttemptsByCategory)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
