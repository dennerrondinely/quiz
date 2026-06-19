# QuizApp — Step-by-Step SDD Build Guide

**Project:** AI Development Quiz App  
**Base:** `ai-frontend-starter` (React 19 + Vite + TanStack Router/Query + Zustand + Tailwind v4 + shadcn/ui)  
**Method:** Spec-Driven Development (SDD)  
**Time budget:** 60 minutes  

---

## API Reference

```
GET https://6a3462338248ee962fa55f42.mockapi.io/quiz
```

**Response shape:**

```typescript
[{
  id: "agent-fundamentals",           // string
  title: "Agent Fundamentals",
  description: "...",
  questions: [{
    id: 1,                            // number
    question: "...",
    options: ["A", "B", "C", "D"],   // always 4 items
    correctAnswer: 1,                 // index 0–3  ← NOT correctIndex
    explanation: "..."
  }]
}]
```

> **Note:** The API currently returns only 1 category (`agent-fundamentals`).  
> The challenge requires 3 categories. The `api.ts` must merge the API response with  
> 2 locally-defined categories (`prompt-engineering`, `model-selection`).

---

## SDD Workflow (per spec)

```
/specify "description"   →   specs/NNN-slug/spec.md      (WHAT + WHY)
/plan    NNN-slug         →   specs/NNN-slug/plan.md      (HOW)
/tasks   NNN-slug         →   specs/NNN-slug/tasks.md     (checklist)
/implement NNN-slug       →   executes ONE task at a time (repeat until done)
```

---

## Phase 0 — Project Setup (before recording or first 5 min)

```bash
cp -r ai-frontend-starter quiz-app
cd quiz-app
npm install
npm run dev        # confirm it loads at localhost:5173
```

**First message to Claude Code:**

> "We're going to build an AI Development Quiz App using this project's SDD workflow.
> Do not write any code yet — confirm you've read CLAUDE.md and are ready."

---

## Phase 1 — Spec 002: Quiz Data Layer (≈10 min)

### Step 1 — `/specify` input

```
/specify Quiz data layer — schemas, API client, and supplemental local data.

DATA SOURCE:
The real API is: GET https://6a3462338248ee962fa55f42.mockapi.io/quiz
It returns an array of quiz categories. Each category has: id (string), title (string),
description (string), and questions (embedded array).
Each question has: id (number), question (string), options (array of exactly 4 strings),
correctAnswer (number — index 0–3 of the correct option), explanation (string).

PROBLEM: the API currently has only 1 category ("Agent Fundamentals").
The app requires 3 categories: "Agent Fundamentals", "Prompt Engineering", and "Model Selection".

SOLUTION: api.ts fetches from the real API and merges with a local supplemental array.
The 2 local categories ("Prompt Engineering" and "Model Selection") follow the exact same
structure and have 5 real, relevant questions each about their respective AI development topics.
If the API already returns a category with the same id, the API version takes precedence.

ZOD SCHEMAS:
- Question: id (number), question (string), options (array of string — min/max 4),
  correctAnswer (number 0–3), explanation (string)
- QuizCategory: id (string), title (string), description (string), questions (array of Question)
- UserAttempt: id (string — uuid generated on save), categoryId (string),
  completedAt (ISO string), score (number), total (number),
  answers (array of number — chosen index per question)

HISTORY STORE:
Zustand store with persist middleware (localStorage key "quiz-history") storing
an array of UserAttempt. Actions: addAttempt(attempt), clearHistory(),
getAttemptsByCategory(categoryId).

RULES:
- api.ts uses native fetch (no Orval — there is no OpenAPI spec for this external API)
- useCategories() TanStack Query hook with staleTime of 5 minutes
- No MSW needed (the API is real and accessible)
- No auth, no POST to the API, no pagination

Out of scope: authentication, writing back to the API, offline support.
```

### Step 2 — after reviewing the spec

```
/plan 002-quiz-data-layer
```

