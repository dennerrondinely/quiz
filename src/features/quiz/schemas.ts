import { z } from 'zod';

export const questionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string(),
});

export const quizCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema),
});

export const userAttemptSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string(),
  completedAt: z.string().datetime(),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  answers: z.array(z.number().int().min(0).max(3)),
});

export type Question = z.infer<typeof questionSchema>;
export type QuizCategory = z.infer<typeof quizCategorySchema>;
export type UserAttempt = z.infer<typeof userAttemptSchema>;
