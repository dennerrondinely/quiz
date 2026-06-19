import { Link } from '@tanstack/react-router';
import type { QuizCategory } from '@/features/quiz/schemas';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

interface CategoryCardProps {
  category: QuizCategory;
  lastScorePercent: number | null;
}

export function CategoryCard({ category, lastScorePercent }: CategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{category.description}</p>
        {lastScorePercent !== null && (
          <p className="text-sm font-medium text-foreground">Last score: {lastScorePercent}%</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{category.questions.length} questions</p>
        <Button asChild>
          <Link to="/quiz/$categoryId" params={{ categoryId: category.id }}>
            Start Quiz
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
