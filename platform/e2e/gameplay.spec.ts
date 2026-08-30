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
    await expect.poll(async () => (await getGameState(frame)).lastResult, { timeout: 10000 }).toBe('failure');
    await expect.poll(async () => (await getGameState(frame)).inputReady, { timeout: 10000 }).toBe(true);
    await page.waitForTimeout(300);

    const updatedState = await getGameState(frame);
    const updatedCorrect = updatedState.targets.find((t) => t.kind === 'choice' && t.value === answer);
    await clickCanvasTarget(page, frame, updatedCorrect || correct!);
    await expect
      .poll(async () => (await getGameState(frame)).level, { timeout: 10000 })
      .toBeGreaterThan(initial.level);

    await page.goto('/parent');
    await expect(page.getByText('Olá, responsável!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Contar até 10')).toBeVisible({ timeout: 10000 });
  });
});
