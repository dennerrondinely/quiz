# Tasks: Quiz Data Layer

**Plan:** ./plan.md

Check tasks with `[x]` when done. Maintain order — dependencies flow top to bottom.

> **ID correction (verified live):** the API returns `id: "agent-fundamentals"`, not `"1"`.
> Use `"prompt-engineering"` and `"model-selection"` as supplemental category IDs.

---

## Setup

- [x] T001 Create folder `src/features/quiz/hooks/` (mkdir; no files yet)
- [x] T002 Create `src/features/quiz/index.ts` as an empty barrel (add exports as files are created)

## Schemas

- [x] T010 Create `src/features/quiz/schemas.ts` with three Zod schemas and their inferred types:
  - `questionSchema` — id: number, question: string, options: array(string).length(4), correctAnswer: int min(0) max(3), explanation: string
  - `quizCategorySchema` — id: string, title: string, description: string, questions: array(questionSchema)
  - `userAttemptSchema` — id: uuid string, categoryId: string, completedAt: ISO datetime string, score: int min(0), total: int min(1), answers: array(int 0–3)
  - Export types: `Question`, `QuizCategory`, `UserAttempt`
- [x] T011 Create `src/features/quiz/schemas.test.ts` with unit tests:
  - `questionSchema` passes valid data
  - `questionSchema` rejects options array with length ≠ 4
  - `questionSchema` rejects `correctAnswer` outside 0–3
  - `quizCategorySchema` rejects missing `questions` field
  - `userAttemptSchema` rejects non-UUID id
  - `userAttemptSchema` rejects non-ISO `completedAt`
- [x] T012 Verify: `npm test -- schemas` passes

## Supplemental data

- [x] T020 Create `src/features/quiz/supplemental-data.ts`:
  - Typed as `QuizCategory[]`, exported as `SUPPLEMENTAL_CATEGORIES`
  - Category 1: id `"prompt-engineering"`, title "Prompt Engineering", 5 questions about: few-shot vs zero-shot prompting, chain-of-thought reasoning, role prompting, effect of temperature on output variability, prompt injection risks
  - Category 2: id `"model-selection"`, title "Model Selection", 5 questions about: context window trade-offs, cost vs capability spectrum, latency considerations for real-time apps, when to fine-tune vs prompt-engineer, choosing between models for structured output tasks
  - Each question has exactly 4 options, a correct answer index 0–3, and an explanation

## API client

- [x] T030 Add MSW handler in `src/test/msw/handlers.ts` for `GET https://6a3462338248ee962fa55f42.mockapi.io/quiz` returning a fixture with one category (id `"agent-fundamentals"`)
- [x] T031 Create `src/features/quiz/api.ts` with `fetchCategories()`:
  - Uses native `fetch` (not `httpClient`/axios)
  - Throws on non-2xx response
  - Parses response with `z.array(quizCategorySchema)` — throws on invalid shape
  - Filters supplemental categories by ID collision, merges API result first
  - Returns `Promise<QuizCategory[]>`
- [x] T032 Create `src/features/quiz/api.test.ts` with unit tests using MSW:
  - Merged list contains `"agent-fundamentals"` (from API) + both supplemental categories
  - When API returns a category with id `"prompt-engineering"`, the API version wins
  - Throws when API returns 500
  - Throws when API returns JSON that fails Zod parse
- [x] T033 Verify: `npm test -- api` passes

## Hook

- [x] T040 Create `src/features/quiz/hooks/useCategories.ts`:
  - Export `categoriesKeys` factory: `{ all, list() }`
  - Export `useCategories()` using `useQuery` with `queryFn: fetchCategories` and `staleTime: 5 * 60 * 1000`
- [x] T041 Create `src/features/quiz/hooks/useCategories.test.tsx` (integration test, uses project render util with QueryClient):
  - Shows loading state then resolves to the merged category list
  - Shows error state when API returns 500 (override MSW handler per-test)
- [x] T042 Verify: `npm test -- useCategories` passes

## Store

- [x] T050 Create `src/features/quiz/store.ts`:
  - `useQuizHistoryStore` with `persist` middleware (`name: 'quiz-history'`)
  - State: `attempts: UserAttempt[]`
  - `addAttempt(attempt: Omit<UserAttempt, 'id'>)`: generates UUID with `crypto.randomUUID()`, validates full object with `userAttemptSchema.parse()`, enforces cap of 10 per category (evict oldest when exceeded)
  - `clearHistory()`: resets `attempts` to `[]`
  - `getAttemptsByCategory(categoryId: string): UserAttempt[]`: inline filter, not stored
  - `onRehydrateStorage`: validates rehydrated `attempts` with `z.array(userAttemptSchema).catch([]).parse()`
- [x] T051 Create `src/features/quiz/store.test.ts` with unit tests:
  - `addAttempt` saves an attempt and the returned store has id (UUID) set
  - After 10 attempts in the same category, adding an 11th evicts the oldest
  - Cap is per-category: 10 in `"agent-fundamentals"` + 10 in `"prompt-engineering"` = 20 total (valid)
  - `clearHistory` empties the array
  - `getAttemptsByCategory` returns only matching category attempts
  - Corrupted/missing localStorage rehydrates to empty array without throwing
- [x] T052 Verify: `npm test -- store` passes

## Public barrel

- [x] T060 Fill `src/features/quiz/index.ts` — export only the public surface:
  - `useCategories`, `categoriesKeys` (hook consumers)
  - `useQuizHistoryStore` (store consumers)
  - Types: `Question`, `QuizCategory`, `UserAttempt` (type-only exports)
  - Do NOT export `fetchCategories`, `SUPPLEMENTAL_CATEGORIES`, or internal schema objects

## Polish

- [x] T070 `npm run lint:fix` — fix any Biome issues
- [x] T071 `npm run typecheck` — zero errors
- [x] T072 `npm test` — all tests green
- [x] T073 Update `specs/001-quiz-data-layer/spec.md` → `Status: done`
- [x] T074 Update `specs/INDEX.md` — move entry from "Approved" to "Done"
