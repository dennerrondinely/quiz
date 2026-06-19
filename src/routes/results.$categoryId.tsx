import { createFileRoute } from '@tanstack/react-router';
import { ResultsPage } from '@/features/quiz/components/ResultsPage';

export const Route = createFileRoute('/results/$categoryId')({
  component: function ResultsRoute() {
    const { categoryId } = Route.useParams();
    return <ResultsPage categoryId={categoryId} />;
  },
});
