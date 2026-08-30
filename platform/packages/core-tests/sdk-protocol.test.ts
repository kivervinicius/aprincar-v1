import test from 'node:test';
import assert from 'node:assert/strict';
import { isGameMessage, PROTOCOL_VERSION } from '../extension-sdk/src/protocol.ts';
import * as protocol from '../extension-sdk/src/protocol.ts';

test('accepts known SDK protocol messages and rejects arbitrary messages', () => {
  assert.equal(PROTOCOL_VERSION, 1);
  assert.equal(isGameMessage({ type: 'session.start', requestId: '1', payload: {} }), true);
  assert.equal(
    isGameMessage({ type: 'evidence.submit', requestId: '2', payload: { skillId: 'math.counting.1-10' } }),
    true,
  );
  assert.equal(isGameMessage({ type: 'parent.dom.write', requestId: '3', payload: {} }), false);
});

test('validates payload bounds for untrusted game messages', () => {
  const validate = (protocol as any).validateGameMessagePayload;
  assert.equal(typeof validate, 'function');
  assert.equal(
    validate({
      type: 'evidence.submit',
      requestId: 'e1',
      payload: {
        skillId: 'math.counting.1-10',
        result: 'success',
        independent: true,
        assistance: 'none',
        difficulty: 0.7,
        confidence: 0.9,
        attempts: 1,
      },
    }).ok,
    true,
  );
  assert.equal(
    validate({
      type: 'evidence.submit',
      requestId: 'e2',
      payload: { skillId: 'math.counting.1-10', difficulty: Number.NaN, confidence: 2 },
    }).ok,
    false,
  );
  assert.equal(validate({ type: 'storage.set', payload: { key: 'x', value: 'a'.repeat(40_000) } }).ok, false);
  assert.equal(validate({ type: 'storage.get', payload: { key: '' } }).ok, false);
  assert.equal(
    validate({
      type: 'capability.request',
      payload: { name: 'handwriting.evaluate', payload: { strokes: ['x'.repeat(70_000)] } },
    }).ok,
    false,
  );
});

test('runtime budget blocks extension flooding within one session', () => {
  const RuntimeBudget = (protocol as any).RuntimeBudget;
  assert.equal(typeof RuntimeBudget, 'function');
  const budget = new RuntimeBudget({ evidence: 2, rewards: 1, storageWrites: 1 });
  budget.consume('evidence');
  budget.consume('evidence');
  assert.throws(() => budget.consume('evidence'), /quota/i);
  budget.consume('reward');
  assert.throws(() => budget.consume('reward'), /quota/i);
  budget.consume('storageWrite');
  assert.throws(() => budget.consume('storageWrite'), /quota/i);
});
