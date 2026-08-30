import { expect, type Frame, type Page } from '@playwright/test';

export type GameTarget = {
  value: string | number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  kind?: string;
  normalized?: { x: number; y: number };
};

export type GameState = {
  mode: string;
  variant?: string;
  level: number;
  challenge: Record<string, unknown> & {
    answer?: string | number;
    options?: Array<string | number>;
    cards?: Array<{ id: string; pairId: string; value: string }>;
    pairs?: number;
  };
  targets: GameTarget[];
  selectedCount?: number;
  inputReady?: boolean;
  lastResult?: string | null;
  lastGesture?: string;
  matchedPairs?: number;
  moves?: number;
  strokeCount?: number;
  paintSaved?: boolean;
  paintStrokeCount?: number;
};

declare global {
  interface Window {
    __APRINCAR_GAME_STATE__?: GameState;
  }
}

export async function completeOnboarding(page: Page, name: string) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Quem vai brincar?' })).toBeVisible({ timeout: 10000 });
  await page.getByLabel('Nome ou apelido').fill(name);
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Quantos anos?' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'O que já gosta de explorar?' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Interesses' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Tempo para brincar' })).toBeVisible();
  await page.getByRole('button', { name: 'Criar meu espaço' }).click();
  await expect(page.getByText(new RegExp(`Oi, ${name}!`))).toBeVisible();
}

export async function openGame(page: Page, gameId: string, title: string) {
  await page.getByRole('link', { name: 'Descobrir', exact: true }).click();
  const card = page.locator(`[data-game-id="${gameId}"]`);
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Jogar' }).click();
  const iframe = page.locator(`iframe[title="${title}"]`);
  await expect(iframe).toBeVisible();
  const handle = await iframe.elementHandle();
  const frame = await handle?.contentFrame();
  expect(frame).toBeTruthy();
  await expect
    .poll(async () => Boolean(await frame!.evaluate(() => window.__APRINCAR_GAME_STATE__)))
    .toBe(true);
  return { frame: frame!, iframe };
}

export async function getGameState(frame: Frame): Promise<GameState> {
  const state = await frame.evaluate(() => window.__APRINCAR_GAME_STATE__);
  expect(state).toBeTruthy();
  return state!;
}

export async function waitForGameInput(frame: Frame) {
  await expect.poll(async () => (await getGameState(frame)).inputReady).toBe(true);
}

async function canvasBox(frame: Frame) {
  const canvas = frame.locator('canvas');
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box).toBeTruthy();
  return box!;
}

export async function clickCanvasTarget(_page: Page, frame: Frame, target: GameTarget) {
  expect(target.x).toBeDefined();
  expect(target.y).toBeDefined();
  const box = await canvasBox(frame);
  await frame.locator('canvas').click({
    position: { x: (target.x! / 960) * box.width, y: (target.y! / 640) * box.height },
  });
}

export async function dragCanvasTarget(page: Page, frame: Frame, from: GameTarget, to: GameTarget) {
  expect(from.x).toBeDefined();
  expect(from.y).toBeDefined();
  expect(to.x).toBeDefined();
  expect(to.y).toBeDefined();
  const box = await canvasBox(frame);
  const start = { x: box.x + (from.x! / 960) * box.width, y: box.y + (from.y! / 640) * box.height };
  const end = { x: box.x + (to.x! / 960) * box.width, y: box.y + (to.y! / 640) * box.height };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 12 });
  await page.mouse.up();
}

export async function drawCanvasStroke(page: Page, frame: Frame, points: Array<{ x: number; y: number }>) {
  expect(points.length).toBeGreaterThan(1);
  const box = await canvasBox(frame);
  const [first, ...rest] = points;
  expect(first).toBeTruthy();
  await page.mouse.move(box.x + (first!.x / 960) * box.width, box.y + (first!.y / 640) * box.height);
  await page.mouse.down();
  for (const point of rest) {
    await page.mouse.move(box.x + (point.x / 960) * box.width, box.y + (point.y / 640) * box.height, {
      steps: 5,
    });
  }
  await page.mouse.up();
}

export async function clickThreeTarget(page: Page, frame: Frame, target: GameTarget) {
  expect(target.normalized).toBeTruthy();
  const box = await canvasBox(frame);
  await page.mouse.click(box.x + target.normalized!.x * box.width, box.y + target.normalized!.y * box.height);
}
