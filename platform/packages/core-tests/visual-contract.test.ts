import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Aprincar child experience preserves the approved custom visual contract', () => {
  const ui = fs.readFileSync(new URL('../ui/src/index.tsx', import.meta.url), 'utf8');
  const layout = fs.readFileSync(new URL('../../apps/app/src/layout.tsx', import.meta.url), 'utf8');
  const home = fs.readFileSync(new URL('../../apps/app/src/pages/Home.tsx', import.meta.url), 'utf8');
  const styles = fs.readFileSync(new URL('../../apps/app/src/styles.css', import.meta.url), 'utf8');

  assert.match(ui, /function BrandMark/);
  assert.match(ui, /#6F5BD7/i);
  assert.doesNotMatch(layout, /\bAppShell\b/);
  assert.match(layout, /aprincar-topbar/);
  assert.match(home, /child-hero/);
  assert.match(home, /game-shelf/);
  assert.match(styles, /--ap-bg:\s*#F7F6F2/i);
  assert.match(styles, /--ap-purple:\s*#6F5BD7/i);
  assert.match(styles, /border-radius:\s*var\(--ap-radius\)/);
});
