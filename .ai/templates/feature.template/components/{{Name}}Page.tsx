import { {{Name}}Form } from './{{Name}}Form';
import { {{Name}}List } from './{{Name}}List';

export function {{Name}}Page() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{{Name}}</h1>
      </header>
      <{{Name}}Form />
      <{{Name}}List />
    </section>
  );
}
