import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('crosswalk validator enforces Aprincar Skill and BNCC reference catalogs', () => {
  const source = fs.readFileSync(new URL('../scripts/validate.mjs', import.meta.url), 'utf8');
  assert.match(source, /skill-ids\.json/);
  assert.match(source, /bncc-v1\.json/);
  assert.match(source, /duplicate/i);
});

import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

function runWithMappings(mappings) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aprincar-bncc-'));
  const file = path.join(dir, 'mappings.json');
  fs.writeFileSync(file, JSON.stringify(mappings));
  const result = spawnSync(process.execPath, ['scripts/validate.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, APRINCAR_MAPPINGS_FILE: file },
    encoding: 'utf8',
  });
  fs.rmSync(dir, { recursive: true, force: true });
  return result;
}

test('validator rejects an unknown Aprincar Skill ID', () => {
  const valid = JSON.parse(fs.readFileSync(new URL('../mappings.json', import.meta.url), 'utf8'));
  const result = runWithMappings([{ ...valid[0], skillId: 'math.not-a-real-skill' }]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknown skill/i);
});

test('validator rejects an unknown BNCC reference code', () => {
  const valid = JSON.parse(fs.readFileSync(new URL('../mappings.json', import.meta.url), 'utf8'));
  const result = runWithMappings([
    { ...valid[0], reference: { ...valid[0].reference, code: 'EF99ZZ99' } },
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknown BNCC/i);
});

test('validator rejects duplicate crosswalk relations', () => {
  const valid = JSON.parse(fs.readFileSync(new URL('../mappings.json', import.meta.url), 'utf8'));
  const result = runWithMappings([valid[0], valid[0]]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /duplicate/i);
});
