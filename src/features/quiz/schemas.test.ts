import { describe, expect, it } from 'vitest';
import { questionSchema, quizCategorySchema, userAttemptSchema } from '@/features/quiz/schemas';

const validQuestion = {
  id: 1,
  question: 'What is an AI agent?',
  options: ['A robot', 'An autonomous system', 'A chatbot', 'A database'],
  correctAnswer: 1,
  explanation: 'An AI agent autonomously perceives its environment and takes actions.',
};

const validCategory = {
  id: 'agent-fundamentals',
  title: 'Agent Fundamentals',
  description: 'Test your knowledge of AI agents.',
  questions: [validQuestion],
};

const validAttempt = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  categoryId: 'agent-fundamentals',
  completedAt: '2026-06-19T10:00:00.000Z',
  score: 4,
  total: 5,
  answers: [1, 0, 2, 3, 1],
};

describe('questionSchema', () => {
  it('passes with valid data', () => {
    expect(() => questionSchema.parse(validQuestion)).not.toThrow();
  });

  it('rejects options array with fewer than 4 items', () => {
    const input = { ...validQuestion, options: ['A', 'B', 'C'] };
    expect(() => questionSchema.parse(input)).toThrow();
  });

  it('rejects options array with more than 4 items', () => {
    const input = { ...validQuestion, options: ['A', 'B', 'C', 'D', 'E'] };
    expect(() => questionSchema.parse(input)).toThrow();
  });

  it('rejects correctAnswer below 0', () => {
    const input = { ...validQuestion, correctAnswer: -1 };
    expect(() => questionSchema.parse(input)).toThrow();
  });

  it('rejects correctAnswer above 3', () => {
    const input = { ...validQuestion, correctAnswer: 4 };
    expect(() => questionSchema.parse(input)).toThrow();
  });

  it('rejects non-integer correctAnswer', () => {
    const input = { ...validQuestion, correctAnswer: 1.5 };
    expect(() => questionSchema.parse(input)).toThrow();
  });
});

describe('quizCategorySchema', () => {
  it('passes with valid data', () => {
    expect(() => quizCategorySchema.parse(validCategory)).not.toThrow();
  });

  it('rejects missing questions field', () => {
    const { questions: _q, ...withoutQuestions } = validCategory;
    expect(() => quizCategorySchema.parse(withoutQuestions)).toThrow();
  });

  it('rejects invalid question inside questions array', () => {
    const input = {
      ...validCategory,
      questions: [{ ...validQuestion, options: ['only', 'three', 'options'] }],
    };
    expect(() => quizCategorySchema.parse(input)).toThrow();
  });
});

describe('userAttemptSchema', () => {
  it('passes with valid data', () => {
    expect(() => userAttemptSchema.parse(validAttempt)).not.toThrow();
  });

  it('rejects non-UUID id', () => {
    const input = { ...validAttempt, id: 'not-a-uuid' };
    expect(() => userAttemptSchema.parse(input)).toThrow();
  });

  it('rejects non-ISO completedAt', () => {
    const input = { ...validAttempt, completedAt: '19/06/2026' };
    expect(() => userAttemptSchema.parse(input)).toThrow();
  });

  it('rejects negative score', () => {
    const input = { ...validAttempt, score: -1 };
    expect(() => userAttemptSchema.parse(input)).toThrow();
  });

  it('rejects total less than 1', () => {
    const input = { ...validAttempt, total: 0 };
    expect(() => userAttemptSchema.parse(input)).toThrow();
  });
});
