# Feature: Remove Todos Feature

**Status:** done
**Created:** 2026-06-19

## Why

The repository was cloned from a generic template that includes a sample Todos feature. This feature has no relation to the AI Development Quiz product and serves only as a reference example in the template. Leaving it in the codebase creates confusion for contributors (extra routes, components, API handlers, and test files that are not part of the product), inflates the bundle size, and makes it harder to understand the real scope of the application.

**Impacted:** All developers working on the codebase, and end users who could theoretically reach the todos routes.

## What (scope)

Remove every part of the Todos example feature from the application, leaving the codebase with only quiz-related functionality.

### In scope

- All UI pages, components, and views that belong to the Todos feature.
- All data-fetching logic, API integrations, and client-side state management tied exclusively to Todos.
- All routes that lead to Todos pages.
- All automated tests (unit, integration, E2E) that cover only the Todos feature.
- MSW handlers and fixtures that exist solely for Todos mocking.
- Any navigation links pointing to Todos pages.
- The Todos feature folder and all files within it.

### Out of scope

- Any shared utilities, design system components, or infrastructure that Todos happens to use but that are also used by the quiz feature (e.g. the Button component, the HTTP client). These must be kept.
- Changes to product functionality — this is a removal, not a redesign.
- Removing the `000-example` spec reference folder (it is documentation, not product code).

## User stories

- As a developer, I want the codebase to contain only quiz-related code, so that I can understand the product without being distracted by template scaffolding.
- As a developer, I want no dead routes or unused test infrastructure, so that the test suite reflects only real product behaviour.

## Acceptance criteria

- **Scenario 1 — No Todos route**: GIVEN the application is running, WHEN a user navigates to any URL that previously served the Todos feature, THEN they see the 404 page (not a Todos UI).

- **Scenario 2 — No Todos link in navigation**: GIVEN the application is running, WHEN a user views the navigation bar, THEN there is no link or reference to a Todos section.

- **Scenario 3 — Clean test suite**: GIVEN the test suite is run, WHEN all tests complete, THEN no test file related exclusively to Todos is executed, and all remaining tests pass.

- **Scenario 4 — Shared components intact**: GIVEN the application is running, WHEN a user completes a quiz, THEN all quiz functionality (home, quiz session, results, history) works correctly — no regressions from removing the Todos code.

- **Scenario 5 — No build errors**: GIVEN the code is built for production, WHEN the build runs, THEN it completes without errors related to missing Todos modules.

## Constraints and assumptions

- Shared code (design system atoms, HTTP utilities, test helpers) used by both Todos and the quiz must be preserved even if Todos references are removed.
- The `000-example` spec folder under `specs/` is documentation and should not be deleted as part of this work.
- No new functionality is added — this is a pure deletion.

## Points to clarify

- [NEEDS CLARIFICATION: Should the MSW server and shared test-setup infrastructure be preserved as-is, or trimmed of any Todos-specific handlers that are not reused by quiz tests?]
