import { test, expect } from '@playwright/test';

test.describe('Onboarding and Profile Creation', () => {
  test('creates a local child profile and enters home view', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Vamos começar a aprincar?')).toBeVisible();
    await expect(page.getByText('Poucas perguntas, sem cadastro')).toBeVisible();

    const createBtn = page.getByRole('button', { name: /Criar (perfil|meu espaço)/ });
    await expect(createBtn).toBeDisabled();

    await page.getByLabel('Nome ou apelido').fill('Sofia');
    await expect(createBtn).toBeEnabled();

    await createBtn.click();
    await expect(page.getByText(/Olá, Sofia!/)).toBeVisible();
    await expect(page.getByText('Destaques para você')).toBeVisible();
  });
});
