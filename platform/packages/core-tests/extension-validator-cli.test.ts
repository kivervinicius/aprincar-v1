import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('canonical extension validator CLI rejects unknown Aprincar skills', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aprincar-extension-'));
  const manifest = {
    manifestVersion: 1,
    id: 'example.bad-skill',
    kind: 'game',
    version: '1.0.0',
    publisher: 'example',
    name: { 'pt-BR': 'Bad Skill' },
    engines: { aprincar: '^1.0.0', sdkProtocol: 1 },
    entrypoints: { game: 'game.html' },
    permissions: [],
    optionalPermissions: [],
    contributes: { skills: ['does.not.exist'] },
    offline: true,
    bundleMode: 'single-html',
  };
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(dir, 'game.html'), '<!doctype html><script>console.log("ok")</script>');
  const cli = new URL('../extension-validator/src/cli.mjs', import.meta.url).pathname;
  const result = spawnSync(process.execPath, ['--experimental-strip-types', cli, dir], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknown skill/i);
});
