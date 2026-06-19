import { useNavigate } from '@tanstack/react-router';
import { Search, X } from 'lucide-react';
import { Route as TodosRoute } from '@/routes/todos';
import { cn } from '@/shared/lib/cn';

export function TodoSearchInput({ className }: { className?: string }) {
  const navigate = useNavigate({ from: TodosRoute.fullPath });
  const { q } = TodosRoute.useSearch();

  const setQuery = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, q: value }),
      replace: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && q) {
      e.preventDefault();
      setQuery('');
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search todos…"
        aria-label="Search todos"
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 py-2 text-sm ring-offset-background',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      />
      {q && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
