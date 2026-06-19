import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto flex items-center gap-4 px-4 py-3 text-sm">
          <Link to="/" className="font-semibold">
            AI React Starter
          </Link>
          <Link
            to="/todos"
            className="text-muted-foreground hover:text-foreground"
            activeProps={{ className: 'text-foreground font-medium' }}
          >
            Todos
          </Link>
        </nav>
      </header>
      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </div>
  );
}
