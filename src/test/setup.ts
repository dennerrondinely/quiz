import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetTodosStore } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetTodosStore();
  cleanup();
});
afterAll(() => server.close());
