# Plan: Complete Quiz Experience

**Spec:** ./spec.md
**Created:** 2026-06-19

## Technical summary

Add a session Zustand store, three route-connected page components (`HomePage`, `QuizPage`, `ResultsPage`), and supporting presentational components inside `src/features/quiz/components/`; wire them to TanStack Router file-based routes; add a `success` Tailwind token for correct-answer highlights.

## Proposed structure

```
src/features/quiz/
├── schemas.ts              (existing)
├── supplemental-data.ts    (existing)
├── api.ts                  (existing)
├── hooks/useCategories.ts  (existing)
├── store.ts                (existing — history persist store)
├── session-store.ts        (NEW — ephemeral session, no persist)
├── components/
│   ├── HomePage.tsx        (NEW — page container)
│   ├── CategoryCard.tsx    (NEW — single category tile)
│   ├── CategoryCardSkeleton.tsx  (NEW — loading placeholder)
│   ├── QuizPage.tsx        (NEW — page container)
│   ├── QuestionCard.tsx    (NEW — one question + 4 options)
│   ├── ResultsPage.tsx     (NEW — page container)
│   └── AnswerReview.tsx    (NEW — collapsed review accordion)
└── index.ts                (existing — add new component exports)

src/routes/
├── __root.tsx              (EDIT — update app title in nav)
├── index.tsx               (REPLACE — wire to HomePage)
├── quiz.$categoryId.tsx    (NEW)
└── results.$categoryId.tsx (NEW)

src/index.css               (EDIT — add success/success-foreground tokens)
```

## Zod schemas

No new domain schemas — all data shapes from spec 001 are already in `schemas.ts`.

**Route search params** (home page only):

```ts
// src/routes/index.tsx
const homeSearchSchema = z.object({
  error: z.enum(['category-not-found']).optional().catch(undefined),
});
```

The home page reads `?error=category-not-found` to display an inline alert after an
invalid-category redirect. This avoids a toast library dependency.
[ASSUMPTION: URL search param is an acceptable substitute for a floating toast since no toast library is installed.]

## Routes

| Route | File | Component |
|---|---|---|
| `/` | `src/routes/index.tsx` | `HomePage` |
| `/quiz/$categoryId` | `src/routes/quiz.$categoryId.tsx` | `QuizPage` |
| `/results/$categoryId` | `src/routes/results.$categoryId.tsx` | `ResultsPage` |

- No loaders — categories are fetched client-side via `useCategories()` with 5-min stale time.
- `/` validates `error` search param with Zod.
- `/quiz/$categoryId` and `/results/$categoryId` use `Route.useParams()` for `categoryId`; no search params.
- No `loader` pre-fetch: the home page handles loading/error states inline.

## Components

### `session-store.ts`

Zustand store, **no** `persist` middleware (intentionally ephemeral).

```ts
interface QuizSessionState {
  currentCategoryId: string | null;
  currentQuestionIndex: number;
  answers: number[];
  isSessionActive: boolean;
  isAnswered: boolean;
}
```

Actions:
- `startSession(categoryId: string)` — resets all state, sets `isSessionActive: true`, `currentCategoryId`.
- `answerQuestion(answerIndex: number)` — appends `answerIndex` to `answers`, sets `isAnswered: true`.
- `nextQuestion()` — increments `currentQuestionIndex`, sets `isAnswered: false`.
- `resetSession()` — full reset to initial state (used by "Retake Quiz").

### `HomePage.tsx`

- Calls `useCategories()` and `useQuizHistoryStore`.
- Reads `Route.useSearch()` for optional `error` param → shows an inline alert banner when present.
- Renders loading skeleton (3 × `CategoryCardSkeleton`) while fetching.
- Renders error message + "Try again" button (`refetch()` from `useCategories`) on failure.
- Renders a responsive grid (`grid-cols-1 sm:grid-cols-3`) of `CategoryCard`.
- Derives "last score" per category: `getAttemptsByCategory(id)` sorted by `completedAt` desc, take first.

