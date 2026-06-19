import { TodoForm } from '@/features/todos/components/TodoForm';
import { TodoList } from '@/features/todos/components/TodoList';
import { TodoSearchInput } from '@/features/todos/components/TodoSearchInput';
import { useTodosUiStore } from '@/features/todos/store';
import { Route as TodosRoute } from '@/routes/todos';
import { cn } from '@/shared/lib/cn';

const filters = ['all', 'active', 'completed'] as const;

export function TodosPage() {
  const { q } = TodosRoute.useSearch();
  const filter = useTodosUiStore((s) => s.filter);
  const setFilter = useTodosUiStore((s) => s.setFilter);

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Todos</h1>
        <p className="text-sm text-muted-foreground">
          Example feature demonstrating RHF + Zod + TanStack Query + Zustand + MSW.
        </p>
      </header>
      <TodoForm />
      <TodoSearchInput />
      <nav aria-label="Filters" className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md px-3 py-1 text-sm border',
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent',
            )}
          >
            {f}
          </button>
        ))}
      </nav>
      <TodoList query={q} />
    </section>
  );
}
