import test from 'node:test';
import assert from 'node:assert/strict';
import { isGameMessage, PROTOCOL_VERSION } from '../extension-sdk/src/protocol.ts';

test('accepts known SDK protocol messages and rejects arbitrary messages', () => {
  assert.equal(PROTOCOL_VERSION, 1);
  assert.equal(isGameMessage({ type: 'session.start', requestId: '1', payload: {} }), true);
  assert.equal(
    isGameMessage({ type: 'evidence.submit', requestId: '2', payload: { skillId: 'math.counting.1-10' } }),
    true,
  );
  assert.equal(isGameMessage({ type: 'parent.dom.write', requestId: '3', payload: {} }), false);
});
