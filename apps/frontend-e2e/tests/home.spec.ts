import { test, expect } from '@playwright/test';

test('home page tests', async ({ page }) => {
  await page.goto('/');

  // Check if the heading is visible
  const heading = page.getByRole('heading', { name: 'Go React Template' });
  await expect(heading).toBeVisible();

  // Check page title
  await expect(page).toHaveTitle(/Go React Template/);

  // Check API health endpoint
  const response = await page.request.get('http://localhost:8080/api/health');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.status).toBe('healthy');
  expect(body.timestamp).toBeDefined();
}); 