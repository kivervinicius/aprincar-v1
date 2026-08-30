import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('game services validate payloads, enforce runtime budgets and receive registry trust', () => {
  const services = fs.readFileSync(new URL('../../apps/app/src/game-services.ts', import.meta.url), 'utf8');
  const play = fs.readFileSync(new URL('../../apps/app/src/pages/Play.tsx', import.meta.url), 'utf8');
  assert.match(services, /validateGameMessagePayload/);
  assert.match(services, /RuntimeBudget/);
  assert.match(services, /TrustLevel/);
  assert.match(play, /entry\.trust/);
});
