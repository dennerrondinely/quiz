import { HttpResponse, http } from 'msw';
import type { QuizCategory } from '@/features/quiz/schemas';

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

export const handlers = [
  http.get(QUIZ_API_URL, () => HttpResponse.json([agentFundamentalsFixture])),
];
