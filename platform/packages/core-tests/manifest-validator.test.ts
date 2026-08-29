import test from 'node:test';
import assert from 'node:assert/strict';
import { validateExtensionManifest } from '../extension-contracts/src/validate.ts';

test('accepts a valid offline game extension manifest', () => {
  const result = validateExtensionManifest({
    manifestVersion: 1,
    id: 'aprincar.counting-animals',
    kind: 'game',
    version: '1.0.0',
    publisher: 'aprincar',
    name: { 'pt-BR': 'Conte os Bichos' },
    engines: { aprincar: '^1.0.0', sdkProtocol: 1 },
    entrypoints: { game: 'game.html' },
    permissions: ['storage', 'audio'],
    optionalPermissions: [],
    contributes: { skills: ['math.counting.1-10'], ageGuidance: { min: 4, max: 7 } },
    offline: true,
    bundleMode: 'single-html',
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test('rejects remote-code permission and invalid identifiers', () => {
  const result = validateExtensionManifest({
    manifestVersion: 1,
    id: 'Bad Id',
    kind: 'game',
    version: '1',
    publisher: '',
    name: {},
    engines: { aprincar: '^1.0.0', sdkProtocol: 1 },
    entrypoints: { game: 'https://evil.example/game.js' },
    permissions: ['network', 'remote-code'],
    optionalPermissions: [],
    contributes: { skills: [] },
    offline: false,
    bundleMode: 'single-html',
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('id')));
  assert.ok(result.errors.some((error) => error.includes('remote-code')));
});
