import { test, expect } from '@playwright/test';

test.describe('Child Mode Community Games Filtering', () => {
  test('hides community games by default and shows when authorized', async ({ page }) => {
    // 1. Create profile
    await page.goto('/');
    await page.getByLabel('Nome ou apelido').fill('Clara');
    await page.getByRole('button', { name: /Criar (perfil|meu espaço)/ }).click();

    // 2. Discover page: all default games are official / curated
    await page.getByRole('link', { name: 'Descobrir', exact: true }).click();
    const badges = page.locator('.child-card').getByText('Community');
    await expect(badges).toHaveCount(0);

    // 3. Go to Settings and toggle community switch
    await page.getByRole('link', { name: 'Configurações' }).click();
    const toggle = page.getByRole('switch', { name: 'Mostrar jogos Community no modo infantil' });
    await expect(toggle).not.toBeChecked();
    await toggle.click();
    await expect(toggle).toBeChecked();
  });
});
