import { test, expect } from '@playwright/test';

test.describe('Profiles Management', () => {
  test('creates multiple profiles and switches between them', async ({ page }) => {
    // 1. Onboard first profile: "Sofia"
    await page.goto('/');
    await page.getByLabel('Nome ou apelido').fill('Sofia');
    await page.getByRole('button', { name: /Criar (perfil|meu espaço)/ }).click();
    await expect(page.getByText(/Olá, Sofia!/)).toBeVisible();

    // 2. Open Profile Menu in header and click "Adicionar perfil"
    await page.getByLabel('Menu de perfis').click();
    await page.getByRole('menuitem', { name: 'Adicionar perfil' }).click();

    // 3. Fill new profile modal: "Lucas"
    await expect(page.getByText('Criar novo perfil infantil')).toBeVisible();
    await page.getByLabel('Nome ou apelido').fill('Lucas');
    await page.getByRole('button', { name: /Criar (perfil|meu espaço)/ }).click();

    // 4. Verify switched to Lucas
    await expect(page.getByText(/Olá, Lucas!/)).toBeVisible();

    // 5. Switch back to Sofia
    await page.getByLabel('Menu de perfis').click();
    await page.getByRole('menuitem', { name: 'Sofia' }).click();
    await expect(page.getByText(/Olá, Sofia!/)).toBeVisible();
  });
});
