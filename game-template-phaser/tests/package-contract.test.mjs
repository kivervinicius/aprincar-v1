import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('template exposes build, package and validation as explicit production gates', () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(typeof pkg.scripts.validate, 'string');
  assert.match(pkg.scripts.check, /validate/);
  assert.equal(fs.existsSync(new URL('../scripts/validate.mjs', import.meta.url)), true);
});