### `CategoryCard.tsx`

Props: `category: QuizCategory`, `lastScorePercent: number | null`.

- Renders `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@/shared/ui`.
- Shows: title, description, "{N} questions", optional "Last score: X%", "Start Quiz" `Button` → navigates to `/quiz/$categoryId`.

### `CategoryCardSkeleton.tsx`

- Renders a `Card`-shaped placeholder using `bg-muted animate-pulse` blocks.
- No props.

### `QuizPage.tsx`

- Reads `categoryId` from `Route.useParams()`.
- Calls `useCategories()` to get category data.
- On category resolution: if not found → `navigate({ to: '/', search: { error: 'category-not-found' } })`.
- On mount (once, via `useEffect`): calls `startSession(categoryId)` if `currentCategoryId !== categoryId`.
- Local state: `pendingAnswer: number | null` — the option the user clicked but hasn't confirmed yet.
- Derives `currentQuestion` from `category.questions[currentQuestionIndex]`.
- Renders: category title, progress bar text, `QuestionCard`.
- On option click: set `pendingAnswer`, call `answerQuestion(pendingAnswer)`.
- Shows explanation + "Next Question" / "See Results" button only when `isAnswered`.
- "Next Question" → `nextQuestion()`, reset `pendingAnswer`.
- "See Results" → `navigate({ to: '/results/$categoryId', params: { categoryId } })`.

### `QuestionCard.tsx`

Props: `question: Question`, `isAnswered: boolean`, `pendingAnswer: number | null`, `onAnswer: (index: number) => void`.

- Renders question text and 4 buttons labelled A, B, C, D.
- When `isAnswered`:
  - Correct option → `bg-success text-success-foreground` (green).
  - `pendingAnswer` if wrong → `bg-destructive text-destructive-foreground` (red).
  - All buttons `disabled`.
- When not answered: all buttons enabled, no highlight.
- Uses `cn()` for conditional classes.

### `ResultsPage.tsx`

- Reads `categoryId` from `Route.useParams()`.
- Reads `useQuizSessionStore`: if `!isSessionActive` → `navigate({ to: '/' })` immediately.
- Reads `useCategories()` to get question list for the score calculation and review.
- Calculates score: `answers.filter((a, i) => a === category.questions[i].correctAnswer).length`.
- Saves attempt once via `useEffect` (runs once on mount):
  ```ts
  useEffect(() => {
    addAttempt({ categoryId, completedAt: new Date().toISOString(), score, total, answers });
  }, []); // empty deps — ephemeral store guarantees single fire
  ```
- Derives `feedbackMessage` from score percentage:
  - ≥ 80 %: "Excellent! You're mastering AI development concepts!"
  - 60–79 %: "Good job! You're getting there!"
  - < 60 %: "Keep practicing! Review the fundamentals."
- Renders: score display, feedback, `AnswerReview` (collapsed), "Back to Home" `Button`, "Retake Quiz" `Button`.
- "Retake Quiz" → `resetSession()` then `navigate({ to: '/quiz/$categoryId', params: { categoryId } })`.

### `AnswerReview.tsx`

Props: `questions: Question[]`, `answers: number[]`.

- Local state: `isOpen: boolean` (default `false`).
- Renders a toggle button "Review Answers ▾" / "Review Answers ▴".
- When open: maps questions, shows question text, user's chosen option (with ✓ or ✗ prefix), correct option, explanation.
- ✓/✗ implemented with simple Unicode characters or inline SVG — no icon library needed.

## State

### Server state

| Hook | Query key | staleTime |
|---|---|---|
| `useCategories()` | `['categories', 'list']` | 5 min (existing) |

No new queries or mutations needed.

### Client state

| Store | Persist | Purpose |
|---|---|---|
| `useQuizHistoryStore` (existing) | localStorage | Completed attempts |
| `useQuizSessionStore` (new) | none | Active quiz session |

