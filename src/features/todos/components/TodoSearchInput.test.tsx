import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { TodoSearchInput } from '@/features/todos/components/TodoSearchInput';

async function setup(initialQuery = '') {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const todosRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/todos',
    component: () => <TodoSearchInput />,
    validateSearch: z.object({
      q: z.string().trim().max(100).default('').catch(''),
    }),
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([todosRoute]),
    history: createMemoryHistory({
      initialEntries: [`/todos${initialQuery ? `?q=${initialQuery}` : ''}`],
    }),
  });
  await router.load();
  const queryClient = new QueryClient();
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  await waitFor(() => expect(utils.container.querySelector('input')).not.toBeNull());
  return { router, ...utils };
}

describe('TodoSearchInput', () => {
  it('updates ?q= as the user types', async () => {
    // Given
    const user = userEvent.setup();
    const { router } = await setup();

    // When
    await user.type(screen.getByRole('searchbox', { name: /search todos/i }), 'buy');

    // Then
    await waitFor(() => expect(router.state.location.search).toEqual({ q: 'buy' }));
  });

  it('Esc clears the search', async () => {
    // Given
    const user = userEvent.setup();
    const { router } = await setup('meeting');
    const input = screen.getByRole('searchbox', { name: /search todos/i });

    // When
    await user.click(input);
    await user.keyboard('{Escape}');

    // Then
    await waitFor(() => expect(router.state.location.search).toEqual({ q: '' }));
  });

  it('"Clear search" button clears the search', async () => {
    // Given
    const user = userEvent.setup();
    const { router } = await setup('something');

    // When
    await user.click(screen.getByRole('button', { name: /clear search/i }));

    // Then
    await waitFor(() => expect(router.state.location.search).toEqual({ q: '' }));
  });

  it('clear button does not appear when search is empty', async () => {
    // Given / When
    await setup();

    // Then
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });
});
