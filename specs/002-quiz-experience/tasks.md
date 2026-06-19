# Tasks: Complete Quiz Experience

**Plan:** ./plan.md

Check tasks with `[x]` when done. Maintain order — dependencies flow top to bottom.

---

## Setup

- [x] T001 Add `success` / `success-foreground` CSS tokens to `src/index.css` inside `@theme {}`
  - `--color-success: oklch(0.55 0.15 145)` and `--color-success-foreground: oklch(0.99 0 0)`
  - Verify: `npm run typecheck` passes (no TS impact, but confirms no CSS parse error via Vite)

## Session store

- [x] T010 Create `src/features/quiz/session-store.ts` — ephemeral Zustand store, no `persist`:
  - State: `currentCategoryId: string | null`, `currentQuestionIndex: number`, `answers: number[]`, `isSessionActive: boolean`, `isAnswered: boolean`
  - `startSession(categoryId: string)` — full reset + set `isSessionActive: true`, `currentCategoryId`
  - `answerQuestion(answerIndex: number)` — append to `answers`, set `isAnswered: true`
  - `nextQuestion()` — increment `currentQuestionIndex`, set `isAnswered: false`
  - `resetSession()` — reset everything to initial state
  - Export: `useQuizSessionStore`
- [x] T011 Create `src/features/quiz/session-store.test.ts` — unit tests (direct store calls, no render):
  - `startSession` resets state and sets `isSessionActive: true`
  - `answerQuestion` appends to `answers` and sets `isAnswered: true`
  - `nextQuestion` increments index and clears `isAnswered`
  - `resetSession` returns store to initial state
  - Calling `startSession` a second time resets `answers` (re-entry guard)
- [x] T012 Verify: `npm test -- session-store` passes

## Performance feedback utility

- [x] T020 Create `src/features/quiz/components/get-performance-feedback.ts` — pure function:
  - `getPerformanceFeedback(score: number, total: number): string`
  - ≥ 80 %: "Excellent! You're mastering AI development concepts!"
  - 60–79 %: "Good job! You're getting there!"
  - < 60 %: "Keep practicing! Review the fundamentals."
- [x] T021 Create `src/features/quiz/components/get-performance-feedback.test.ts` — unit tests:
  - Score ≥ 80 % → first message
  - Score 60–79 % → second message
  - Score < 60 % → third message
  - Edge cases: exactly 80 %, exactly 60 %, 0 correct, all correct
- [x] T022 Verify: `npm test -- get-performance-feedback` passes

## Presentational components

- [x] T030 Create `src/features/quiz/components/CategoryCardSkeleton.tsx` — no props, `Card`-shaped `bg-muted animate-pulse` placeholder
- [x] T031 Create `src/features/quiz/components/CategoryCard.tsx`:
  - Props: `category: QuizCategory`, `lastScorePercent: number | null`
  - Uses `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@/shared/ui`
  - Shows title, description, "{N} questions", optional "Last score: X%", "Start Quiz" `Button`
  - "Start Quiz" navigates to `/quiz/$categoryId` via TanStack Router `useNavigate`
- [x] T032 Create `src/features/quiz/components/QuestionCard.tsx`:
  - Props: `question: Question`, `isAnswered: boolean`, `pendingAnswer: number | null`, `onAnswer: (index: number) => void`
  - 4 buttons labelled A, B, C, D + option text
  - When `isAnswered`: correct option → `bg-success text-success-foreground`; wrong chosen option → `bg-destructive text-destructive-foreground`; all `disabled`
  - Uses `cn()` for conditional classes
- [x] T033 Create `src/features/quiz/components/AnswerReview.tsx`:
  - Props: `questions: Question[]`, `answers: number[]`
  - Local `useState(false)` for open/closed
  - Toggle button "Review Answers ▾" / "Review Answers ▴"
  - When open: each question shows question text, user's chosen option (✓ or ✗ prefix), correct option, explanation
- [x] T034 Verify: `npm run typecheck` — zero errors across new components

## Page components

- [x] T040 Create `src/features/quiz/components/HomePage.tsx`:
  - Calls `useCategories()` and `useQuizHistoryStore`
  - Reads `Route.useSearch()` for `error` param → shows inline alert "Category not found" when present
  - Loading: renders 3 × `CategoryCardSkeleton`
  - Error: renders error message + "Try again" button (calls `refetch()`)
  - Success: responsive grid (`grid-cols-1 sm:grid-cols-3`) of `CategoryCard`
  - Derives `lastScorePercent` per category from `getAttemptsByCategory` sorted by `completedAt` desc
  - Header: h1 "AI Development Quiz", subtitle "Test your knowledge of AI development concepts"
