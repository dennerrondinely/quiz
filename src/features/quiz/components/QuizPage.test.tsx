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
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QuizPage } from '@/features/quiz/components/QuizPage';
import { useQuizSessionStore } from '@/features/quiz/session-store';
import { agentFundamentalsFixture, QUIZ_API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
}

async function setup({ categoryId = 'agent-fundamentals' } = {}) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => null,
  });
  const quizRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/quiz/$categoryId',
    component: () => <QuizPage categoryId={categoryId} />,
  });
  const resultsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/results/$categoryId',
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute, quizRoute, resultsRoute]),
    history: createMemoryHistory({ initialEntries: [`/quiz/${categoryId}`] }),
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
  useQuizSessionStore.setState({
    currentCategoryId: null,
    currentQuestionIndex: 0,
    answers: [],
    isSessionActive: false,
    isAnswered: false,
  });
});

afterEach(() => {
  useQuizSessionStore.setState({
    currentCategoryId: null,
    currentQuestionIndex: 0,
    answers: [],
    isSessionActive: false,
    isAnswered: false,
  });
});

describe('QuizPage', () => {
  it('renders the first question, progress, and 4 option buttons', async () => {
    // Given / When
    await setup();

    // Then
    const firstQuestion = agentFundamentalsFixture.questions[0];
    expect(await screen.findByText(firstQuestion.question)).toBeInTheDocument();
    expect(screen.getByText(/question 1 of/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('marks correct option with success styling after clicking the right answer', async () => {
    // Given
    const user = userEvent.setup();
    await setup();

    const firstQuestion = agentFundamentalsFixture.questions[0];
    await screen.findByText(firstQuestion.question);
    const buttons = screen.getAllByRole('button');

    // When — click the correct answer (index 1 → button index 1)
    await user.click(buttons[firstQuestion.correctAnswer]);

    // Then
    expect(buttons[firstQuestion.correctAnswer]).toHaveClass('bg-success');
    expect(screen.getByText(firstQuestion.explanation)).toBeInTheDocument();
    expect(buttons[0]).toBeDisabled();
  });

  it('marks chosen wrong option destructive and correct option success', async () => {
    // Given
    const user = userEvent.setup();
    await setup();

    const firstQuestion = agentFundamentalsFixture.questions[0];
    await screen.findByText(firstQuestion.question);
    const buttons = screen.getAllByRole('button');
    const wrongIndex = firstQuestion.correctAnswer === 0 ? 1 : 0;

    // When — click a wrong answer
    await user.click(buttons[wrongIndex]);

    // Then
    expect(buttons[wrongIndex]).toHaveClass('bg-destructive');
    expect(buttons[firstQuestion.correctAnswer]).toHaveClass('bg-success');
  });

  it('advances to next question when Next Question is clicked', async () => {
    // Given
    const user = userEvent.setup();
    await setup();

    const firstQuestion = agentFundamentalsFixture.questions[0];
    const secondQuestion = agentFundamentalsFixture.questions[1];
    await screen.findByText(firstQuestion.question);
    const buttons = screen.getAllByRole('button');

    // When
    await user.click(buttons[firstQuestion.correctAnswer]);
    await user.click(screen.getByRole('button', { name: /next question/i }));

    // Then
    expect(await screen.findByText(secondQuestion.question)).toBeInTheDocument();
    expect(screen.getByText(/question 2 of/i)).toBeInTheDocument();
  });

  it('navigates to home with error when categoryId does not exist', async () => {
    // Given
    const { router } = await setup({ categoryId: 'nonexistent' });

    // Then — after categories load, redirect to /?error=category-not-found
    await screen.findByText(/loading/i);

    // Override so categories load without the invalid category
    server.use(http.get(QUIZ_API_URL, () => HttpResponse.json([agentFundamentalsFixture])));

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(router.state.location.pathname).toBe('/');
    expect(router.state.location.search).toMatchObject({ error: 'category-not-found' });
  });
});
