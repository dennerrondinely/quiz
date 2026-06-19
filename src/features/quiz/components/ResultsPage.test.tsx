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
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultsPage } from '@/features/quiz/components/ResultsPage';
import { useQuizSessionStore } from '@/features/quiz/session-store';
import { useQuizHistoryStore } from '@/features/quiz/store';
import { agentFundamentalsFixture } from '@/test/msw/handlers';

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
}

const ACTIVE_SESSION = {
  currentCategoryId: agentFundamentalsFixture.id,
  currentQuestionIndex: agentFundamentalsFixture.questions.length,
  // both correct: question 0 correct=1, question 1 correct=2
  answers: [
    agentFundamentalsFixture.questions[0].correctAnswer,
    agentFundamentalsFixture.questions[1].correctAnswer,
  ],
  isSessionActive: true,
  isAnswered: true,
};

async function setup({ categoryId = agentFundamentalsFixture.id, session = ACTIVE_SESSION } = {}) {
  useQuizSessionStore.setState(session);
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => null,
  });
  const quizRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/quiz/$categoryId',
    component: () => null,
  });
  const resultsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/results/$categoryId',
    component: () => <ResultsPage categoryId={categoryId} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute, quizRoute, resultsRoute]),
    history: createMemoryHistory({ initialEntries: [`/results/${categoryId}`] }),
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
  vi.mocked(toast.success).mockClear();
  useQuizHistoryStore.setState({ attempts: [] });
  useQuizSessionStore.setState({
    currentCategoryId: null,
    currentQuestionIndex: 0,
    answers: [],
    isSessionActive: false,
    isAnswered: false,
  });
});

afterEach(() => {
  useQuizHistoryStore.setState({ attempts: [] });
  useQuizSessionStore.setState({
    currentCategoryId: null,
    currentQuestionIndex: 0,
    answers: [],
    isSessionActive: false,
    isAnswered: false,
  });
});

describe('ResultsPage', () => {
  it('redirects to / when there is no active session', async () => {
    // Given / When — no active session (default)
    const { router } = await setup({ session: { ...ACTIVE_SESSION, isSessionActive: false } });

    // Then
    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
  });

  it('renders score and performance feedback', async () => {
    // Given / When — 2 of 2 correct → 100% → Excellent
    await setup();

    // Then
    expect(
      await screen.findByText(
        `${agentFundamentalsFixture.questions.length} of ${agentFundamentalsFixture.questions.length} correct`,
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/excellent/i)).toBeInTheDocument();
  });

  it('calls addAttempt exactly once on mount', async () => {
    // Given
    const spy = vi.spyOn(useQuizHistoryStore.getState(), 'addAttempt');

    // When
    await setup();
    await screen.findByText(/correct/i);

    // Then
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    spy.mockRestore();
  });

  it('review section starts collapsed and expands on click', async () => {
    // Given
    const user = userEvent.setup();
    await setup();
    await screen.findByText(/correct/i);

    // Then — initially collapsed
    expect(
      screen.queryByText(agentFundamentalsFixture.questions[0].question),
    ).not.toBeInTheDocument();

    // When — expand
    await user.click(screen.getByRole('button', { name: /review answers/i }));

    // Then — expanded
    expect(screen.getByText(agentFundamentalsFixture.questions[0].question)).toBeInTheDocument();
  });

  it('fires a success toast with the score percentage on mount', async () => {
    // Given / When — 2 of 2 correct → 100%
    await setup();
    await screen.findByText(/correct/i);

    // Then
    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('100%'));
  });

  it('Retake Quiz calls resetSession and navigates to quiz', async () => {
    // Given
    const user = userEvent.setup();
    const { router } = await setup();
    await screen.findByText(/correct/i);

    // When
    await user.click(screen.getByRole('button', { name: /retake quiz/i }));

    // Then
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/quiz/${agentFundamentalsFixture.id}`),
    );
    expect(useQuizSessionStore.getState().isSessionActive).toBe(false);
  });
});
