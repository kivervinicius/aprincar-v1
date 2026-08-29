import { test, expect } from '@playwright/test';

test.describe('Parent Mode, Screen Time and PIN Protection', () => {
  test('configures parent PIN and daily screen time limit', async ({ page }) => {
    // 1. Create profile
    await page.goto('/');
    await page.getByLabel('Nome ou apelido').fill('Bernardo');
    await page.getByRole('button', { name: /Criar (perfil|meu espaço)/ }).click();

    // 2. Go to Settings and set parent PIN
    await page.getByRole('link', { name: 'Configurações' }).click();
    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible();

    await page.getByPlaceholder('Definir PIN (ex: 1234)').fill('4321');
    await page.getByRole('button', { name: 'Salvar PIN' }).click();
    await expect(page.getByRole('button', { name: 'Salvo!' })).toBeVisible();

    // 3. Go to Parent mode -> should require PIN
    await page.getByRole('link', { name: 'Responsável' }).click();
    await expect(page.getByText('Acesso do responsável')).toBeVisible();
    await expect(page.getByLabel('PIN do responsável')).toBeVisible();

    // Wrong PIN
    await page.getByLabel('PIN do responsável').fill('9999');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('PIN incorreto. Tente novamente.')).toBeVisible();

    // Correct PIN
    await page.getByLabel('PIN do responsável').fill('4321');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Olá, responsável!')).toBeVisible();

    // 4. Configure screen time limit
    await expect(page.getByText('Tempo de tela')).toBeVisible();
    await page.getByLabel('Limite diário (minutos)').fill('30');
  });
});
