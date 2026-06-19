import { expect, test } from '@playwright/test';

test('home page renders the AI Development Quiz heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /AI Development Quiz/i })).toBeVisible();
});
