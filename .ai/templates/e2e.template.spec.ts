// Template: Playwright E2E test.
// Save in: e2e/{{name}}.spec.ts
// Remember: e2e is expensive. Reserve for critical product flows.

import { test, expect } from '@playwright/test';

test.describe('{{Name}}', () => {
  test('main flow', async ({ page }) => {
    // Given
    await page.goto('/{{path}}');
    await expect(page.getByRole('heading', { name: /{{title}}/i })).toBeVisible();

    // When
    // TODO: simulate user interaction
    // await page.getByLabel(/email/i).fill('user@example.com');
    // await page.getByRole('button', { name: /sign in/i }).click();

    // Then
    // TODO: verify expected result
    // await expect(page).toHaveURL(/\/dashboard/);
  });
});
