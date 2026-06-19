import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '@/features/todos/api';
import type { CreateTodoInput, Todo } from '@/features/todos/schemas';

export const todosKeys = {
  all: ['todos'] as const,
  list: () => [...todosKeys.all, 'list'] as const,
};

export function useTodosList() {
  return useQuery({
    queryKey: todosKeys.list(),
    queryFn: todosApi.list,
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTodoInput) => todosApi.create(input),
    onSuccess: (created) => {
      qc.setQueryData<Todo[]>(todosKeys.list(), (prev) => (prev ? [...prev, created] : [created]));
    },
  });
}
