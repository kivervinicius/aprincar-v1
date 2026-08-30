import { test, expect } from '@playwright/test';
import { completeOnboarding } from './helpers';

test.describe('Profiles Management', () => {
  test('creates multiple profiles and switches between them', async ({ page }) => {
    await completeOnboarding(page, 'Sofia');
    await page.getByLabel('Menu de perfis').click();
    await page.getByRole('menuitem', { name: 'Adicionar perfil' }).click();
    await expect(page.getByText('Criar novo perfil infantil')).toBeVisible();
    await page.getByLabel('Nome ou apelido').fill('Lucas');
    await page.getByRole('button', { name: 'Criar perfil' }).click();
    await expect(page.getByText(/Oi, Lucas!/)).toBeVisible();
    await page.getByLabel('Menu de perfis').click();
    await page.getByRole('menuitem', { name: 'Sofia' }).click();
    await expect(page.getByText(/Oi, Sofia!/)).toBeVisible();
  });
});
