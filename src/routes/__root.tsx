import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { UsernameModal } from '@/features/quiz/components/UsernameModal';
import { useUserStore } from '@/features/quiz/user-store';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  const username = useUserStore((s) => s.username);
  const setUsername = useUserStore((s) => s.setUsername);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <nav className="container mx-auto flex items-center gap-4 px-4 py-3 text-sm">
          <Link to="/" className="font-semibold">
            AI Development Quiz
          </Link>
          {username && (
            <span className="ml-auto flex items-center gap-2 text-muted-foreground">
              Welcome, {username}!
              <button
                type="button"
                onClick={() => setShowEdit(true)}
                className="underline hover:text-foreground"
              >
                Edit
              </button>
            </span>
          )}
        </nav>
      </header>

      <Toaster richColors position="top-right" />

      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>

      <UsernameModal open={!username} onSubmit={(name) => setUsername(name)} />
      <UsernameModal
        open={showEdit}
        onSubmit={(name) => {
          setUsername(name);
          setShowEdit(false);
        }}
      />

      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </div>
  );
}

function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-sm underline hover:text-foreground">
        Back to Home
      </Link>
    </section>
  );
}
