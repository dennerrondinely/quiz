import { HttpResponse, http } from 'msw';
import type { QuizCategory } from '@/features/quiz/schemas';
import type { Todo } from '@/features/todos/schemas';

const initial: Todo[] = [
  { id: '1', title: 'Ler .ai/rules antes de codar', completed: true },
  { id: '2', title: 'Rodar /specify para criar spec', completed: false },
];

let store: Todo[] = [...initial];

export function resetTodosStore() {
  store = [...initial];
}

// --- Quiz fixtures ---

export const QUIZ_API_URL = 'https://6a3462338248ee962fa55f42.mockapi.io/quiz';

export const agentFundamentalsFixture: QuizCategory = {
  id: 'agent-fundamentals',
  title: 'Agent Fundamentals',
  description: 'Test your knowledge of AI agent design and implementation.',
  questions: [
    {
      id: 1,
      question: 'What is the primary purpose of an AI agent?',
      options: [
        'To replace human workers',
        'To autonomously perform tasks and make decisions',
        'To store data in a database',
        'To render web pages',
      ],
      correctAnswer: 1,
      explanation:
        'An AI agent perceives its environment and takes autonomous actions to achieve goals.',
    },
    {
      id: 2,
      question: 'Which component gives an agent the ability to take actions in the world?',
      options: ['Memory', 'Planning module', 'Tools or actuators', 'Embedding model'],
      correctAnswer: 2,
      explanation:
        'Tools (also called actuators) allow an agent to interact with external systems and environments.',
    },
  ],
};

// --- Todos fixtures ---

const baseURL = '*';

export const handlers = [
  http.get(QUIZ_API_URL, () => HttpResponse.json([agentFundamentalsFixture])),
  http.get(`${baseURL}/todos`, () => HttpResponse.json(store)),
  http.post(`${baseURL}/todos`, async ({ request }) => {
    const body = (await request.json()) as { title: string };
    const created: Todo = { id: crypto.randomUUID(), title: body.title, completed: false };
    store = [...store, created];
    return HttpResponse.json(created, { status: 201 });
  }),
];
