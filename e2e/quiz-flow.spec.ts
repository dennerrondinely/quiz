import { expect, test } from '@playwright/test';

test.describe('Quiz flow', () => {
  test('full flow: home → quiz → results → retake', async ({ page }) => {
    // Load home page and verify category cards
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /AI Development Quiz/i })).toBeVisible();

    // All Start Quiz links visible (at least one category loaded)
    const startButtons = page.getByRole('link', { name: /start quiz/i });
    await expect(startButtons.first()).toBeVisible();

    // Click the first Start Quiz
    await startButtons.first().click();
    await expect(page).toHaveURL(/\/quiz\//);

    // Answer all questions
    const progressPattern = /question \d+ of (\d+)/i;
    let total = 0;

    // Get total from progress indicator
    const progressText = await page.getByText(progressPattern).textContent();
    const match = progressText?.match(progressPattern);
    if (match) total = Number.parseInt(match[1], 10);
    expect(total).toBeGreaterThan(0);

    for (let i = 0; i < total; i++) {
      // Wait for question to appear
      await expect(page.getByRole('button').first()).toBeVisible();

      // Click the first option button
      await page.getByRole('button').first().click();

      // Wait for disabled state (answer recorded)
      await expect(page.getByRole('button').first()).toBeDisabled();

      if (i < total - 1) {
        // Click Next Question
        await page.getByRole('button', { name: /next question/i }).click();
      } else {
        // Click See Results on last question
        await page.getByRole('button', { name: /see results/i }).click();
      }
    }

    // Results page
    await expect(page).toHaveURL(/\/results\//);
    await expect(page.getByText(/correct/i)).toBeVisible();
    await expect(page.getByText(/excellent|good job|keep practicing/i)).toBeVisible();

    // Retake Quiz navigates back to quiz at question 1
    await page.getByRole('button', { name: /retake quiz/i }).click();
    await expect(page).toHaveURL(/\/quiz\//);
    await expect(page.getByText(/question 1 of/i)).toBeVisible();
  });

  test('direct access to /results without a session redirects to home', async ({ page }) => {
    await page.goto('/results/agent-fundamentals');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /AI Development Quiz/i })).toBeVisible();
  });
});