- [x] T041 Create `src/features/quiz/components/QuizPage.tsx`:
  - Reads `categoryId` from `Route.useParams()`
  - Calls `useCategories()`, `useQuizSessionStore`
  - Loading guard: if `isPending` render loading text
  - If category not found after load → `navigate({ to: '/', search: { error: 'category-not-found' } })`
  - `useEffect` on mount: `startSession(categoryId)` when `currentCategoryId !== categoryId`
  - Local state: `pendingAnswer: number | null`
  - Renders: category title, "Question X of N", `QuestionCard`
  - On option click: set `pendingAnswer` + call `answerQuestion(index)`
  - When `isAnswered`: shows explanation text + "Next Question" or "See Results" button
  - "Next Question" → `nextQuestion()` + reset `pendingAnswer` to null
  - "See Results" → navigate to `/results/$categoryId`
- [x] T042 Create `src/features/quiz/components/ResultsPage.tsx`:
  - Reads `categoryId` from `Route.useParams()`
  - Reads `useQuizSessionStore`: if `!isSessionActive` → `navigate({ to: '/' })` immediately
  - Calls `useCategories()` for question data
  - Calculates `score` from `answers` vs `category.questions[i].correctAnswer`
  - `useEffect(fn, [])`: calls `addAttempt(...)` once on mount with ISO timestamp
  - Renders: "X of N correct (Y%)", `getPerformanceFeedback` message, `AnswerReview`, "Back to Home" + "Retake Quiz" buttons
  - "Retake Quiz" → `resetSession()` then navigate to `/quiz/$categoryId`
- [x] T043 Verify: `npm run typecheck` — zero errors across page components

## Routes and navigation

- [x] T050 Edit `src/routes/__root.tsx` — update nav: title "AI Development Quiz", remove Todos link
- [x] T051 Replace `src/routes/index.tsx` — wire to `HomePage` with `validateSearch: homeSearchSchema`
  - `homeSearchSchema = z.object({ error: z.enum(['category-not-found']).optional().catch(undefined) })`
- [x] T052 Create `src/routes/quiz.$categoryId.tsx` — `createFileRoute('/quiz/$categoryId')({ component: QuizPage })`
- [x] T053 Create `src/routes/results.$categoryId.tsx` — `createFileRoute('/results/$categoryId')({ component: ResultsPage })`
- [x] T054 Update `src/features/quiz/index.ts` — export `HomePage`, `QuizPage`, `ResultsPage`
- [x] T055 Verify: `npm run dev` — open `/`, `/quiz/agent-fundamentals`, `/results/agent-fundamentals` and confirm no console errors

## Integration tests

- [x] T060 Create `src/features/quiz/components/HomePage.test.tsx`:
  - Skeleton rendered while loading (override MSW to delay)
  - Category cards rendered on success (titles visible)
  - "Last score: X%" shown when history store has an attempt for a category
  - Error state + "Try again" button shown on API 500
  - Inline alert shown when `?error=category-not-found` is in URL
- [x] T061 Create `src/features/quiz/components/QuizPage.test.tsx`:
  - Renders question text, progress indicator, and 4 labelled option buttons
  - Clicking correct option: button gets `success` styling, explanation shown, buttons disabled
  - Clicking wrong option: chosen button gets destructive styling, correct button gets success styling
  - "Next Question" advances to the next question
  - Invalid `categoryId` triggers navigation to `/?error=category-not-found`
- [x] T062 Create `src/features/quiz/components/ResultsPage.test.tsx`:
  - Redirects to `/` when session store has `isSessionActive: false`
  - Score "X of N correct" and feedback message rendered correctly
  - `addAttempt` called exactly once on mount
  - "Review Answers" section starts collapsed; expands on button click
  - "Retake Quiz" calls `resetSession` and navigates to quiz
- [x] T063 Verify: `npm test -- HomePage QuizPage ResultsPage` passes

## E2E

- [x] T070 Create `e2e/quiz-flow.spec.ts`:
  - Full flow: load home page → all 3 category cards visible → click "Start Quiz" on one → answer all questions → "See Results" → score and feedback visible → "Retake Quiz" → back at question 1
  - Direct `/results/agent-fundamentals` URL without a session → redirected to `/`
- [ ] T071 Verify: `npm run e2e` passes

## Polish

- [x] T080 `npm run lint:fix` — fix any Biome issues
- [x] T081 `npm run typecheck` — zero errors
- [x] T082 `npm test` — all tests green
- [x] T083 Update `specs/002-quiz-experience/spec.md` → `Status: done`
- [x] T084 Update `specs/INDEX.md` — move entry from "Approved" to "Done"
