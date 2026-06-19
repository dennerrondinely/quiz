import { useTodosList } from '@/features/todos/hooks/useTodos';
import { useTodosUiStore } from '@/features/todos/store';
import { normalizeForSearch } from '@/shared/lib/normalize';
import { Card, CardContent } from '@/shared/ui';

interface TodoListProps {
  query?: string;
}

export function TodoList({ query = '' }: TodoListProps) {
  const { data, isPending, isError, error } = useTodosList();
  const filter = useTodosUiStore((s) => s.filter);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Failed to load: {error.message}
      </p>
    );
  }

  const normalizedQuery = normalizeForSearch(query);
  const filtered = data.filter((t) => {
    const matchesStatus =
      filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed;
    if (!matchesStatus) return false;
    if (!normalizedQuery) return true;
    return normalizeForSearch(t.title).includes(normalizedQuery);
  });

  if (filtered.length === 0) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        {normalizedQuery
          ? `No todos found for "${query.trim()}".`
          : 'No todos found.'}
      </p>
    );
  }

  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">
        {filtered.length} {filtered.length === 1 ? 'todo' : 'todos'}
      </p>
      <ul className="space-y-2">
        {filtered.map((todo) => (
          <li key={todo.id}>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                  {todo.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {todo.completed ? 'done' : 'pending'}
                </span>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
