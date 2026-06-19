# Feature: Quiz Data Layer

**Status:** done
**Created:** 2026-06-19

## Why

The quiz app depends on three topic categories — "Agent Fundamentals", "Prompt Engineering",
and "Model Selection" — but the external API currently returns only one ("Agent Fundamentals").
Without the missing categories, learners cannot explore the full curriculum. In addition, there
is no consistent data contract or local history storage, so each part of the app must reinvent
how quiz data is fetched and validated, and completed attempts are lost on page refresh.

## What (scope)

Establish the single source of truth for all quiz data:

1. A set of validated data shapes that every part of the app agrees on.
2. A data-fetching layer that combines the live API with locally authored categories so
   the app always shows all three topics, regardless of what the API returns.
3. A history store that persists completed quiz attempts across browser sessions.

### In scope

- Data shapes (schemas) for a quiz category, a question, and a user attempt.
- Fetching quiz categories from the external API and merging them with two locally authored
  categories ("Prompt Engineering" and "Model Selection"), each containing 5 real questions
  about their respective AI development topics.
- The merge rule: if the API returns a category that matches a local category by ID, the
  API version wins; otherwise the local version is included.
- A query hook that the UI can call to get the merged list of categories (cached for 5
  minutes before re-fetching).
- A history store that saves, retrieves, and clears completed quiz attempts in the browser's
  local storage under a fixed key.
- The history store exposes: add an attempt, clear all attempts, and get attempts filtered
  by category.

### Out of scope

- Authentication or user accounts.
- Writing quiz data back to the API.
- Offline support or background sync.
- Pagination or search.
- Any UI components — this spec covers data only.

## User stories

- As a learner, I want all three quiz categories to be available when I open the app, so
  that I can choose among "Agent Fundamentals", "Prompt Engineering", and "Model Selection".
- As a learner, I want my completed quiz attempts to persist after I close and reopen the
  browser, so that I can track my progress over time.
- As a learner, I want to clear my history if I want to start fresh, so that old scores do
  not skew my view of my current performance.

## Acceptance criteria

- **Scenario 1 — All categories present**: GIVEN the app loads WHEN the category list is
  fetched THEN the result contains at least the three expected categories ("Agent
  Fundamentals", "Prompt Engineering", "Model Selection"), each with exactly 5 questions.

- **Scenario 2 — API takes precedence**: GIVEN the API returns a category whose ID matches
  a locally authored category WHEN the merge happens THEN the API version appears in the
  final list and the local version is discarded.

- **Scenario 3 — Local categories fill the gap**: GIVEN the API returns only "Agent
  Fundamentals" WHEN the merge happens THEN "Prompt Engineering" and "Model Selection" are
  still present, sourced from local data.

- **Scenario 4 — Data is valid**: GIVEN any category is loaded WHEN its questions are
  inspected THEN each question has exactly 4 answer options and a correct-answer index
  between 0 and 3.

- **Scenario 5 — Stale-while-revalidate**: GIVEN the category list was fetched less than 5
  minutes ago WHEN the user navigates or the component re-mounts THEN no new network request
  is made.

- **Scenario 6 — Attempt saved**: GIVEN a learner completes a quiz WHEN the result is
  submitted THEN the attempt (score, total, answers, timestamp) is saved and retrievable
  from the history store.

- **Scenario 7 — History persists across sessions**: GIVEN attempts exist in the history
  store WHEN the browser tab is closed and reopened THEN the same attempts are still present.

- **Scenario 8 — Clear history**: GIVEN at least one attempt exists WHEN the learner clears
  history THEN the store contains zero attempts.

- **Scenario 9 — Filter by category**: GIVEN attempts from multiple categories WHEN
  getAttemptsByCategory is called with a specific category ID THEN only attempts for that
  category are returned.

- **Scenario 10 — History cap enforced**: GIVEN 10 attempts already exist for a category
  WHEN an 11th attempt is saved THEN the oldest attempt for that category is removed and
  the total remains 10.

- **Scenario 11 — API error surfaced**: GIVEN the external API is unreachable WHEN the
  category list is fetched THEN the app displays an error state and does not show partial
  data from local categories only.

## Constraints and assumptions

- The external API (`https://6a3462338248ee962fa55f42.mockapi.io/quiz`) is publicly
  accessible without authentication and returns data in the documented format.
- The merge strategy is ID-based: the ID field of a category is the stable identifier.
- Local questions are authored at development time and treated as static data — they are
  not fetched from any backend.
- Each question must have exactly 4 options (no more, no less).
- User attempt IDs are generated client-side (UUID) at the moment of saving.
- The history store uses the browser's localStorage; users who clear site data will lose
  their history (by design — no backup mechanism is required).
- No authentication layer exists, so history is per-device and per-browser profile.
- A maximum of 10 attempts per category is retained; when a new attempt pushes the count
  above 10, the oldest attempt for that category is evicted.
- If the external API call fails for any reason, the app shows an error state and does not
  silently substitute local data.

## Points to clarify

_(none — all resolved)_

## Resolved decisions

- **Question authorship**: Developer authorship is sufficient for the initial release; no
  subject-matter expert review required.
- **History retention cap**: A maximum of 10 attempts per category is stored. When the 11th
  attempt is added, the oldest attempt for that category is dropped.
- **API error handling**: If the external API is unreachable, the app surfaces an error to
  the user rather than silently falling back to local-only data.
