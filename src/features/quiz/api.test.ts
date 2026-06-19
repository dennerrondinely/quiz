import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { fetchCategories } from '@/features/quiz/api';
import { agentFundamentalsFixture, QUIZ_API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';

describe('fetchCategories', () => {
  it('returns API categories merged with supplemental categories', async () => {
    // Given: API returns 1 category (agent-fundamentals)
    // When
    const result = await fetchCategories();

    // Then: all 3 categories are present
    const ids = result.map((c) => c.id);
    expect(ids).toContain('agent-fundamentals');
    expect(ids).toContain('prompt-engineering');
    expect(ids).toContain('model-selection');
    expect(result).toHaveLength(3);
  });

  it('API category takes precedence when its id collides with a supplemental category', async () => {
    // Given: API returns a category whose id matches a supplemental one
    const apiVersion = {
      ...agentFundamentalsFixture,
      id: 'prompt-engineering',
      title: 'Prompt Engineering (API version)',
    };
    server.use(http.get(QUIZ_API_URL, () => HttpResponse.json([apiVersion])));

    // When
    const result = await fetchCategories();

    // Then: the API version is present and there is no duplicate
    const promptEngCategories = result.filter((c) => c.id === 'prompt-engineering');
    expect(promptEngCategories).toHaveLength(1);
    expect(promptEngCategories[0].title).toBe('Prompt Engineering (API version)');
  });

  it('throws when the API returns a non-2xx status', async () => {
    // Given
    server.use(http.get(QUIZ_API_URL, () => HttpResponse.json(null, { status: 500 })));

    // When / Then
    await expect(fetchCategories()).rejects.toThrow('Quiz API error: 500');
  });

  it('throws when the API response does not match the expected schema', async () => {
    // Given: API returns an array of objects missing required fields
    server.use(http.get(QUIZ_API_URL, () => HttpResponse.json([{ id: 'bad', title: 'Bad' }])));

    // When / Then
    await expect(fetchCategories()).rejects.toThrow();
  });
});
