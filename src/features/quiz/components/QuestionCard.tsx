import type { Question } from '@/features/quiz/schemas';
import { cn } from '@/shared/lib/cn';

const LABELS = ['A', 'B', 'C', 'D'] as const;

interface QuestionCardProps {
  question: Question;
  isAnswered: boolean;
  pendingAnswer: number | null;
  onAnswer: (index: number) => void;
}

export function QuestionCard({ question, isAnswered, pendingAnswer, onAnswer }: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-medium">{question.question}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;
          const isChosen = index === pendingAnswer;

          return (
            <button
              key={option}
              type="button"
              disabled={isAnswered}
              onClick={() => onAnswer(index)}
              className={cn(
                'flex items-start gap-3 rounded-md border border-input bg-background px-4 py-3 text-left text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                !isAnswered && 'hover:bg-accent hover:text-accent-foreground',
                isAnswered && isCorrect && 'border-success bg-success text-success-foreground',
                isAnswered &&
                  isChosen &&
                  !isCorrect &&
                  'border-destructive bg-destructive text-destructive-foreground',
                isAnswered && !isCorrect && !isChosen && 'opacity-50',
              )}
            >
              <span className="shrink-0 font-bold">{LABELS[index]}.</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
