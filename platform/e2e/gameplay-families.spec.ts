import { expect, test, type Frame, type Page } from '@playwright/test';
import {
  clickCanvasTarget,
  clickThreeTarget,
  completeOnboarding,
  dragCanvasTarget,
  drawCanvasStroke,
  getGameState,
  openGame,
  type GameState,
  type GameTarget,
  waitForGameInput,
} from './helpers';

function targetByKind(state: GameState, kind: string, value?: string | number) {
  return state.targets.find(
    (target) => target.kind === kind && (value === undefined || target.value === value),
  );
}

async function chooseWrongThenCorrect(page: Page, frame: Frame) {
  await waitForGameInput(frame);
  const initial = await getGameState(frame);
  const answer = initial.challenge.answer;
  expect(answer).toBeDefined();
  const wrong = initial.targets.find((target) => target.kind === 'choice' && target.value !== answer);
  const correct = initial.targets.find((target) => target.kind === 'choice' && target.value === answer);
  expect(wrong).toBeTruthy();
  expect(correct).toBeTruthy();

  await clickCanvasTarget(page, frame, wrong!);
  await expect.poll(async () => (await getGameState(frame)).lastResult, { timeout: 10000 }).toBe('failure');
  await waitForGameInput(frame);
  await page.waitForTimeout(300);

  const updatedState = await getGameState(frame);
  const updatedCorrect = updatedState.targets.find(
    (target) => target.kind === 'choice' && target.value === answer,
  );
  await clickCanvasTarget(page, frame, updatedCorrect || correct!);
  await expect.poll(async () => (await getGameState(frame)).lastResult, { timeout: 10000 }).toBe('success');
  await expect
    .poll(async () => (await getGameState(frame)).level, { timeout: 10000 })
    .toBeGreaterThan(initial.level);
}

async function exerciseReversibleCounting(page: Page, gameId: string, title: string) {
  await completeOnboarding(page, title.includes('Frutas') ? 'Lia' : 'Bia');
  const { frame } = await openGame(page, gameId, title);
  await waitForGameInput(frame);
  const initial = await getGameState(frame);
  const answer = Number(initial.challenge.answer);
  expect(Number.isFinite(answer)).toBe(true);
  const toggles = initial.targets.filter((target) => target.kind === 'toggle');
  expect(toggles.length).toBeGreaterThan(answer);
  const action = targetByKind(initial, 'action', 'Conferir');
  expect(action).toBeTruthy();

  for (const target of toggles.slice(0, answer + 1)) {
    await clickCanvasTarget(page, frame, target);
    await page.waitForTimeout(100);
  }
  await expect
    .poll(async () => (await getGameState(frame)).selectedCount, { timeout: 10000 })
    .toBe(answer + 1);

  await clickCanvasTarget(page, frame, action!);
  await expect.poll(async () => (await getGameState(frame)).lastResult, { timeout: 10000 }).toBe('failure');
  await waitForGameInput(frame);

  await clickCanvasTarget(page, frame, toggles[answer]!);
  await expect.poll(async () => (await getGameState(frame)).selectedCount, { timeout: 10000 }).toBe(answer);
  await clickCanvasTarget(page, frame, action!);
  await expect
    .poll(async () => (await getGameState(frame)).level, { timeout: 10000 })
    .toBeGreaterThan(initial.level);
}