### Step 3 — after reviewing the plan

```
/tasks 002-quiz-data-layer
```

### Step 4 — implement (repeat until all tasks are `[x]`)

```
/implement 002-quiz-data-layer
```

---

## Phase 2 — Spec 003: Quiz Experience (≈28 min)

### Step 5 — `/specify` input

```
/specify Complete quiz experience — home page, quiz session, and results.

DEPENDS ON: src/features/quiz schemas and hooks from spec 002.

NEW ROUTES:
- "/"                     → HomePage
- "/quiz/$categoryId"     → QuizPage
- "/results/$categoryId"  → ResultsPage

---

HOME PAGE ("/"):
- Header: title "AI Development Quiz" + subtitle "Test your knowledge of AI development concepts"
- Responsive grid of CategoryCards (1 col mobile, 3 col desktop)
- Each card shows: title, description, "N questions", "Start Quiz" button (→ /quiz/$categoryId)
- If the history store has attempts for that category: show "Last score: X%" below the description
- Loading skeleton while useCategories() is fetching
- Error message with "Try again" button if the fetch fails

---

QUIZ SESSION ("/quiz/$categoryId"):
- On mount: initialize session state (currentQuestionIndex = 0, answers = [])
- If categoryId does not exist in the loaded categories: redirect to "/" with an error toast
- Display:
  - Category title at the top
  - Progress indicator: "Question X of N"
  - Question text
  - 4 option buttons (labeled A / B / C / D)
- After clicking an option:
  - Disable all option buttons immediately
  - Highlight the chosen option: green if correct (matches correctAnswer), red if wrong
  - Always highlight the correct option in green
  - Show the explanation text below the options
  - Show "Next Question" button (or "See Results" on the last question)
- No back navigation to previous questions
- Session state: currentCategoryId, currentQuestionIndex, answers (number[]), isAnswered (boolean)

---

RESULTS PAGE ("/results/$categoryId"):
- On mount: check if answers exist in session store. If not (direct URL access), redirect to "/"
- Calculate score: count answers[i] === questions[i].correctAnswer
- Display:
  - "X of N correct" + percentage
  - Performance feedback message:
    - ≥ 80%: "Excellent! You're mastering AI development concepts!"
    - 60–79%: "Good job! You're getting there!"
    - < 60%: "Keep practicing! Review the fundamentals."
  - "Back to Home" button → "/"
  - "Retake Quiz" button → resets session and navigates to /quiz/$categoryId
  - "Review Answers" section: lists all questions showing the user's chosen option
    (with ✓ or ✗ icon) and the correct option with its explanation
- On mount (once): call addAttempt() from the history store with the completed session data

---

SESSION STATE (Zustand, no persist — intentionally ephemeral):
Store: currentCategoryId (string | null), currentQuestionIndex (number),
answers (number[]), isSessionActive (boolean).
Actions: startSession(categoryId, totalQuestions), answerQuestion(answerIndex), resetSession().

VALIDATION / EDGE CASES:
- Invalid categoryId in /quiz or /results → redirect to "/" + toast "Category not found"
- Accessing /results with no active session → redirect to "/"
- Network error on fetch → error state on home page with "Try again" button
```

### Step 6 — after reviewing the spec

```
/plan 003-quiz-experience
```

### Step 7 — after reviewing the plan

```
/tasks 003-quiz-experience
```

### Step 8 — implement (repeat until done)

```
/implement 003-quiz-experience
```

---

## Phase 3 — Spec 004: History & Polish *(stretch — ≈12 min)*

### Step 9 — `/specify` input

