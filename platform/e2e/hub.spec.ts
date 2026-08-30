import { test, expect } from '@playwright/test';

test('public Hub links to sibling App and never localhost', async ({ page }) => {
  await page.goto('http://localhost:4174/');
  const link = page.locator('.hub-actions a').first();
  await expect(link).toBeVisible();
  const href = await link.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href).not.toContain('localhost:4173');
  expect(href).toMatch(/\/app\/play\//);
});
