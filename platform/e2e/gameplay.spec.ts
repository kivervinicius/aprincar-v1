import { test, expect } from '@playwright/test';

type GameTarget = { value: number; x: number; y: number };
type GameState = {
  level: number;
  challenge: { options: number[]; answer: number };
  targets: GameTarget[];
  lastResult?: string;
};

test.describe('Gameplay and Evidence Generation', () => {
  test('renders a procedural Phaser round, rejects a wrong answer and advances on the correct answer', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByLabel('Nome ou apelido').fill('Theo');
    await page.getByRole('button', { name: /Criar (perfil|meu espaço)/ }).click();
    await expect(page.getByText(/Olá, Theo!/)).toBeVisible();

    await page.getByRole('link', { name: 'Descobrir', exact: true }).click();
    const gameCard = page.locator('[data-game-id="aprincar.counting-animals"]');
    await expect(gameCard).toBeVisible();
    await gameCard.getByRole('button', { name: 'Jogar' }).click();

    const iframe = page.locator('iframe[title="Conte os Bichos"]');
    await expect(iframe).toBeVisible();
    const frame = page.frames().find((candidate) => candidate !== page.mainFrame());
    expect(frame).toBeTruthy();
    await expect
      .poll(async () =>
        frame!.evaluate(() => {
          const state = (window as unknown as { __APRINCAR_GAME_STATE__?: GameState })
            .__APRINCAR_GAME_STATE__;
          return Boolean(state?.targets.length && state.targets.length >= 3);
        }),
      )
      .toBe(true);

    const initial = await frame!.evaluate(
      () => (window as unknown as { __APRINCAR_GAME_STATE__?: GameState }).__APRINCAR_GAME_STATE__,
    );
    expect(initial).toBeTruthy();
    expect(initial.challenge.options.filter((x: number) => x === initial.challenge.answer)).toHaveLength(1);

    const wrong = initial.targets.find((x) => x.value !== initial.challenge.answer);
    const correct = initial.targets.find((x) => x.value === initial.challenge.answer);
    expect(wrong).toBeTruthy();
    expect(correct).toBeTruthy();

    const canvas = frame!.locator('canvas');
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    const clickTarget = async (target: GameTarget) => {
      await page.mouse.click(box!.x + (target.x / 960) * box!.width, box!.y + (target.y / 640) * box!.height);
    };

    await clickTarget(wrong);
    await expect
      .poll(async () =>
        frame!.evaluate(
          () =>
            (window as unknown as { __APRINCAR_GAME_STATE__?: GameState }).__APRINCAR_GAME_STATE__
              ?.lastResult,
        ),
      )
      .toBe('failure');
    await clickTarget(correct);
    await expect
      .poll(
        async () =>
          frame!.evaluate(
            () =>
              (window as unknown as { __APRINCAR_GAME_STATE__?: GameState }).__APRINCAR_GAME_STATE__?.level ??
              1,
          ),
        {
          timeout: 3000,
        },
      )
      .toBeGreaterThan(1);

    await page.getByRole('link', { name: 'Responsável' }).click();
    await expect(page.getByText('Olá, responsável!')).toBeVisible();
    await expect(page.getByText('Contar até 10')).toBeVisible();
  });
});
