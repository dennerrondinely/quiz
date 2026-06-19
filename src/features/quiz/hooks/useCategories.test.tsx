import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { useCategories } from '@/features/quiz/hooks/useCategories';
import { QUIZ_API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCategories', () => {
  it('resolves to the merged list of all three categories', async () => {
    // Given / When
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    // Then
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const ids = result.current.data?.map((c) => c.id);
    expect(ids).toContain('agent-fundamentals');
    expect(ids).toContain('prompt-engineering');
    expect(ids).toContain('model-selection');
  });

  it('surfaces an error when the API returns 500', async () => {
    // Given
    server.use(http.get(QUIZ_API_URL, () => HttpResponse.json(null, { status: 500 })));

    // When
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    // Then
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
