import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { {{name}}Api } from '../api';
import type { Create{{Name}}Input, {{Name}} } from '../schemas';

export const {{name}}Keys = {
  all: ['{{name}}'] as const,
  list: () => [...{{name}}Keys.all, 'list'] as const,
  detail: (id: string) => [...{{name}}Keys.all, 'detail', id] as const,
};

export function use{{Name}}List() {
  return useQuery({
    queryKey: {{name}}Keys.list(),
    queryFn: {{name}}Api.list,
  });
}

export function useCreate{{Name}}() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Create{{Name}}Input) => {{name}}Api.create(input),
    onSuccess: (created) => {
      qc.setQueryData<{{Name}}[]>({{name}}Keys.list(), (prev) => (prev ? [...prev, created] : [created]));
    },
  });
}
