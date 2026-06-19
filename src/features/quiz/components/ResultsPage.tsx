import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { AnswerReview } from '@/features/quiz/components/AnswerReview';
import { getPerformanceFeedback } from '@/features/quiz/components/get-performance-feedback';
import { useCategories } from '@/features/quiz/hooks/useCategories';
import { useQuizSessionStore } from '@/features/quiz/session-store';
import { useQuizHistoryStore } from '@/features/quiz/store';
import { Button } from '@/shared/ui';

interface ResultsPageProps {
  categoryId: string;
}

export function ResultsPage({ categoryId }: ResultsPageProps) {
  const navigate = useNavigate();
  const { isSessionActive, answers, resetSession } = useQuizSessionStore();
  const addAttempt = useQuizHistoryStore((s) => s.addAttempt);
  const { data: categories } = useCategories();
  const hasRecorded = useRef(false);
  const wasSessionActiveOnMount = useRef(isSessionActive);

  const category = categories?.find((c) => c.id === categoryId);

  useEffect(() => {
    if (!wasSessionActiveOnMount.current) {
      void navigate({ to: '/' });
    }
  }, [navigate]);

  useEffect(() => {
    if (isSessionActive && category && !hasRecorded.current) {
      hasRecorded.current = true;
      const score = answers.reduce(
        (count, answer, i) => count + (answer === category.questions[i]?.correctAnswer ? 1 : 0),
        0,
      );
      const pct =
        category.questions.length === 0 ? 0 : Math.round((score / category.questions.length) * 100);
      addAttempt({
        categoryId,
        completedAt: new Date().toISOString(),
        score,
        total: category.questions.length,
        answers,
      });
      toast.success(`Quiz complete! Score: ${pct}%`);
    }
  }, [isSessionActive, category, answers, categoryId, addAttempt]);

  if (!wasSessionActiveOnMount.current || !category) {
    return null;
  }

  const score = answers.reduce(
    (count, answer, i) => count + (answer === category.questions[i]?.correctAnswer ? 1 : 0),
    0,
  );
  const total = category.questions.length;
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);

  function handleRetake() {
    resetSession();
    void navigate({ to: '/quiz/$categoryId', params: { categoryId } });
  }

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Results: {category.title}</h1>
        <p className="text-4xl font-bold">
          {score} of {total} correct
          <span className="ml-2 text-2xl font-semibold text-muted-foreground">({percent}%)</span>
        </p>
        <p className="text-muted-foreground">{getPerformanceFeedback(score, total)}</p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button onClick={handleRetake}>Retake Quiz</Button>
      </div>

      <AnswerReview questions={category.questions} answers={answers} />
    </section>
  );
}
