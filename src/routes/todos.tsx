import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { TodosPage } from '@/features/todos';

const todosSearchSchema = z.object({
  q: z.string().trim().max(100).default('').catch(''),
});

export const Route = createFileRoute('/todos')({
  component: TodosPage,
  validateSearch: todosSearchSchema,
});
