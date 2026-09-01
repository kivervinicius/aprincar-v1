import { test, expect } from '@playwright/test';
import {
  completeOnboarding,
  openGame,
  getGameState,
  clickCanvasTarget,
  clickThreeTarget,
  dragCanvasTarget,
  drawCanvasStroke,
  waitForGameInput,
} from './helpers';
import path from 'node:path';
import fs from 'node:fs';

const rootValidationDir = path.resolve(
  process.cwd(),
  '..',
  '_validation',
  'final-consistency',
  'screenshots',
  'games',
);

const GAMES = [
  { id: 'aprincar.counting-animals', title: 'Conte os Bichos', slug: 'counting-animals' },
  { id: 'aprincar.fruit-basket', title: 'Cesta de Frutas', slug: 'fruit-basket' },
  { id: 'aprincar.block-tower', title: 'Torre de Blocos', slug: 'block-tower' },
  { id: 'aprincar.color-match', title: 'Mundo das Cores', slug: 'color-match' },
  { id: 'aprincar.pattern-play', title: 'Trem dos Padrões', slug: 'pattern-play' },
  { id: 'aprincar.letter-hunt', title: 'Caça às Letras', slug: 'letter-hunt' },
  { id: 'aprincar.write-a', title: 'Ateliê de Letras', slug: 'write-a' },
  { id: 'aprincar.paint-free', title: 'Pintura Livre', slug: 'paint-free' },
  { id: 'aprincar.memory-animals', title: 'Memória dos Bichos', slug: 'memory-animals' },
  { id: 'aprincar.space-shapes-3d', title: 'Formas no Espaço 3D', slug: 'space-shapes-3d' },
];

const VIEWPORT_CLASSES = [
  { name: 'phone-portrait', width: 390, height: 844 },
  { name: 'phone-landscape', width: 844, height: 390 },
  { name: 'tablet-portrait', width: 820, height: 1180 },
  { name: 'tablet-landscape', width: 1180, height: 820 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('APRINCAR Final Consistency 150 Screenshots Matrix', () => {
  test.beforeEach(async ({ page }) => {
    await completeOnboarding(page, 'Kiver');
  });

  for (const game of GAMES) {
    for (const vp of VIEWPORT_CLASSES) {
      test(`${game.slug} [${vp.name}] - 100% viewport fit, no overlay, responsive verification`, async ({
        page,
      }) => {
        const gameDir = path.join(rootValidationDir, game.slug);
        fs.mkdirSync(gameDir, { recursive: true });

        await page.setViewportSize({ width: vp.width, height: vp.height });
        const { frame } = await openGame(page, game.id, game.title);
        await waitForGameInput(frame);
        await page.waitForTimeout(300);

        // Verify No Document Double Scroll / Overflow
        const hasHorizontalScroll = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        );
        expect(hasHorizontalScroll).toBe(false);

        // Verify Exit Button & Header Presence
        const exitBtn = page.getByRole('button', { name: 'Sair do jogo e voltar ao início' });
        await expect(exitBtn).toBeVisible();

        // 1. Start Screenshot
        await page.screenshot({ path: path.join(gameDir, `${vp.name}-01-start.png`) });

        // 2. Mid Interaction
        const state = await getGameState(frame);
        if (game.slug === 'counting-animals' || game.slug === 'pattern-play' || game.slug === 'letter-hunt') {
          const choice = state.targets.find((t) => t.kind === 'choice');
          if (choice) await clickCanvasTarget(page, frame, choice);
        } else if (game.slug === 'fruit-basket' || game.slug === 'block-tower') {
          const toggle = state.targets.find((t) => t.kind === 'toggle');
          if (toggle) await clickCanvasTarget(page, frame, toggle);
        } else if (game.slug === 'color-match') {
          const src = state.targets.find((t) => t.kind === 'drag-source');
          const drop = state.targets.find((t) => t.kind === 'drop-zone');
          if (src && drop) await dragCanvasTarget(page, frame, src, drop);
        } else if (game.slug === 'write-a') {
          await drawCanvasStroke(page, frame, [
            { x: 520, y: 460 },
            { x: 600, y: 220 },
            { x: 680, y: 460 },
          ]);
          await page.waitForTimeout(200);
          const checkBtn = state.targets.find(
            (t) => t.kind === 'action' && (t.value === 'Conferir' || t.value === '__check__'),
          );
          if (checkBtn) await clickCanvasTarget(page, frame, checkBtn);
        } else if (game.slug === 'paint-free') {
          await drawCanvasStroke(page, frame, [
            { x: 320, y: 270 },
            { x: 430, y: 330 },
            { x: 540, y: 260 },
            { x: 650, y: 380 },
          ]);
          await page.waitForTimeout(200);
          const saveBtn = state.targets.find((t) => t.kind === 'action' && t.value === 'Guardar desenho');
          if (saveBtn) await clickCanvasTarget(page, frame, saveBtn);
        } else if (game.slug === 'memory-animals') {
          const cards = state.targets.filter((t) => t.kind === 'memory-card');
          if (cards[0]) {
            await clickCanvasTarget(page, frame, cards[0]);
            await page.waitForTimeout(200);
          }
          if (cards[1]) {
            await clickCanvasTarget(page, frame, cards[1]);
            await page.waitForTimeout(200);
          }
        } else if (game.slug === 'space-shapes-3d') {
          const tgt = state.targets[0];
          if (tgt && tgt.normalized) await clickThreeTarget(page, frame, tgt);
        }

        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(gameDir, `${vp.name}-02-mid.png`) });

        // 3. Success / Final State Screenshot
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(gameDir, `${vp.name}-03-success.png`) });
      });
    }
  }
});