```
/specify Attempt history, user profile, and visual polish.

HISTORY SECTION ON HOME:
- Below the category grid, show a "Recent Attempts" section (only if attempts exist)
- Lists the last 5 attempts: category name, formatted date, score, and percentage
- "Clear History" button with a confirmation dialog before clearing

OPTIONAL USERNAME:
- On first visit (no username in localStorage), show a simple modal prompting for a display name
  (required field, min 2 characters, max 30)
- Save to localStorage under key "quiz-username"
- Display in the header: "Welcome, [name]!"
- A small "Edit" button in the header to update the name

POLISH:
- Success toast when a quiz is saved: "Quiz complete! Score: X%"
- Fade or slide transition when advancing to the next question (Tailwind transitions)
- Custom 404 page for unmatched routes with a "Back to Home" link
- Run npm run typecheck + npm run lint:fix + npm test at the end
```

### Sequence:

```
/plan 004-quiz-history
/tasks 004-quiz-history
/implement 004-quiz-history   ← repeat per task
```

---

## Phase 4 — Final Verification (last 3–5 min)

**Input to Claude Code:**

```
Run the final verification:
1. npm run typecheck
2. npm run lint:fix
3. npm test
4. Test the full flow in the browser at localhost:5173:
   - Home loads all 3 categories
   - "Start Quiz" opens the session correctly
   - Answering a question shows correct feedback (green/red highlighting)
   - Advancing through all questions reaches the Results page
   - Score and feedback message are correct
   - "Retake Quiz" restarts from question 1
   - "Back to Home" shows "Last score: X%" on the category card
5. Test an invalid categoryId in the URL — should redirect to home

/specs-index
```

---

## Expected Final File Structure

```
src/features/quiz/
├── data/
│   └── supplemental-categories.ts   # 2 local categories (Prompt Eng + Model Selection)
├── api.ts                           # fetch /quiz + merge with local data
├── schemas.ts                       # Question, QuizCategory, UserAttempt (Zod)
├── hooks/
│   └── useCategories.ts             # useQuery wrapper, staleTime 5 min
├── store/
│   ├── quizSessionStore.ts          # in-progress session (no persist)
│   └── quizHistoryStore.ts          # attempt history (Zustand + persist)
├── components/
│   ├── HomePage.tsx
│   ├── CategoryCard.tsx
│   ├── QuizPage.tsx
│   ├── QuestionCard.tsx
│   ├── ResultsPage.tsx
│   └── AnswerReview.tsx
└── index.ts

src/routes/
├── index.tsx                        # "/" → HomePage
├── quiz.$categoryId.tsx             # "/quiz/$categoryId" → QuizPage
└── results.$categoryId.tsx          # "/results/$categoryId" → ResultsPage
```

---

## Time Budget Summary

| Phase | Spec | Content | Time |
|-------|------|---------|------|
| 0 | — | Project setup | 5 min |
| 1 | 002 | Data layer (schemas, API, history store) | 10 min |
| 2 | 003 | Full quiz UI (home + session + results) | 28 min |
| 3 | 004 | History dashboard + polish *(stretch)* | 12 min |
| 4 | — | Final verification | 5 min |
| **Total** | | | **60 min** |

---

## Key Facts to Remember During Recording

| Topic | Detail |
|-------|--------|
| Correct field name | `correctAnswer` (not `correctIndex`) — integer 0–3 |
| API response | Categories with **embedded questions** — not separate endpoints |
| Missing categories | API returns 1; merge with 2 local in `api.ts` |
| No MSW | External API works directly — no mock service worker needed |
| No Orval | No OpenAPI spec for this external API — write `api.ts` manually |
| Session store | **No persist** — intentionally resets when user navigates away |
| History store | **With persist** — survives page refresh via localStorage |
| Zip exclusions | `node_modules/`, `.git/`, `dist/` |
| Chat history | Located in `.claude/` — include in the zip |

---

## Zip the Submission

```bash
cd ..
zip -r quiz-app.zip quiz-app/ \
  --exclude "*/node_modules/*" \
  --exclude "*/.git/*" \
  --exclude "*/dist/*" \
  --exclude "*/playwright-report/*" \
  --exclude "*/test-results/*"
```
