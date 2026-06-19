import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { getRecentAttempts } from '@/features/quiz/components/get-recent-attempts';
import type { QuizCategory, UserAttempt } from '@/features/quiz/schemas';
import { useQuizHistoryStore } from '@/features/quiz/store';
import { Button } from '@/shared/ui';

interface RecentAttemptsProps {
  attempts: UserAttempt[];
  categories: QuizCategory[] | undefined;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

export function RecentAttempts({ attempts, categories }: RecentAttemptsProps) {
  const clearHistory = useQuizHistoryStore((s) => s.clearHistory);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const recent = getRecentAttempts(attempts);

  function handleConfirmClear() {
    clearHistory();
    setConfirmOpen(false);
  }

  return (
    <section aria-labelledby="recent-attempts-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="recent-attempts-heading" className="text-lg font-semibold">
          Recent Attempts
        </h2>
        <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
          Clear History
        </Button>
      </div>

      <ol className="space-y-2">
        {recent.map((attempt) => {
          const categoryTitle =
            categories?.find((c) => c.id === attempt.categoryId)?.title ?? attempt.categoryId;
          const percent =
            attempt.total === 0 ? 0 : Math.round((attempt.score / attempt.total) * 100);
          const date = dateFormatter.format(new Date(attempt.completedAt));

          return (
            <li
              key={attempt.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div className="space-y-0.5">
                <p className="font-medium">{categoryTitle}</p>
                <p className="text-muted-foreground">{date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {attempt.score} / {attempt.total}
                </p>
                <p className="text-muted-foreground">{percent}%</p>
              </div>
            </li>
          );
        })}
      </ol>

      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 shadow-lg"
            aria-describedby="clear-history-desc"
          >
            <Dialog.Title className="mb-1 text-lg font-semibold">Clear History</Dialog.Title>
            <Dialog.Description
              id="clear-history-desc"
              className="mb-4 text-sm text-muted-foreground"
            >
              This will permanently delete all your quiz attempts. This action cannot be undone.
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmClear}>
                Clear All
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