test.describe('Semantic gameplay for every official game family', () => {
  test('fruit basket can recover from overshooting and then complete the round', async ({ page }) => {
    await exerciseReversibleCounting(page, 'aprincar.fruit-basket', 'Cesta de Frutas');
  });

  test('block tower can remove blocks after a wrong count and then complete', async ({ page }) => {
    await exerciseReversibleCounting(page, 'aprincar.block-tower', 'Torre de Blocos');
  });

  test('color match rejects a wrong drop, resets the piece and accepts the correct drop', async ({
    page,
  }) => {
    await completeOnboarding(page, 'Mia');
    const { frame } = await openGame(page, 'aprincar.color-match', 'Mundo das Cores');
    const initial = await getGameState(frame);
    const answer = initial.challenge.answer;
    const source = targetByKind(initial, 'drag-source');
    const wrong = initial.targets.find((target) => target.kind === 'drop-zone' && target.value !== answer);
    const correct = initial.targets.find((target) => target.kind === 'drop-zone' && target.value === answer);
    expect(source).toBeTruthy();
    expect(wrong).toBeTruthy();
    expect(correct).toBeTruthy();

    await dragCanvasTarget(page, frame, source!, wrong!);
    await expect.poll(async () => (await getGameState(frame)).lastResult).toBe('failure');
    await waitForGameInput(frame);
    await dragCanvasTarget(page, frame, source!, correct!);
    await expect
      .poll(async () => (await getGameState(frame)).level, { timeout: 10000 })
      .toBeGreaterThan(initial.level);
  });

  test('pattern game rejects a distractor and advances only on the generated answer', async ({ page }) => {
    await completeOnboarding(page, 'Noah');
    const { frame } = await openGame(page, 'aprincar.pattern-play', 'Trem dos Padrões');
    await chooseWrongThenCorrect(page, frame);
  });

  test('letter hunt rejects a distractor and advances on the generated letter', async ({ page }) => {
    await completeOnboarding(page, 'Luna');
    const { frame } = await openGame(page, 'aprincar.letter-hunt', 'Caça às Letras');
    await chooseWrongThenCorrect(page, frame);
  });

  test('memory reports a mismatch and can solve every generated pair', async ({ page }) => {
    await completeOnboarding(page, 'Davi');
    const { frame } = await openGame(page, 'aprincar.memory-animals', 'Memória dos Bichos');
    await waitForGameInput(frame);
    const initial = await getGameState(frame);
    const cards = initial.challenge.cards ?? [];
    expect(cards.length).toBeGreaterThanOrEqual(6);

    const first = cards[0]!;
    const mismatch = cards.find((card) => card.pairId !== first.pairId);
    expect(mismatch).toBeTruthy();
    const targetFor = (id: string) =>
      initial.targets.find((target) => target.kind === 'memory-card' && target.value === id);
    expect(targetFor(first.id)).toBeTruthy();
    expect(targetFor(mismatch!.id)).toBeTruthy();

    await clickCanvasTarget(page, frame, targetFor(first.id)!);
    await page.waitForTimeout(250);
    await clickCanvasTarget(page, frame, targetFor(mismatch!.id)!);
    await expect.poll(async () => (await getGameState(frame)).lastResult, { timeout: 10000 }).toBe('failure');
    await waitForGameInput(frame);

    const pairs = new Map<string, string[]>();
    for (const card of cards) pairs.set(card.pairId, [...(pairs.get(card.pairId) ?? []), card.id]);
    let matched = 0;
    for (const ids of pairs.values()) {
      expect(ids).toHaveLength(2);
      for (const id of ids) {
        await clickCanvasTarget(page, frame, targetFor(id)!);
        await page.waitForTimeout(250);
      }
      matched += 1;
      await expect
        .poll(async () => (await getGameState(frame)).matchedPairs, { timeout: 10000 })
        .toBe(matched);
      await waitForGameInput(frame);
    }

    await expect
      .poll(async () => (await getGameState(frame)).level, { timeout: 10000 })
      .toBeGreaterThan(initial.level);
  });

  test('handwriting evaluates the requested letter and advances for a recognizable A', async ({ page }) => {
    await completeOnboarding(page, 'Iara');
    const { frame } = await openGame(page, 'aprincar.write-a', 'Ateliê de Letras');
    const initial = await getGameState(frame);
    expect(initial.challenge.answer).toBe('A');

    await drawCanvasStroke(page, frame, [
      { x: 421, y: 477 },
      { x: 510, y: 330 },
      { x: 600, y: 183 },
      { x: 690, y: 330 },
      { x: 779, y: 477 },
    ]);
    await drawCanvasStroke(page, frame, [
      { x: 497, y: 358 },
      { x: 600, y: 358 },
      { x: 703, y: 358 },
    ]);
    await expect.poll(async () => (await getGameState(frame)).strokeCount).toBe(2);
    const action = targetByKind(await getGameState(frame), 'action', 'Conferir');
    expect(action).toBeTruthy();
    await clickCanvasTarget(page, frame, action!);
    await expect
      .poll(async () => (await getGameState(frame)).level, { timeout: 10000 })
      .toBeGreaterThan(initial.level);
  });

  test('paint stores a real drawing instead of only showing a success message', async ({ page }) => {
    await completeOnboarding(page, 'Ana');
    const { frame } = await openGame(page, 'aprincar.paint-free', 'Pintura Livre');
    await drawCanvasStroke(page, frame, [
      { x: 320, y: 270 },
      { x: 430, y: 330 },
      { x: 540, y: 260 },
      { x: 650, y: 380 },
    ]);
    await expect.poll(async () => (await getGameState(frame)).paintStrokeCount ?? 0).toBeGreaterThan(0);
    const action = targetByKind(await getGameState(frame), 'action', 'Guardar desenho');
    expect(action).toBeTruthy();
    await clickCanvasTarget(page, frame, action!);
    await expect.poll(async () => (await getGameState(frame)).paintSaved).toBe(true);
  });

  test('3D distinguishes drag from tap, rejects a wrong solid and accepts the correct one', async ({
    page,
  }) => {
    await completeOnboarding(page, 'Gui');
    const { frame } = await openGame(page, 'aprincar.space-shapes-3d', 'Formas no Espaço 3D');
    const initial = await getGameState(frame);
    const canvas = frame.locator('canvas');
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();

    await page.mouse.move(box!.x + box!.width * 0.5, box!.y + box!.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * 0.7, box!.y + box!.height * 0.5, { steps: 12 });
    await page.mouse.up();
    await expect.poll(async () => (await getGameState(frame)).lastGesture).toBe('drag');
    expect((await getGameState(frame)).level).toBe(initial.level);

    const answer = initial.challenge.answer;
    const wrong = initial.targets.find((target) => target.value !== answer);
    const correct = initial.targets.find((target) => target.value === answer);
    expect(wrong?.normalized).toBeTruthy();
    expect(correct?.normalized).toBeTruthy();

    await clickThreeTarget(page, frame, wrong!);
    await expect.poll(async () => (await getGameState(frame)).lastResult).toBe('failure');
    const current = await getGameState(frame);
    const currentCorrect = current.targets.find((target) => target.value === current.challenge.answer);
    expect(currentCorrect?.normalized).toBeTruthy();
    await clickThreeTarget(page, frame, currentCorrect!);
    await expect
      .poll(async () => (await getGameState(frame)).level, { timeout: 10000 })
      .toBeGreaterThan(initial.level);
  });
});
