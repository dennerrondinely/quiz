import { z } from 'zod';
import type { QuizCategory } from '@/features/quiz/schemas';
import { quizCategorySchema } from '@/features/quiz/schemas';
import { SUPPLEMENTAL_CATEGORIES } from '@/features/quiz/supplemental-data';

const API_URL = 'https://6a3462338248ee962fa55f42.mockapi.io/quiz';

export async function fetchCategories(): Promise<QuizCategory[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Quiz API error: ${res.status}`);
  const raw: unknown = await res.json();
  const apiCategories = z.array(quizCategorySchema).parse(raw);
  const apiIds = new Set(apiCategories.map((c) => c.id));
  const supplemental = SUPPLEMENTAL_CATEGORIES.filter((c) => !apiIds.has(c.id));
  return [...apiCategories, ...supplemental];
}
