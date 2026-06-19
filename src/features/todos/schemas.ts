import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  completed: z.boolean(),
});

export const createTodoInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Maximum 200 characters'),
});

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;
