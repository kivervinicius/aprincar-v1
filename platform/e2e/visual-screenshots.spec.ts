import { test, expect } from '@playwright/test';
import { completeOnboarding, openGame } from './helpers';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), '_validation/screenshots');

test.describe('Visual Screenshots Capture', () => {
  test.beforeEach(async ({ page }) => {
    await completeOnboarding(page, 'Sofia');
  });

  test('1. Onboarding Screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/onboarding');
    await expect(page.getByRole('heading', { name: 'Quem vai brincar?' })).toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'onboarding.png') });
  });

  test('2. Mobile Core Pages Screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Home
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Mundos de Descoberta' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'mobile-home.png') });

    // Discover
    await page.goto('/discover');
    await expect(page.getByRole('heading', { name: 'Explore brincadeiras e atividades' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'mobile-discover.png') });

    // Library
    await page.goto('/library');
    await expect(page.getByRole('heading', { name: 'Biblioteca', exact: true })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'mobile-library.png') });

    // World Detail
    await page.goto('/world/math');
    await expect(page.getByRole('heading', { name: 'Matemática' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'mobile-world.png') });
  });

  test('3. Tablet Screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });

    // Tablet Home
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Mundos de Descoberta' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'tablet-home.png') });

    // Tablet World
    await page.goto('/world/colors-shapes');
    await expect(page.getByRole('heading', { name: 'Cores e Formas' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'tablet-world.png') });

    // Tablet Game
    await openGame(page, 'aprincar.counting-animals', 'Conte os Bichos');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, 'tablet-game.png') });
  });

  test('4. Parent Mode & Offline Manager Screenshots', async ({ page }) => {
    // Mobile Parent
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/parent');
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'parent-mobile.png') });

    // Tablet Parent
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto('/parent');
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'parent-tablet.png') });

    // Desktop Parent
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/parent');
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'parent-desktop.png') });

    // Offline Manager
    await page.goto('/parent/offline');
    await expect(page.getByRole('heading', { name: 'Gerenciador Offline' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'offline-manager.png') });
  });
});
