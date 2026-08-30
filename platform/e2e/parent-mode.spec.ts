import { test, expect } from '@playwright/test';
import { completeOnboarding } from './helpers';

test.describe('Parent Mode, Screen Time and PIN Protection', () => {
  test('configures parent PIN and daily screen time limit', async ({ page }) => {
    await completeOnboarding(page, 'Bernardo');
    await page.getByLabel('Menu de perfis').click();
    await page.getByRole('menuitem', { name: 'Configurações' }).click();
    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible();
    await page.getByPlaceholder('Definir PIN (ex: 1234)').fill('4321');
    await page.getByRole('button', { name: 'Salvar PIN' }).click();
    await expect(page.getByRole('button', { name: 'Salvo!' })).toBeVisible();

    await page.getByLabel('Menu de perfis').click();
    await page.getByRole('menuitem', { name: 'Área do responsável' }).click();
    await expect(page.getByText('Acesso do responsável')).toBeVisible();
    await page.getByLabel('PIN do responsável').fill('9999');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('PIN incorreto. Tente novamente.')).toBeVisible();
    await page.getByLabel('PIN do responsável').fill('4321');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await expect(page.getByText('Tempo de tela')).toBeVisible();
    await page.getByLabel('Limite diário (minutos)').fill('30');
  });
});
