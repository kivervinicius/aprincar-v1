import { test, expect } from '@playwright/test';
import { completeOnboarding } from './helpers';

test.describe('Library and Offline Persistence', () => {
  test('adds game to library, caches offline and persists across reload', async ({ page }) => {
    await completeOnboarding(page, 'Maya');

    // 2. Add "Mundo das Cores" to library
    const colorCard = page.locator('.child-card', { hasText: 'Mundo das Cores' });
    await expect(colorCard).toBeVisible();
    await colorCard.getByRole('button', { name: 'Biblioteca' }).click();

    // 3. Prepare offline
    const offlineBtn = colorCard.getByRole('button', { name: 'Disponibilizar offline' });
    await offlineBtn.click();
    await expect(colorCard.getByText('Offline pronto')).toBeVisible();

    // 4. Check Library page
    await page.getByRole('link', { name: 'Biblioteca', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Biblioteca', exact: true })).toBeVisible();
    await expect(page.locator('.child-card', { hasText: 'Mundo das Cores' })).toBeVisible();

    // 5. Reload page and check local-first state is preserved from Dexie
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Biblioteca', exact: true })).toBeVisible();
    await expect(page.locator('.child-card', { hasText: 'Mundo das Cores' })).toBeVisible();
    await expect(
      page.locator('.child-card', { hasText: 'Mundo das Cores' }).getByText('Offline pronto'),
    ).toBeVisible();
  });
});
