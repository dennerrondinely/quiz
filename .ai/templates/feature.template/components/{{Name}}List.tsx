import { use{{Name}}List } from '../hooks/use{{Name}}';

export function {{Name}}List() {
  const { data, isPending, isError, error } = use{{Name}}List();

  if (isPending) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (isError) return <p role="alert" className="text-sm text-destructive">Error: {error.message}</p>;
  if (data.length === 0) return <p className="text-sm text-muted-foreground">No items.</p>;

  return (
    <ul className="space-y-2">
      {data.map((item) => (
        <li key={item.id} className="rounded-md border p-3 text-sm">
          {/* TODO: render fields */}
          {item.id}
        </li>
      ))}
    </ul>
  );
}