### Form state

None — no forms in this feature.

## Tailwind token addition

Add to `src/index.css` inside `@theme {}`:

```css
--color-success: oklch(0.55 0.15 145);
--color-success-foreground: oklch(0.99 0 0);
```

This gives semantic green for correct-answer highlighting without hardcoding hex values.

## External dependencies

No new runtime dependencies.

- `@radix-ui/react-slot` — already installed (used by `Button`).
- All Tailwind utilities used are either existing tokens or the new `success` token above.
- Unicode ✓ / ✗ characters used for correct/incorrect indicators — no icon library needed.

## Tests

### Unit — `get-performance-feedback.test.ts`

Extract `getPerformanceFeedback(score: number, total: number): string` as a pure function in a dedicated file (e.g. `src/features/quiz/components/get-performance-feedback.ts`). Test:
- Score ≥ 80 % → correct message.
- Score 60–79 % → correct message.
- Score < 60 % → correct message.
- Edge cases: exactly 80 %, exactly 60 %, 0 %.

### Integration — `HomePage.test.tsx`

MSW handlers already set up (spec 001). Test:
- Renders skeleton while loading.
- Renders category cards when data resolves.
- Renders "Last score: X%" when history store has an attempt.
- Renders error state + "Try again" on API failure.
- Renders inline alert when `?error=category-not-found` is in URL.

### Integration — `QuizPage.test.tsx`

- Renders question, progress, and four labelled options.
- After clicking correct option: correct option is green, others disabled, explanation shown.
- After clicking wrong option: chosen option is red, correct option is green.
- "Next Question" advances to next question.
- On invalid categoryId: navigates to `/?error=category-not-found`.

### Integration — `ResultsPage.test.tsx`

- Redirects to `/` when session is not active.
- Renders score, feedback message, collapsed review section.
- Calls `addAttempt` exactly once on mount.
- "Retake Quiz" resets session and navigates to quiz.
- Expanding "Review Answers" shows all questions.

### E2E — `e2e/quiz-flow.spec.ts`

Critical path: home → select category → answer all questions → see results page with correct score → retake returns to question 1.

## Risks / points of attention

- **Attempt saved exactly once**: the `useEffect(fn, [])` guard works because the session store is ephemeral — a page refresh clears it, causing the ResultsPage to redirect rather than re-run the effect. No `useRef` guard needed.
- **Race on category load in QuizPage**: `useCategories()` may still be loading when QuizPage mounts. Guard with `if (isPending) return <LoadingSpinner />` before the redirect/startSession logic to avoid triggering a redirect before data arrives.
- **`__root.tsx` nav**: the current nav links to `/todos`. This plan updates the nav title to "AI Development Quiz" and adds no new nav links (the quiz is accessed from the home page). The Todos link can be removed or kept — [ASSUMPTION: remove Todos link from nav since this is the quiz app, not the starter template].
- **TanStack Router file naming**: dynamic segments use `.` not `/` in filenames — `quiz.$categoryId.tsx` is correct.
- **`currentQuestionIndex` reset on re-entry**: `startSession` must fully reset state so navigating to a second category after finishing the first starts at question 0.

## Identified reuse

- `src/shared/ui/atoms/button.tsx` — `Button` component with `variant` and `size` props.
- `src/shared/ui/atoms/card.tsx` — `Card`, `CardHeader`, `CardTitle`, `CardContent`.
- `src/shared/lib/cn.ts` — `cn()` for conditional class merging on option buttons.
- `src/features/quiz/hooks/useCategories.ts` — server state, already wired with MSW for tests.
- `src/features/quiz/store.ts` — `useQuizHistoryStore` for last-score display and `addAttempt`.
- `src/features/todos/components/TodosPage.tsx` — reference for page-level loading/error/data pattern.
- `src/routes/todos.tsx` — reference for `createFileRoute` + feature page import pattern.
