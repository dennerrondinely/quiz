import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/features/quiz/api';

export const categoriesKeys = {
  all: ['categories'] as const,
  list: () => [...categoriesKeys.all, 'list'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}
