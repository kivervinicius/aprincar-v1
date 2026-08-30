import test from 'node:test';
import assert from 'node:assert/strict';
import { ProgressEngine } from '../progress-engine/src/index.ts';
import type { EvidenceEvent } from '../extension-contracts/src/types.ts';

const ev = (gameId: string, result: 'success' | 'failure', independent = true): EvidenceEvent => ({
  id: crypto.randomUUID(),
  profileId: 'sofia',
  gameId,
  sessionId: crypto.randomUUID(),
  skillId: 'math.counting.1-10',
  result,
  independent,
  assistance: independent ? 'none' : 'hint',
  difficulty: 0.5,
  confidence: 0.9,
  occurredAt: new Date().toISOString(),
});

test('consolidates evidence from different games into one skill state', () => {
  const engine = new ProgressEngine();
  const state = engine.calculate('sofia', 'math.counting.1-10', [
    ev('aprincar.counting-animals', 'success'),
    ev('aprincar.fruit-basket', 'success'),
    ev('aprincar.block-tower', 'success'),
    ev('aprincar.counting-animals', 'success'),
  ]);
  assert.equal(state.skillId, 'math.counting.1-10');
  assert.ok(['comfortable', 'consolidated'].includes(state.state));
  assert.equal(state.contextCount, 3);
});

test('does not mark mastery from one game context only', () => {
  const engine = new ProgressEngine();
  const state = engine.calculate(
    'sofia',
    'math.counting.1-10',
    Array.from({ length: 10 }, () => ev('only-one-game', 'success')),
  );
  assert.notEqual(state.state, 'consolidated');
});

test('community evidence can inform progress but cannot independently consolidate mastery', () => {
  const engine = new ProgressEngine();
  const evidence = [
    ev('community-a', 'success'),
    ev('community-b', 'success'),
    ev('community-c', 'success'),
    ev('community-a', 'success'),
    ev('community-b', 'success'),
    ev('community-c', 'success'),
  ].map((item) => ({ ...item, trust: 'community' as const }));
  const state = engine.calculate('sofia', 'math.counting.1-10', evidence as any);
  assert.notEqual(state.state, 'consolidated');
});

test('experimental evidence does not mutate pedagogical skill state', () => {
  const engine = new ProgressEngine();
  const evidence = [
    ev('experimental-a', 'success'),
    ev('experimental-b', 'success'),
    ev('experimental-c', 'success'),
    ev('experimental-a', 'success'),
    ev('experimental-b', 'success'),
    ev('experimental-c', 'success'),
  ].map((item) => ({ ...item, trust: 'experimental' as const }));
  const state = engine.calculate('sofia', 'math.counting.1-10', evidence as any);
  assert.equal(state.state, 'unknown');
  assert.equal(state.evidenceCount, 0);
});
