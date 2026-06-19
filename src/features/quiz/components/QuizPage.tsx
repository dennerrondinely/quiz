import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { QuestionCard } from '@/features/quiz/components/QuestionCard';
import { useCategories } from '@/features/quiz/hooks/useCategories';
import { useQuizSessionStore } from '@/features/quiz/session-store';
import { Button } from '@/shared/ui';

interface QuizPageProps {
  categoryId: string;
}

export function QuizPage({ categoryId }: QuizPageProps) {
  const navigate = useNavigate();
  const { data: categories, isPending } = useCategories();
  const { currentQuestionIndex, answers, isAnswered, startSession, answerQuestion, nextQuestion } =
    useQuizSessionStore();
  const [pendingAnswer, setPendingAnswer] = useState<number | null>(null);

  const category = categories?.find((c) => c.id === categoryId);

  useEffect(() => {
    if (!isPending && !category) {
      void navigate({ to: '/', search: { error: 'category-not-found' } });
    }
  }, [isPending, category, navigate]);

  useEffect(() => {
    if (category && currentQuestionIndex === 0 && answers.length === 0) {
      startSession(categoryId);
    }
  }, [category, categoryId, currentQuestionIndex, answers.length, startSession]);

  if (isPending || !category) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  const question = category.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === category.questions.length - 1;

  function handleAnswer(index: number) {
    answerQuestion(index);
    setPendingAnswer(index);
  }

  function handleNext() {
    nextQuestion();
    setPendingAnswer(null);
  }

  function handleSeeResults() {
    void navigate({ to: '/results/$categoryId', params: { categoryId } });
  }

  return (
    <section className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{category.title}</h1>
        <p className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {category.questions.length}
        </p>
      </header>

      <QuestionCard
        question={question}
        isAnswered={isAnswered}
        pendingAnswer={pendingAnswer}
        onAnswer={handleAnswer}
      />

      {isAnswered && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
          {isLastQuestion ? (
            <Button onClick={handleSeeResults}>See Results</Button>
          ) : (
            <Button onClick={handleNext}>Next Question</Button>
          )}
        </div>
      )}
    </section>
  );
}
