import { createFileRoute } from '@tanstack/react-router';
import { HomePage, homeSearchSchema } from '@/features/quiz/components/HomePage';

export const Route = createFileRoute('/')({
  validateSearch: homeSearchSchema,
  component: HomePage,
});
