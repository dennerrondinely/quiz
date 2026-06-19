import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HomePage, homeSearchSchema } from '@/features/quiz/components/HomePage';
import { useQuizHistoryStore } from '@/features/quiz/store';
import { agentFundamentalsFixture, QUIZ_API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
}

async function setup({ search = '' } = {}) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
    validateSearch: homeSearchSchema,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute]),
    history: createMemoryHistory({ initialEntries: [`/${search}`] }),
  });
  await router.load();
  const queryClient = createTestQueryClient();
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { router, queryClient, ...utils };
}

beforeEach(() => {
  useQuizHistoryStore.setState({ attempts: [] });
});

afterEach(() => {
  useQuizHistoryStore.setState({ attempts: [] });
});

describe('HomePage', () => {
  it('renders skeletons while categories are loading', async () => {
    // Given
    server.use(
      http.get(QUIZ_API_URL, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      }),
    );

    // When
    await setup();

    // Then — heading visible but no category data yet
    expect(screen.getByRole('heading', { name: /ai development quiz/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /start quiz/i })).not.toBeInTheDocument();
  });

  it('renders category cards after successful fetch', async () => {
    // Given / When
    await setup();

    // Then
    expect(await screen.findByText(agentFundamentalsFixture.title)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /start quiz/i }).length).toBeGreaterThan(0);
  });

  it('shows last score when history store has an attempt for a category', async () => {
    // Given
    useQuizHistoryStore.setState({
      attempts: [
        {
          id: crypto.randomUUID(),
          categoryId: agentFundamentalsFixture.id,
          completedAt: new Date().toISOString(),
          score: 8,
          total: 10,
          answers: [1, 2, 0, 1, 2, 0, 1, 2, 0, 1],
        },
      ],
    });

    // When
    await setup();

    // Then
    expect(await screen.findByText(/last score: 80%/i)).toBeInTheDocument();
  });

  it('shows error message and Try again button on API failure', async () => {
    // Given
    server.use(http.get(QUIZ_API_URL, () => new HttpResponse(null, { status: 500 })));
    const user = userEvent.setup();

    // When
    await setup();

    // Then
    expect(await screen.findByText(/failed to load categories/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

    // clicking Try again triggers refetch
    server.use(http.get(QUIZ_API_URL, () => HttpResponse.json([agentFundamentalsFixture])));
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText(agentFundamentalsFixture.title)).toBeInTheDocument();
  });

  it('shows category-not-found alert when error search param is present', async () => {
    // Given / When
    await setup({ search: '?error=category-not-found' });

    // Then
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/category not found/i);
  });
});
