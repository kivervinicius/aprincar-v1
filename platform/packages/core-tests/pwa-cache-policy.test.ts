import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('PWA precaches the app shell but excludes extension bundles and provides SPA navigation fallback', () => {
  const vite = fs.readFileSync(new URL('../../apps/app/vite.config.ts', import.meta.url), 'utf8');
  const sw = fs.readFileSync(new URL('../../apps/app/src/sw.ts', import.meta.url), 'utf8');
  assert.match(vite, /globIgnores/);
  assert.match(vite, /extensions\/\*\*/);
  assert.match(sw, /createHandlerBoundToURL/);
  assert.match(sw, /NavigationRoute/);
});
