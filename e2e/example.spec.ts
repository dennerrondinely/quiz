import { expect, test } from '@playwright/test';

test('home page renderiza e navega para /todos', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /AI Frontend Starter/i })).toBeVisible();
  await page.getByRole('link', { name: /ver feature de exemplo/i }).click();
  await expect(page).toHaveURL(/\/todos/);
  await expect(page.getByRole('heading', { name: /Todos/i })).toBeVisible();
});
