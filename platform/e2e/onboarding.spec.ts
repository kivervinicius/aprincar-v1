import { test, expect } from '@playwright/test';

test.describe('Onboarding and Profile Creation', () => {
  test('completes the five-step local onboarding and enters child home', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Quem vai brincar?' })).toBeVisible();
    const continueButton = page.getByRole('button', { name: 'Continuar' });
    await expect(continueButton).toBeDisabled();

    await page.getByLabel('Nome ou apelido').fill('Sofia');
    await page.getByRole('button', { name: 'Avatar 🦊' }).click();
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(page.getByRole('heading', { name: 'Quantos anos?' })).toBeVisible();
    await page.getByRole('button', { name: '6', exact: true }).click();
    await continueButton.click();

    await expect(page.getByRole('heading', { name: 'O que já gosta de explorar?' })).toBeVisible();
    await page.getByRole('button', { name: /Letras/ }).click();
    await continueButton.click();

    await expect(page.getByRole('heading', { name: 'Interesses' })).toBeVisible();
    await page.getByRole('button', { name: /Bichos/ }).click();
    await continueButton.click();

    await expect(page.getByRole('heading', { name: 'Tempo para brincar' })).toBeVisible();
    await page.getByRole('button', { name: /30 min/ }).click();
    await page.getByRole('button', { name: 'Criar meu espaço' }).click();

    await expect(page.getByText(/Oi, Sofia!/)).toBeVisible();
    await expect(page.getByText('Destaques para você')).toBeVisible();
  });
});
