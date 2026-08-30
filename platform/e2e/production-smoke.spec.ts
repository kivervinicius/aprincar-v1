import { test, expect } from '@playwright/test';

test.describe('Production Live Smoke Test', () => {
  test('opens published app, passes local onboarding, and views Child Home', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('https://aprincar.github.io/platform/app/');

    await expect(page.getByRole('heading', { name: 'Quem vai brincar?' })).toBeVisible({ timeout: 15000 });
    await page.getByLabel('Nome ou apelido').fill('Alice');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.getByRole('heading', { name: 'Quantos anos?' })).toBeVisible();
    await page.getByRole('button', { name: '6', exact: true }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.getByRole('heading', { name: 'O que já gosta de explorar?' })).toBeVisible();
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.getByRole('heading', { name: 'Interesses' })).toBeVisible();
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.getByRole('heading', { name: 'Tempo para brincar' })).toBeVisible();
    await page.getByRole('button', { name: 'Criar meu espaço' }).click();

    await expect(page.getByText('Oi, Alice!')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mundos de Descoberta' })).toBeVisible();
  });
});
