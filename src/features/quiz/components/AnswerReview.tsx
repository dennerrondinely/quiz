import { useState } from 'react';
import type { Question } from '@/features/quiz/schemas';
import { cn } from '@/shared/lib/cn';

interface AnswerReviewProps {
  questions: Question[];
  answers: number[];
}

export function AnswerReview({ questions, answers }: AnswerReviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80"
      >
        Review Answers {isOpen ? '▴' : '▾'}
      </button>

      {isOpen && (
        <ol className="flex flex-col gap-6">
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <li key={question.id} className="flex flex-col gap-1 text-sm">
                <p className="font-medium">{question.question}</p>
                <p
                  className={cn(
                    'flex items-center gap-1',
                    isCorrect ? 'text-success' : 'text-destructive',
                  )}
                >
                  <span>{isCorrect ? '✓' : '✗'}</span>
                  <span>
                    Your answer:{' '}
                    {userAnswer !== undefined ? question.options[userAnswer] : <em>unanswered</em>}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-muted-foreground">
                    Correct: {question.options[question.correctAnswer]}
                  </p>
                )}
                <p className="italic text-muted-foreground">{question.explanation}</p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
