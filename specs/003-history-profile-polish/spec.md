# Feature: Attempt History, User Profile, and Visual Polish

**Status:** done
**Created:** 2026-06-19

## Why

Users who complete multiple quiz sessions have no way to track their progress over time, and the
app does not acknowledge who they are. This creates a generic, impersonal experience that reduces
motivation to return and practice. Additionally, the current UI lacks the small touches (transitions,
notifications, error pages) that make an app feel complete and trustworthy.

**Impacted:** All quiz learners, especially those who return repeatedly to improve their scores.

## What (scope)

### In scope

- **Recent attempts list** on the home page: a dedicated section (visible only when the user has
  prior attempts) showing the most recent attempt per category (up to 5 categories), with the
  category name, the date it was taken, the score, and the percentage.
- **Clear history**: a button in the recent-attempts section that, after user confirmation in a
  dialog, permanently deletes all stored attempt history.
- **Required display name**: on the very first visit (no name saved yet), a non-dismissible modal
  prompts the user to enter a display name. The field is required, between 2 and 30 characters.
  The name persists across page reloads (stored locally in the browser). The modal cannot be
  closed by pressing Escape or clicking the backdrop — a valid name is required to proceed.
- **Name display in the header**: once a name is set, the navigation bar greets the user with
  "Welcome, [name]!" and provides a small "Edit" button to update the name at any time.
- **Completion toast**: immediately after a quiz result is saved, a brief Sonner toast appears
  confirming the save and showing the final score percentage. It dismisses automatically.
- **Question transition**: a subtle visual animation (fade or slide — either style) between
  questions so the transition feels intentional rather than abrupt. Must respect
  `prefers-reduced-motion`.
- **Custom 404 page**: when a user lands on an unrecognised URL, they see a friendly error page
  with a "Back to Home" link instead of a blank screen.

### Out of scope

- Account creation, login, or server-side persistence of any kind.
- Per-category history pages or detailed breakdowns beyond the home-page list.
- Leaderboards or score comparisons between users.
- Push notifications or reminders.
- Accessibility audit beyond standard keyboard navigation and ARIA attributes already used.

## User stories

- As a learner, I want to see my most recent result for each category on the home page, so that I
  can track per-category progress at a glance.
- As a learner, I want to clear my attempt history when I want a fresh start, so that old results
  do not clutter my view.
- As a learner, I want the app to ask for my name on first visit and remember it, so that the
  experience feels personalised across sessions.
- As a learner, I want to be able to update my display name at any time, so that I can correct a
  typo or change my preference.
- As a learner, I want a confirmation that my result was saved after completing a quiz, so that I
  know the attempt was recorded.
- As a learner, I want question changes to feel smooth, so that the experience does not feel
  jarring.
- As a learner, I want a helpful page when I reach a broken URL, so that I can easily find my way
  back.

## Acceptance criteria

- **Scenario 1 — Recent attempts visible**: GIVEN the user has completed at least one attempt,
  WHEN they visit the home page, THEN a "Recent Attempts" section is displayed below the category
  grid showing the most recent attempt for each category that has been attempted (up to 5), each
  entry showing the category name, a human-readable date, the raw score, and the percentage.

- **Scenario 2 — No section when history is empty**: GIVEN the user has no stored attempts, WHEN
  they visit the home page, THEN the "Recent Attempts" section is not rendered at all.

- **Scenario 3 — Clear history with confirmation**: GIVEN the recent-attempts section is visible,
  WHEN the user clicks "Clear History" and confirms in the dialog, THEN all attempt entries are
  removed, the section disappears, and the category cards no longer show last-score badges.

- **Scenario 4 — Clear history cancelled**: GIVEN the confirmation dialog is open, WHEN the user
  dismisses it without confirming, THEN the history remains unchanged.

- **Scenario 5 — First-visit name prompt**: GIVEN the user has never set a display name, WHEN
  the home page first loads, THEN a non-dismissible modal appears asking for a name. The user
  cannot close it by pressing Escape or clicking outside; they must submit a valid name to proceed.

- **Scenario 6 — Name validation**: GIVEN the name prompt modal is open, WHEN the user submits
  a name shorter than 2 characters or longer than 30, THEN an inline validation error is shown
  and the modal stays open.

- **Scenario 7 — Name persists across reloads**: GIVEN the user has saved a display name, WHEN
  they reload the page, THEN the header still shows "Welcome, [name]!" without prompting again.

- **Scenario 8 — Name edit**: GIVEN a name is already set, WHEN the user clicks the "Edit"
  button in the header, THEN a modal allows them to update the name; the header reflects the new
  name immediately after saving.

- **Scenario 9 — Completion toast**: GIVEN a quiz session just ended and the result was saved,
  WHEN the results page loads, THEN a Sonner toast notification appears showing the score
  percentage (e.g. "Quiz complete! Score: 80%"), and it dismisses automatically after a few
  seconds.

- **Scenario 10 — Question transition**: GIVEN the user answers a question and clicks "Next
  Question", WHEN the next question appears, THEN a visible (but brief) transition effect
  accompanies the change. The transition is skipped or minimised when the user has
  `prefers-reduced-motion` enabled.

- **Scenario 11 — 404 page**: GIVEN the user navigates to a URL that does not match any route,
  WHEN the page loads, THEN they see a clear "Page not found" message and a "Back to Home" link
  that returns them to `/`.

## Constraints and assumptions

- The display name is stored only in the browser's `localStorage` under the key `quiz-username`.
  Clearing browser data will lose the name.
- The name prompt modal is non-dismissible — a valid name is required to use the app. This is
  intentional and confirmed.
- The "Recent Attempts" list shows the single most recent attempt per category, sorted by most
  recent first, capped at 5 categories. Confirmed.
- Sonner (toast library, ~5 KB gzip) will be added as a dependency. Confirmed.
- The question transition style (fade or slide) is left to the implementer's discretion.
- The completion toast should not block navigation or require user interaction to dismiss.
- Attempt history is already capped at 10 per category (spec 001); this feature only changes
  the display on the home page.
