# Plan: Quiz Data Layer

**Spec:** ./spec.md
**Created:** 2026-06-19

## Technical summary

Create `src/features/quiz/` with Zod schemas, a native-fetch API client that merges live API categories with locally authored supplemental data, a TanStack Query hook with 5-minute stale time, and a Zustand persist store for quiz history capped at 10 attempts per category.

## Proposed structure

```
src/features/quiz/
├── schemas.ts              # Zod schemas: Question, QuizCategory, UserAttempt
├── supplemental-data.ts    # Static local categories (Prompt Engineering, Model Selection)
├── api.ts                  # native fetch → parse → merge with supplemental
├── hooks/
│   └── useCategories.ts    # TanStack Query hook + categoriesKeys factory
├── store.ts                # Zustand persist store: quiz history
└── index.ts                # public barrel — only exports consumed by routes/features
```

No route file — this spec is data only. No components.

## Zod schemas

File: `src/features/quiz/schemas.ts`

```ts
// Question
questionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()).length(4),          // exactly 4 options
  correctAnswer: z.number().int().min(0).max(3),   // index 0–3
  explanation: z.string(),
});

// QuizCategory
quizCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema),
});

// UserAttempt
userAttemptSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string(),
  completedAt: z.string().datetime(),              // ISO 8601
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  answers: z.array(z.number().int().min(0).max(3)),
});
```

Exported types via `z.infer`: `Question`, `QuizCategory`, `UserAttempt`.

## Supplemental data

File: `src/features/quiz/supplemental-data.ts`

Static `as const` array typed as `QuizCategory[]` with two entries:

- **"Prompt Engineering"** — id: `"2"`, 5 questions covering: few-shot vs zero-shot prompting, chain-of-thought, role prompting, temperature's effect on output variability, prompt injection risk.
- **"Model Selection"** — id: `"3"`, 5 questions covering: context window trade-offs, multimodal vs text-only models, cost vs capability spectrum, latency considerations for real-time apps, when to fine-tune vs prompt-engineer.

IDs are `"prompt-engineering"` and `"model-selection"` — slug format confirmed against the live API, which returns id `"agent-fundamentals"` for the existing category.

## API client

File: `src/features/quiz/api.ts`

Uses **native `fetch`** (not `httpClient`/axios — the target is an absolute external URL, not the app's `VITE_API_BASE_URL`).

```ts
const API_URL = 'https://6a3462338248ee962fa55f42.mockapi.io/quiz';

export async function fetchCategories(): Promise<QuizCategory[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Quiz API error: ${res.status}`);
  const raw = await res.json();
  const apiCategories = z.array(quizCategorySchema).parse(raw);   // validate at boundary
  const apiIds = new Set(apiCategories.map((c) => c.id));
  const supplemental = SUPPLEMENTAL_CATEGORIES.filter((c) => !apiIds.has(c.id));
  return [...apiCategories, ...supplemental];
}
```

Merge rule: API categories win over supplemental when IDs collide. Any network or parse error propagates — TanStack Query surfaces it to the UI.

## Routes

No new routes in this spec.

## Components

No components in this spec.

## State

### Server state — TanStack Query

File: `src/features/quiz/hooks/useCategories.ts`

```ts
export const categoriesKeys = {
  all: ['categories'] as const,
  list: () => [...categoriesKeys.all, 'list'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,   // 5 minutes — override the global 30s default
  });
}
```

### Client state — Zustand persist

File: `src/features/quiz/store.ts`

```ts
interface QuizHistoryState {
  attempts: UserAttempt[];
  addAttempt: (attempt: Omit<UserAttempt, 'id'>) => void;   // id generated here
  clearHistory: () => void;
  getAttemptsByCategory: (categoryId: string) => UserAttempt[];
}
```

`addAttempt` implementation:
1. Generate `id` via `crypto.randomUUID()`.
2. Parse the full object with `userAttemptSchema` to validate at the boundary.
3. Filter existing attempts for the same `categoryId`.
4. Append new attempt; if count > 10, drop the first element (oldest).
5. Merge back with attempts from other categories.

`persist` middleware config:
```ts
persist(storeImpl, {
  name: 'quiz-history',
  // Rehydration validates data from localStorage with Zod
  onRehydrateStorage: () => (state) => {
    if (state) {
      state.attempts = z.array(userAttemptSchema).catch([]).parse(state.attempts);
    }
  },
})
```

`getAttemptsByCategory` is a selector — computes inline, no derived state stored.

### Form state

Not applicable — no forms in this spec.

## External dependencies

No new dependencies needed.

- `zustand` + `zustand/middleware` (persist) — already in use in `features/todos/store.ts`.
- `@tanstack/react-query` — already in use.
- `zod` — already in use.
- `crypto.randomUUID()` — Web API, available in all modern browsers; no polyfill needed.

## Tests

### Unit — `schemas.test.ts`

- `questionSchema`: passes with valid data; fails with 3 or 5 options; fails with `correctAnswer` outside 0–3.
- `quizCategorySchema`: passes with valid category; fails if `questions` is missing.
- `userAttemptSchema`: passes with valid attempt; fails with non-UUID id; fails with non-ISO `completedAt`.

### Unit — `api.test.ts`

Mock `fetch` via MSW (`http.get(API_URL, ...)`) to control API responses:
- Returns merged list when API returns 1 category and supplemental has 2.
- API category with same ID as supplemental takes precedence.
- Throws when API returns a non-2xx status.
- Throws when API returns data that fails Zod parse.

### Unit — `store.test.ts`

Direct store action tests (no render required — call actions on the store directly):
- `addAttempt`: persists an attempt and generates a UUID id.
- `addAttempt`: after 10 attempts for the same category, adding an 11th evicts the oldest.
- `addAttempt`: cap is per-category — 10 in category A + 10 in category B = 20 total, both valid.
- `clearHistory`: empties the array.
- `getAttemptsByCategory`: returns only attempts matching the given id.
- Rehydration: corrupted localStorage data resolves to empty array (Zod `.catch([])`).

### Integration — `useCategories.test.tsx`

Using the project's `render` test util (includes QueryClient wrapper):
- Renders in a loading state, then resolves to the merged category list.
- Renders an error state when the API returns 500.

No E2E for this spec — there are no UI flows to test.

## Risks / points of attention

- **Supplemental ID collision**: If MockAPI auto-assigns a category with id `"2"` or `"3"` in the future, the API version silently replaces the local one. Monitor API state before releasing additional categories.
- **localStorage quota**: Quiz history with 3 categories × 10 attempts × ~5 answers each is tiny; quota is not a concern now, but evict-oldest already defends against unbounded growth.
- **`crypto.randomUUID()` in SSR**: Not applicable (this is a Vite SPA), but flag if the project ever adds SSR.
- **Zod rehydration catch**: Using `.catch([])` swallows corrupted localStorage silently. This is intentional — losing history is preferable to a crash, and the user can always clear manually.

## Identified reuse

- `src/features/todos/schemas.ts` — follow the same pattern: one file per feature, `z.infer` for types, no manual interface declarations.
- `src/features/todos/hooks/useTodos.ts` — copy the `xxxKeys` factory pattern and `useQuery` shape.
- `src/features/todos/store.ts` — Zustand store shape reference; this spec's store adds `persist` middleware (same import path, already installed).
- `src/shared/lib/http.ts` — intentionally NOT used here; api.ts calls an absolute external URL with native fetch per spec constraint.
