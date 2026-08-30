import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Hub production navigation never embeds a localhost App fallback', () => {
  const source = fs.readFileSync(new URL('../../apps/hub/src/main.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /http:\/\/localhost:4173/);
  assert.match(source, /VITE_APRINCAR_APP_URL/);
});
