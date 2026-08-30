import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (relative: string) => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');

test('GitHub Pages serves the App shell for deep-link refreshes', () => {
  const workflow = read('../../../.github/workflows/pages.yml');

  assert.match(workflow, /cp site\/app\/index\.html site\/404\.html/);
  assert.match(workflow, /VITE_BASE_PATH=\/aprincar-v1\/app\//);
});

test('PWA checks for and activates a newer application version', () => {
  const entry = read('../../apps/app/src/main.tsx');
  const worker = read('../../apps/app/src/sw.ts');

  assert.match(entry, /registration\.update\(\)/);
  assert.match(entry, /onNeedRefresh\(\)/);
  assert.match(entry, /updateServiceWorker\(true\)/);
  assert.match(entry, /controllerchange/);
  assert.match(worker, /self\.skipWaiting\(\)/);
});
