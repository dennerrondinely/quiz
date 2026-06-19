# Feature: Complete Quiz Experience

**Status:** done
**Created:** 2026-06-19

## Why

The quiz data layer exists but there is no interface for learners to interact with it.
Without a home page, quiz session, and results screen, the app has no usable product.
Learners cannot browse available topics, answer questions, see their score, or track
improvement over time. This feature delivers the end-to-end learner journey from
choosing a category to reviewing their answers.

## What (scope)

A three-screen experience that takes a learner from the home page, through a guided
quiz session one question at a time, to a results page showing their score and a
breakdown of every answer.

### In scope

- A **home page** listing all available quiz categories with a short description, the
  number of questions in each category, and a call to action to start the quiz.
  If the learner has previously completed a category, their last score is shown on
  the card.
- A **loading state** on the home page while categories are being fetched, and an
  **error state** with a retry action if the fetch fails.
- A **quiz session** screen that presents one question at a time with four labelled
  answer options. After the learner selects an option, all options are locked, the
  chosen option is visually marked correct or incorrect, the correct option is always
  highlighted, and an explanation is shown. The learner then advances to the next
  question.
- A **results page** showing the final score (number correct, percentage), a
  performance feedback message tailored to the score tier, a list of all questions
  with the learner's chosen answer and the correct answer, and options to go back to
  the home page or retake the same quiz.
- Persisting the completed attempt (score, answers, timestamp) to the history store
  so the home page can show the last score on the next visit.
- Redirecting a learner to the home page with a clear notice if they navigate
  directly to a quiz or results URL for a category that does not exist, or if they
  try to access the results page without first completing a quiz.

### Out of scope

- Editing or deleting past attempts.
- Leaderboards or sharing results.
- Timed questions or a countdown clock.
- Randomising question order or option order.
- Accessibility beyond standard keyboard navigation and screen-reader roles.
- Any authentication or user accounts.

## User stories

- As a learner, I want to see all available quiz categories on a home page, so that I
  can decide which topic to study.
- As a learner, I want to see my last score on a category card, so that I know where
  to focus next.
- As a learner, I want to answer one question at a time and immediately see whether I
  was right, along with an explanation, so that I learn from each answer.
- As a learner, I want to see my total score at the end of a quiz, so that I know how
  well I performed overall.
- As a learner, I want to review all my answers after finishing, so that I can
  understand what I got wrong and why.
- As a learner, I want to retake a quiz from the results page, so that I can improve
  my score without navigating back manually.
- As a learner, I want the app to handle invalid URLs gracefully, so that I am never
  stranded on a broken page.

## Acceptance criteria

- **Scenario 1 — Home page loads**: GIVEN the app is opened WHEN categories finish
  loading THEN all available categories are displayed, each with a title, description,
  question count, and a "Start Quiz" button.

- **Scenario 2 — Last score shown**: GIVEN a learner has previously completed a
  category WHEN the home page loads THEN the last score percentage is visible on that
  category's card.

- **Scenario 3 — Loading state**: GIVEN the app is fetching categories WHEN the
  network is slow THEN placeholder cards are shown instead of an empty page.

- **Scenario 4 — Fetch error**: GIVEN the API is unreachable WHEN the home page loads
  THEN an error message is shown with a "Try again" button that re-triggers the fetch.

- **Scenario 5 — Question display**: GIVEN a learner starts a quiz WHEN the first
  question loads THEN the category title, progress ("Question 1 of N"), question text,
  and four labelled options are visible.

- **Scenario 6 — Correct answer feedback**: GIVEN a learner selects the correct option
  WHEN the selection is confirmed THEN that option is highlighted in green, all other
  options are disabled, and the explanation is shown.

- **Scenario 7 — Wrong answer feedback**: GIVEN a learner selects an incorrect option
  WHEN the selection is confirmed THEN the chosen option is highlighted in red, the
  correct option is highlighted in green, all options are disabled, and the explanation
  is shown.

- **Scenario 8 — Advancing questions**: GIVEN feedback is shown WHEN the learner
  clicks "Next Question" THEN the next question is displayed and the options are
  re-enabled.

- **Scenario 9 — Last question**: GIVEN the learner is on the final question and has
  answered it WHEN they click "See Results" THEN they are taken to the results page.

- **Scenario 10 — Results score display**: GIVEN a learner completes a quiz WHEN the
  results page loads THEN the screen shows "X of N correct" and the percentage score.

- **Scenario 11 — Performance feedback**: GIVEN a score of 80 % or above WHEN the
  results page loads THEN the message "Excellent! You're mastering AI development
  concepts!" is shown. GIVEN a score of 60–79 % THEN "Good job! You're getting there!"
  is shown. GIVEN a score below 60 % THEN "Keep practicing! Review the fundamentals."
  is shown.

- **Scenario 12 — Answer review**: GIVEN the results page is open WHEN the learner
  scrolls to the review section THEN every question is listed with the learner's chosen
  answer (marked correct or incorrect) and the correct answer with its explanation.

- **Scenario 13 — Attempt saved**: GIVEN a learner reaches the results page for the
  first time after completing a quiz WHEN the page renders THEN the attempt is saved
  to the history store exactly once, so the home page will reflect the new score.

- **Scenario 14 — Retake quiz**: GIVEN the learner is on the results page WHEN they
  click "Retake Quiz" THEN the quiz session starts fresh from question 1, and the
  previous attempt remains in the history.

- **Scenario 14b — Review answers collapsed**: GIVEN the results page is open WHEN it
  first renders THEN the "Review Answers" section is collapsed. WHEN the learner
  activates the expand control THEN all question breakdowns become visible.

- **Scenario 15 — Invalid category redirect**: GIVEN a learner navigates to a quiz or
  results URL with an unknown category ID WHEN the page loads THEN they are redirected
  to the home page and a clear notice informs them the category was not found.

- **Scenario 16 — Direct results URL redirect**: GIVEN a learner opens the results URL
  without first completing a quiz WHEN the page loads THEN they are redirected to the
  home page without an error.

## Constraints and assumptions

- This feature depends on the quiz data layer (spec 001) being in place; the home page
  uses the same category-fetching hook.
- Quiz session state is intentionally not persisted — closing the browser mid-quiz
  discards progress, and users must start over. This is by design.
- The attempt is saved to local storage once per completed session; refreshing the
  results page must not create a duplicate entry.
- The feedback messages and score thresholds (80 %, 60 %) are fixed at build time;
  they are not configurable by the learner.
- All three screens must be usable on mobile (single-column) and desktop (wider
  layout).
- No animations or transitions are required beyond what the design system provides
  by default.

## Points to clarify

_(none — all resolved)_

## Resolved decisions

- **Review Answers visibility**: The section is collapsed by default and the learner
  expands it on demand — avoids overwhelming the results page with a long list.
- **Retake and history**: Each completed attempt is saved independently; retaking a
  quiz adds a new entry rather than overwriting the previous one. The home page always
  shows the most recent score.
- **Correct/incorrect icons**: Any suitable visual treatment is acceptable — no specific
  icon library is required.
