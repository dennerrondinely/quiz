import { createFileRoute } from '@tanstack/react-router';
import { QuizPage } from '@/features/quiz/components/QuizPage';

export const Route = createFileRoute('/quiz/$categoryId')({
  component: function QuizRoute() {
    const { categoryId } = Route.useParams();
    return <QuizPage categoryId={categoryId} />;
  },
});
