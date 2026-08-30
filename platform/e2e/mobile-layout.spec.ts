import { test, expect } from '@playwright/test';
import { completeOnboarding, openGame } from './helpers';

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
]) {
  test(`child shell fits ${viewport.width}px without accidental horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await completeOnboarding(page, `Mobile${viewport.width}`);
    await expect(page.locator('.mobile-topbar')).toBeVisible();
    await expect(page.locator('.mobile-bottom-nav')).toBeVisible();
    await expect(page.locator('.desktop-topbar')).toBeHidden();
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.width + 1);
    for (const link of await page.locator('.mobile-nav-link').all()) {
      const box = await link.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
}

for (const viewport of [
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
]) {
  test(`tablet shell fits ${viewport.width}px without accidental horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await completeOnboarding(page, `Tablet${viewport.width}`);
    await expect(page.locator('.desktop-topbar')).toBeVisible();
    await expect(page.locator('.mobile-bottom-nav')).toBeHidden();
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(metrics.scroll).toBeLessThanOrEqual(metrics.width + 1);
  });
}

test('game route becomes fullscreen and hides child navigation on phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await completeOnboarding(page, 'Nina');
  await openGame(page, 'aprincar.counting-animals', 'Conte os Bichos');
  await expect(page.locator('.game-runtime')).toBeVisible();
  await expect(page.locator('.mobile-bottom-nav')).toHaveCount(0);
  await expect(page.locator('.desktop-topbar')).toHaveCount(0);
  const box = await page.locator('.game-runtime').boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(800);
});

test('phone landscape keeps navigation reachable at 667x375', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await completeOnboarding(page, 'Landscape667');
  await expect(page.locator('.mobile-topbar')).toBeVisible();
  await expect(page.locator('.mobile-bottom-nav')).toBeVisible();
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.width + 1);
});

test('wide phone landscape remains overflow-safe at 844x390', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await completeOnboarding(page, 'Landscape844');
  await expect(page.locator('.desktop-topbar')).toBeVisible();
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(metrics.scroll).toBeLessThanOrEqual(metrics.width + 1);
});
