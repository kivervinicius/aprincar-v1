import { test, expect } from '@playwright/test';
import { completeOnboarding } from './helpers';

test.describe('Child Mode Community Games Filtering', () => {
  test('hides community games by default and keeps the responsible opt-in protected in settings', async ({
    page,
  }) => {
    await completeOnboarding(page, 'Clara');
    await page.getByRole('link', { name: 'Descobrir', exact: true }).first().click();
    await expect(page.locator('.child-card').getByText('Comunidade')).toHaveCount(0);

    await page.getByLabel('Menu de perfis').click();
    await page.getByRole('menuitem', { name: 'Configurações' }).click();
    const toggle = page.getByRole('switch', { name: 'Mostrar jogos Community no modo infantil' });
    await expect(toggle).not.toBeChecked();
    await toggle.click();
    await expect(toggle).toBeChecked();
  });
});
