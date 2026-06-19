import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI React Starter</h1>
        <p className="text-muted-foreground">
          React/Vite template with Spec-Driven Development and AI-ready rules.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        <Card title="Specs (SDD)" body="Build features with /specify, /plan, /tasks, /implement." />
        <Card title="AI Rules" body="See .ai/rules before writing any new code." />
        <Card
          title="Templates"
          body="Ready-made skeletons in .ai/templates for components, hooks, and features."
        />
        <Card title="Tooling" body="Vite, Vitest, Playwright, Biome, Orval, MSW, TanStack." />
      </ul>
      <Link
        to="/todos"
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        View example feature
      </Link>
    </section>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-lg border p-4">
      <h2 className="font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </li>
  );
}
