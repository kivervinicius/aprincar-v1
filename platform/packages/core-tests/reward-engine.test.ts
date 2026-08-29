import test from 'node:test';
import assert from 'node:assert/strict';
import { RewardEngine } from '../reward-engine/src/index.ts';

test('rewards are independent from pedagogical mastery', () => {
  const engine = new RewardEngine();
  const reward = engine.grant({
    profileId: 'sofia',
    gameId: 'aprincar.paint',
    reason: 'session-complete',
    amount: 10,
  });
  assert.equal(reward.amount, 10);
  assert.equal('skillId' in reward, false);
  assert.equal('mastery' in reward, false);
});
