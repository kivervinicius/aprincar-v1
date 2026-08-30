import { test, expect } from '@playwright/test';
import { clickCanvasTarget, completeOnboarding, getGameState, openGame } from './helpers';

test.describe('Gameplay and Evidence Generation', () => {
  test('renders a procedural Phaser round, rejects a wrong answer and advances on the correct answer', async ({
    page,
  }) => {
    await completeOnboarding(page, 'Theo');

    const { frame } = await openGame(page, 'aprincar.counting-animals', 'Conte os Bichos');
    const initial = await getGameState(frame);
    expect(initial).toBeTruthy();
    const answer = initial.challenge.answer;
    expect(answer).toBeDefined();

    const wrong = initial.targets.find((t) => t.kind === 'choice' && t.value !== answer);
    const correct = initial.targets.find((t) => t.kind === 'choice' && t.value === answer);
    expect(wrong).toBeTruthy();
    expect(correct).toBeTruthy();

    await clickCanvasTarget(page, frame, wrong!);
    await expect.poll(async () => (await getGameState(frame)).lastResult).toBe('failure');
    await expect.poll(async () => (await getGameState(frame)).inputReady).toBe(true);

    await clickCanvasTarget(page, frame, correct!);
    await expect
      .poll(async () => (await getGameState(frame)).level, { timeout: 8000 })
      .toBeGreaterThan(initial.level);

    await page.goto('/');
    await page.getByLabel('Menu de perfis').click();
    await page.getByRole('menuitem', { name: 'Área do responsável' }).click();
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await expect(page.getByText('Contar até 10')).toBeVisible();
  });
});
