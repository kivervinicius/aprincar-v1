import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui = fs.readFileSync(new URL('../ui/src/index.tsx', import.meta.url), 'utf8');
const mark = fs.readFileSync(
  new URL('../../apps/app/public/brand/aprincar-mark.svg', import.meta.url),
  'utf8',
);
const logo = fs.readFileSync(
  new URL('../../apps/app/public/brand/aprincar-logo.svg', import.meta.url),
  'utf8',
);
const icon192 = fs.readFileSync(new URL('../../apps/app/public/icons/icon-192.svg', import.meta.url), 'utf8');
const icon512 = fs.readFileSync(new URL('../../apps/app/public/icons/icon-512.svg', import.meta.url), 'utf8');

test('Brand System v3 uses the approved star identity and multicolor wordmark everywhere', () => {
  assert.match(ui, /data-aprincar-brand=["']star-v3["']/);
  assert.match(ui, /AprincarMascot/);
  assert.match(ui, /aprincar-wordmark-letter/);
  assert.match(ui, /#FBCB24/i);
  assert.match(ui, /#2563EB/i);
  assert.doesNotMatch(ui, /aprincar-mark-pieces/);

  for (const asset of [mark, logo, icon192, icon512]) {
    assert.match(asset, /data-brand-version=["']3["']/);
    assert.match(asset, /aprincar-star/i);
    assert.match(asset, /#FBCB24/i);
  }
  assert.match(logo, /Aprincar/);
  assert.match(logo, /#2563EB/i);
  assert.match(logo, /#22C55E/i);
  assert.match(logo, /#F43F5E/i);
});
