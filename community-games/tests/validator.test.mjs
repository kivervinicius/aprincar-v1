import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function runFixture(manifest, html) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aprincar-community-validator-'));
  const dir = path.join(root, 'publisher', 'game');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(dir, 'game.html'), html);
  const result = spawnSync(process.execPath, ['scripts/validate.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, APRINCAR_GAMES_DIR: root },
    encoding: 'utf8',
  });
  fs.rmSync(root, { recursive: true, force: true });
  return result;
}

const baseManifest = {
  manifestVersion: 1,
  id: 'community.fixture', kind: 'game', version: '1.0.0', publisher: 'community',
  name: { 'pt-BR': 'Fixture' }, engines: { aprincar: '^1.0.0', sdkProtocol: 1 },
  entrypoints: { game: 'game.html' }, permissions: [], optionalPermissions: [],
  contributes: { skills: ['logic.patterns.ab'] }, offline: true, bundleMode: 'single-html',
};

test('community validator rejects remote executable code in isolated fixtures', () => {
  const result = runFixture(baseManifest, '<script src="https://evil.example/game.js"></script>');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /remote\/dynamic executable/i);
});

test('community validator rejects sensitive permissions without maintainer exception', () => {
  const result = runFixture({ ...baseManifest, permissions: ['network'] }, '<script>1</script>');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /sensitive permission/i);
});
