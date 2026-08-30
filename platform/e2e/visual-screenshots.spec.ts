import { test, expect } from '@playwright/test';
import { completeOnboarding, openGame } from './helpers';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), '_validation/screenshots');

test.describe('Visual Screenshots Capture', () => {
  test('capture all required validation screenshots', async ({ page }) => {
    // 1. Onboarding (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/onboarding');
    await expect(page.getByRole('heading', { name: 'Quem vai brincar?' })).toBeVisible();
    await page.screenshot({ path: path.join(outDir, 'onboarding.png') });

    // Complete onboarding to get into child space
    await completeOnboarding(page, 'Sofia');

    // 2. Mobile Home (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByText('Oi, Sofia!')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'mobile-home.png') });

    // 3. Mobile Discover (390x844)
    await page.goto('/discover');
    await expect(page.getByRole('heading', { name: 'Explore brincadeiras e atividades' })).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'mobile-discover.png') });

    // 4. Mobile Library (390x844)
    await page.goto('/library');
    await expect(page.getByRole('heading', { name: 'Biblioteca', exact: true })).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'mobile-library.png') });

    // 5. Mobile World (390x844)
    await page.goto('/world/math');
    await expect(page.getByRole('heading', { name: 'Matemática' })).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'mobile-world.png') });

    // 6. Tablet Home (820x1180)
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto('/');
    await expect(page.getByText('Oi, Sofia!')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'tablet-home.png') });

    // 7. Tablet World (820x1180)
    await page.goto('/world/colors-shapes');
    await expect(page.getByRole('heading', { name: 'Cores e Formas' })).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'tablet-world.png') });

    // 8. Tablet Game (820x1180)
    await openGame(page, 'aprincar.counting-animals', 'Conte os Bichos');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, 'tablet-game.png') });

    // 9. Parent Mobile (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/parent');
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'parent-mobile.png') });

    // 10. Parent Tablet (820x1180)
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto('/parent');
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'parent-tablet.png') });

    // 11. Parent Desktop (1280x800)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/parent');
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'parent-desktop.png') });

    // 12. Offline Manager (1280x800)
    await page.goto('/parent/offline');
    await expect(page.getByRole('heading', { name: 'Gerenciador Offline' })).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'offline-manager.png') });
  });
});
